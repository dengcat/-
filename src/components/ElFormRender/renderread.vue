<template>
  <div v-loading="loading">
    <el-card v-for="item in content" :key="item.id" style="margin-bottom:10px" class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-tickets" style="color:RGB(255,204,102)"></i><span style="margin-left:10px;">{{ item.name }}</span>
      </div>
      <div v-if="item.groupType===0 && item.name!=='相关文档'" class="formitemdiv">
        <div
          v-for="o in item.children"
          :class="[o.isOneLine===true? 'formitemoneline' : 'formitem','formiteminline']"
          :key="o.id"
        >
          <div style="line-height: 28px;flex: 0 0 180px; font-size:small;">
            <tool-tip v-if="o.remark!=''" :remark="o.remark">
              <div slot="content" v-html="o.remark"/>
              <font :color="[o.isMustFill==false? '#666':'#b3450e']">{{ o.name }}</font>
            </tool-tip>
            <font v-else :color="[o.isMustFill==false? '#666':'#b3450e']">{{ o.name }}</font>
            <el-tooltip
              v-if="o.formulaConditionText!==undefined && o.formulaConditionText!==null && o.formulaConditionText!=='' "
              :content="o.formulaConditionText"
              class="item"
              effect="dark"
              placement="top-start"
            >
              <svg-icon style="" icon-class="fx"/>
            </el-tooltip>
            <template v-if="isDisabled">：</template>
          </div>
          <div style="width:100%">
            <render-input v-validate="getValidate(o.isMustFill,o.valueType)"
              @NumValuechanged="handNumValueEvent"
              @TextValuechanged="handTextValueEvent"
              v-model="savedata[toLowerCaseFirst(o.fieldName || o.name)]"
              :data="o"
              :name="o.fieldName || o.name"
              :disabled="isDisabled"
              :setData="setData[o.name==='所属产品'? o.name : (o.businessParamName || o.name)]"
              :textVal="savedata[`${toLowerCaseFirst(o.fieldName || o.name)}__text`]"
              @UpdateSelectText="handUpdateSelectText"
              @SelectNode="UpdateProduct"
            />
            <span v-show="errors.has(o.fieldName || o.name)" class="error_span">{{ errors.first(o.fieldName || o.name) }}</span>
          </div>
        </div>
      </div>
      <div v-if="item.groupType===1" class="formitemdiv">
        <el-table
          :data="savedata[toLowerCaseFirst(item.name)]"
          border
          style="width: 100%"
        >
          <el-table-column
            min-width="150px"
            :render-header="(h,obj) => renderHeader(h,obj,o)"
            v-for="(o,$index) in item.children"
            :key="o.id"
            :label="o.name"
          >
            <template slot-scope="{row, column, $index }">
              <span>{{  row[`${o.fieldName || o.name}__text`] || row[o.fieldName || o.name]}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button v-if="!isDisabled" @click="handleEditRow(item,scope.row,scope.$index)" type="text">修改</el-button>
              <el-button v-if="!isDisabled" @click="handleDeleteRow(item,scope.$index)" type="text">删除</el-button>
              <el-button v-if="isDisabled" @click="handleEditRow(item,scope.row,scope.$index)" type="text">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="item.groupType===0 && item.name==='相关文档'" class="formitemdiv">
        <upload :isDisabled= "isDisabled" v-model="savedata['相关文档']"></upload>
      </div> 
    </el-card>
    <group
      v-if="currEditGroup && Object.keys(currEditGroup).length>0"
      :currEditGroup="currEditGroup"
      @closeWin="closeWin"
      :formData="currEditRow"
      :visible="groupVisible"
      @updateRow="handleEditOrAddGroupRow"
      @NumValuechanged="handNumValueEvent"
      @TextValuechanged="handTextValueEvent"
      :groupMode="groupMode"
      :setData="setData"
      :isDisabled ="isDisabled"
    ></group>
  </div>
</template>

<script>
import RenderFormItem from "./render-form-item";
import RenderInput from "./renderinput";
import Group from "./Group";
import { Form } from "element-ui";
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import { deepClone,newGuid } from "@/utils/index.js";
import treeTable from "@/components/TreeTable";
import { CodeToText } from "chinaData";
import mixincommom from "./mixin-commom";
import mixincalc from "./mixin-calc";
import ToolTip from "./ToolTip";
import { getBasicDataTreeByParamName,getParamValueListByParamName,getCodeSerialNumber } from "@/api/basicdata";
import { getBelongProductListByParentId } from "@/api/mdmmanager";
import Upload from "./Upload";



export default {
  name: "ElFormRender",
  mixins: [mixincommom, mixincalc],
  components: {
    RenderFormItem,
    RenderInput,
    treeTable,
    Group,
    ToolTip,
    Upload
  },
  filters: {
    LabelColor(isMustFill) {
      const intMap = {
        0: "#303133",
        1: "#b3450e"
      };
      return intMap[isMustFill];
    }
  },
  directives: { elDragDialog },
  props: Object.assign({}, {
    content: {
      type: Array,
      required: true
    },
    formdata: {
      type: Object
    },
    initData: {
      type: Object
    },
    mode: {
      type: String
    },
    businessObject: {
      type: Object
    }
  }),
  data() {
    // 业务参数
    const setData={}
    // 构造双向绑定数据结构，用于保存提交
    // 构建返回值数据结构
    const dydata = {
      详细地址__street: "",
      详细地址__area: "",
      详细地址__city: "",
      详细地址__province: "",
      详细地址__areaCode: ""
    }
    this.content.forEach(element => {
      if (element.groupType === 0) {
        element.children.forEach(childrenelement => {
          // 业务参数处理
          if(childrenelement.valueType=='业务参数'  || childrenelement.valueType=='业务对象'){
            if(childrenelement.name==='所属产品'){
              Object.defineProperty(
                setData,'所属产品',{
                  enumerable: true,
                  configurable: true,
                  writable: true,
                }
              )
              getBelongProductListByParentId({
                parentBusinessDataGuid:this.initData.data.parentGuid,
                businessObjectGuid:this.initData.data.businessObjectGuid
              }).then(
                (response) => {
                  setData[childrenelement.name] = response.data.result
                }
              )
            }
            else{
              Object.defineProperty(
              setData,this.toLowerCaseFirst(childrenelement.businessParamName),{
                  enumerable: true,
                  configurable: true,
                  writable: true,
                }
              )
            }
            if(childrenelement.businessParamName){
              switch(childrenelement.businessParamName){
                case '产品类型':
                  getBasicDataTreeByParamName(childrenelement.businessParamName).then(
                    (response) => {
                      setData[childrenelement.businessParamName] = response.data.result
                    }
                  )
                break;
                default:
                  getParamValueListByParamName(childrenelement.businessParamName).then(
                    (response) => {
                      setData[childrenelement.businessParamName] = response.data.result
                    }
                  )
                break;
              }
            }
            
            // switch(childrenelement.businessParamName){
            //   case '产品类型':
            //     getBasicDataTreeByParamName(childrenelement.businessParamName).then(
            //       (response) => {
            //         setData[childrenelement.businessParamName] = response.data.result
            //       }
            //     )
            //   break;
            //   default:
            //      getParamValueListByParamName(childrenelement.businessParamName).then(
            //       (response) => {
            //         setData[childrenelement.businessParamName] = response.data.result.paramValuList
            //       }
            //     )
            //   break;
            // }
            

            Object.defineProperty(
              dydata,
              `${this.toLowerCaseFirst(childrenelement.fieldName) ||
                this.toLowerCaseFirst(childrenelement.name)}__text`,
              {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (typeof(childrenelement.defaultValue)===undefined || childrenelement.defaultValue==='') ?undefined:childrenelement.defaultValue
              }
            );

          }
          if(childrenelement.valueType==='附件'){
            // 基础分组的双向绑定数据结构构造
            Object.defineProperty(
              dydata,
              this.toLowerCaseFirst(childrenelement.fieldName) ||
                this.toLowerCaseFirst(childrenelement.name),
              {
                enumerable: true,
                configurable: true,
                writable: true,
                value: []
              }
            );
          }else{
            // 基础分组的双向绑定数据结构构造
            Object.defineProperty(
              dydata,
              this.toLowerCaseFirst(childrenelement.fieldName) ||
                this.toLowerCaseFirst(childrenelement.name),
              {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (typeof(childrenelement.defaultValue)===undefined || childrenelement.defaultValue==='') ?undefined:childrenelement.defaultValue
              }
            );
          }
          
        });
      } else if (element.groupType === 1) {
        Object.defineProperty(dydata, this.toLowerCaseFirst(element.name), {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(
          dydata,
          this.toLowerCaseFirst(element.name) + "_row",
          {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
          }
        );
        // 增加主键
        Object.defineProperty(
          dydata[this.toLowerCaseFirst(element.name) + "_row"],
          "businessDataGuid",
          {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
          }
        );
        element.children.forEach(childrenelement => {
          // 业务参数处理
          if(childrenelement.valueType=='业务参数' || childrenelement.valueType=='业务对象'){
            
            if(childrenelement.businessObjectName =='产品类型'){
              // 定义对象
              Object.defineProperty(
                setData,this.toLowerCaseFirst(childrenelement.businessObjectName),{
                  enumerable: true,
                  configurable: true,
                  writable: true,
                }
              )
              // 获取数据
              getBasicDataTreeByParamName(childrenelement.businessObjectName).then(
                (response) => {
                  setData[this.toLowerCaseFirst(childrenelement.businessObjectName)] = response.data.result
                }
              )
            }
            else{
              // 定义对象
              Object.defineProperty(
              setData,this.toLowerCaseFirst(childrenelement.businessParamName),{
                  enumerable: true,
                  configurable: true,
                  writable: true,
                }
              )

              // 获取数据
              getParamValueListByParamName(childrenelement.businessParamName).then(
                (response) => {
                  setData[childrenelement.businessParamName] = response.data.result
                }
              )
            }
            // 业务参数 业务对象类文本显示值
            Object.defineProperty(
              dydata[this.toLowerCaseFirst(element.name) + "_row"],
              `${this.toLowerCaseFirst(childrenelement.fieldName) ||
                this.toLowerCaseFirst(childrenelement.name)}__text`,
              {
                enumerable: true,
                configurable: true,
                writable: true,
                value: (typeof(childrenelement.defaultValue)===undefined || childrenelement.defaultValue==='') ?undefined:childrenelement.defaultValue
              }
            );
          }
          Object.defineProperty(
            dydata[this.toLowerCaseFirst(element.name) + "_row"],
            this.toLowerCaseFirst(childrenelement.fieldName) ||
              this.toLowerCaseFirst(childrenelement.name),
            {
              enumerable: true,
              configurable: true,
              writable: true,
              value: (typeof(childrenelement.defaultValue)===undefined || childrenelement.defaultValue==='') ?undefined:childrenelement.defaultValue
            }
          );
        });
      }
    });
    return {
      base_api: process.env.BASE_API,
      savedata: Object.assign({}, dydata, this.initData.data, this.formdata),
      value: {}, // 表单数据对象
      tableData: [],
      editRowsFlag: [],
      currEditGroup: {},
      currEditRow: {},
      currEditRowIndex: undefined,
      groupVisible: false,
      modiVisible: false,
      groupMode: "1",
      isShowTip: true,
      setData: setData,
      loading:true
    };
  },
  created(){
    if(this.mode==='1'){
      this.UpdateCode()
    }
    else{
      this.loading = false
    }
  },
  computed: {
    address: function() {
      if(this.savedata.详细地址 && this.savedata.详细地址!==''){
        return JSON.parse(this.savedata.详细地址)
      }
      else{
        return null
      }
    },
    isDisabled:function(){
      if(this.initData.data.approveState===2 || this.initData.data.approveState===5){
        return true
      }
      else{
        return false
      }
    }
  },
  watch: {
    address(val) {
      if(val){
        this.savedata.详细地址__street = val.pertainVal;
        this.savedata.详细地址__area = CodeToText[val.addressBook[2]];
        this.savedata.详细地址__city = CodeToText[val.addressBook[1]];
        this.savedata.详细地址__province = CodeToText[val.addressBook[0]];
        this.savedata.详细地址__areaCode = val.addressBook[1];
        // 更新编码
        this.UpdateCode()
      }
    }
  },
  methods: {
    getValidate(isMustFill, valueType) {
        const arrResult = []
        if (isMustFill == true) {
          arrResult.push('required')
        }
        if (valueType == '数值') {
          arrResult.push('isNumber')
        }
        return arrResult.join('|')
      },
    // newGuid() {
    //   return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    //     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    //   )
    // },
    handleDrag() {
      this.$refs.select.blur();
    },
    handleAdd: function(group) {
      // const row = {}
      // this.savedata[this.toLowerCaseFirst(group.name)+'_row']=row
      // this.savedata[this.toLowerCaseFirst(group.name)].push(row)
      this.groupMode = "1";
      this.currEditRow = deepClone(
        this.savedata[this.toLowerCaseFirst(group.name) + "_row"]
      );
      this.currEditGroup = group;
      this.groupVisible = true;
    },
    handleEditRow: function(group, row, index) {
      this.currEditRowIndex = index;
      this.groupMode = "2";
      this.currEditRow = deepClone(row);
      this.currEditGroup = group;
      this.groupVisible = true;
    },
    handleDeleteRow: function(group, index) {
      this.savedata[this.toLowerCaseFirst(group.name)].splice(index, 1);
    },
    // 对外提供获取表单数据的函数
    getFormValue() {
      return this.savedata;
    },
    /**
     * 分组新增
     */
    GroupdDataAdd(row) {
      // this.savedata[row].push(
      //   deepClone(this.savedata[this.currEditGroup.name + "_row"])
      // );
      this.groupVisible = false;
    },
    renderHeader(h, column, row) {
      if (row.remark && row.remark != "") {
        return (
          <ToolTip remark={row.remark} effect="dark" placement="top-start">
            <font color={[row.isMustFill==false? '#666':'#b3450e']}>{ row.name }</font>
          </ToolTip>
          // ToolTip,
          // {
          //   props: { remark: row.remark },
          //   attrs: { effect: "dark", placement: "top-start" }
          // },
          // [h("span", {style:{}} ,row.name)]
        );
      } else {
        return (
          <font color={[row.isMustFill==false? '#666':'#b3450e']}>{ row.name }</font>
        );
      }
    },
    // 新增或者修改行
    handleEditOrAddGroupRow(row, mode, group) {
      const newrow = deepClone(row);
      if (mode == "1") {
        newrow.businessDataGuid = newGuid();
        this.savedata[this.toLowerCaseFirst(group.name)].push(newrow);
      } else {
        this.$set(
          this.savedata[this.toLowerCaseFirst(group.name)],
          this.currEditRowIndex,
          newrow
        );
      }
      // 作为汇总公式的条件影响了计算场景
      this.updateSUMData()
      this.groupVisible = true;
      this.currEditGroup = {};
      this.currEditRow = {};
    },
    closeWin() {
      this.groupVisible = true;
      this.currEditGroup = {};
      this.currEditRow = {};
    },  
    validate(){
      return this.$validator.validate()
    },
    handUpdateSelectText(textname,text){
      this.savedata[textname] = text
    },
    getParamValue(businessParamName){
      switch(businessParamName){
              case '产品类型':
                return getBasicDataTreeByParamName(businessParamName)
              break;
              case '所属产品':
                return getBelongProductListByParentId()
              break;
              default:
                return getParamValueListByParamName(businessParamName)
              break;
            }
    },
    UpdateProduct(nodeName,node){
      if(nodeName==='所属产品'){
        this.savedata['产品类型']=node.产品类型
        this.savedata['产品类型__text']=node.产品类型__text
      }
    },
    UpdateCode(){
      const postdata = {
        codeFormatSeedGuid:this.savedata['codeIdentifying'] || null,
        codeSerialNumber:this.savedata['code'] || null,
        '详细地址__areaCode':this.savedata['详细地址__areaCode'] || null,
        '详细地址__city':this.savedata['详细地址__city'] || null,
        projectGuid:this.savedata.projectGuid,
        parentGuid:this.savedata.parentGuid,
      }
      getCodeSerialNumber({codeFormatTypeGuid:this.initData.codeFormatTypeGuid,postData:JSON.stringify(postdata)}).then(
        response => {
          this.savedata['code'] = response.data.result.serialNumber
          this.savedata['codeIdentifying'] =response.data.result.codeFormatSeedGUID
          this.loading = false
        }
      )
    }
    // CodeValuechanged(){
    //   getCodeSerialNumber(this.initData).then(
    //     response => {

    //     }
    //   )
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.formitemdiv {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  // justify-content:center;
  margin-left: 20px;
  margin-right: 20px;
}
.formitem {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(50% - 40px);
}
.formitemoneline {
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(100% - 40px);
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 100%;
}
.cell-icon {
  cursor: pointer;
  color: #fff;
}
.el-row {
  margin-bottom: 5px;
}
.formiteminline {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  // justify-content:center;
  align-items: flex-start;
}
.fixButton {
  right: 0px;
  left: 0px;
  position: fixed;
  bottom: 0;
  background: #fff;
  z-index: 300;
  height: 47px;
  margin-top: 10px;
  padding-top: 18px;
  border: 0;
  border-top: solid 1px #e9ebee;
}
.error_span{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      left: 0;
    }
.el-card{
  overflow: inherit;
}
.el-card__header{
  padding: 10px 20px;
}
</style>
