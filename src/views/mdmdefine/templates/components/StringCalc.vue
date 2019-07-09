<template>
  <div v-loading ='loading'>
    <el-form ref="form" :model="form" label-position="left" label-width="100px">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="tip">
            <blockquote>
              <p style="font-weight: 600;color: #1f2f3d;">{{this.editvalue.name}} =</p><p>
                <el-tag v-for="(item,$index) in formulaCondition" :key="$index" :type="item.normId===undefined? 'warning':'success'" closable @close="handleDelete($index)">{{item.name}}</el-tag>
                <!-- <el-tag type="warning" closable>-</el-tag>
                <el-tag type="success" closable>项目所属城市</el-tag>
                <el-tag type="warning" closable>-</el-tag>                
                <el-tag type="success" closable>项目推广名</el-tag> -->
              </p>
            </blockquote>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-tree ref="StringTree" @current-change="currentchange" node-key="id" highlight-cu0rrent :data="treedata" :props="defaultProps" :default-expand-all="true"  ></el-tree>
        </el-col>       
        <el-col :span="15">
          <span v-if="showTags.length > 0" v-for="item in showTags" :key="item.id" @click="handleCheckTag(item)"><el-tag  size="small" style="margin-right:10px;cursor:pointer"   type="info">{{item.name}}</el-tag></span>
          <span style="margin:0 auto;" v-if="showTags.length == 0">无可选数据</span>
        </el-col>
        <el-col style="height:100%;width:150px" :span="4">
          <div @click="handleCheckTag({name:',',key: 0})" class="animate item char1 js_keyboard" ><span class="animate"></span></div>
          <div @click="handleCheckTag({name:';',key: 1})" class="animate item char2 js_keyboard" ><span class="animate"></span></div>
          <div @click="handleCheckTag({name:'-',key: 2})" class="animate item char3 js_keyboard" ><span class="animate"></span></div>
          <div @click="handleCheckTag({name:'#',key: 3})" class="animate item char4 js_keyboard" ><span class="animate"></span></div>
          <div @click="handleCheckTag({name:'|',key: 4})" class="animate item char5 js_keyboard" ><span class="animate"></span></div>
          <div @click="handleCheckTag({name:'·',key: 5})" class="animate item char6 js_keyboard" ><span class="animate"></span></div>
          <!-- <div @click="enterText()" class="animate item custom js_keyboard" data-key="6"><span class="">自定义文本</span></div> -->
        </el-col>
      </el-row>
      <el-form-item style="margin-top:10px">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="()=>{this.$emit('reload', 'c')}">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import numeral from "numeral";
import {
  getBusinessObjectTreeForStringConcatFormula,
  getFormula,
  saveFormula
} from "@/api/mdmtemplates";
import treeToArray from "./eval";
import { arrayTransTree } from "@/utils";
import treeTable from "@/components/TreeTable";
import { convertToFormulaObj } from "./formulaConvert";

export default {
  name: "StringCalc",
  filters: {},
  props: {
    editvalue: {
      type: Object
    },
    businessObject: {
      type: Object
    },
    templateBusinessObject: {
      type: Array
    },
    templateGuid: {
      type: String
    }
  },
  data() {
    let tempForm = {
      id: undefined, // ID
      name: "", // 控件名称 label
      groupId: this.groupid, // 所属分组
      isSystem: false, // 是否系统级  前台不需要
      isReadonly: false, // 是否只读
      defaultValue: "", // 默认值
      propertyType: 0, // 前端不用
      serviceLine: "", // 根据传进来的参数，判断是否只读，比如传进来的是运营，则可以填写，其他的不能填写
      modifyReasonReq: false, // 修改的时候显示文本框 需要填写修改属性，页面编辑状态才需要
      isMustFill: false, // 是否必填
      valueType: "", // 控件类型
      remark: "", // 前台不需要
      unit: "", // 数字类型时  显示的单位
      dec: 2, // 数字类型时，保留位
      limitFileCount: 0, // 文件类型时  上传文件限制数量
      dataItems: "", // 枚举类型时对应的值，逗号分隔
      businessObjectName: "",
      legalPersonCompanyUrl: null,
      businessParamName: "", // 类型为业务参数时，选择的业务参数名字
      fieldName: null,
      formulaCondition: null, // 当字段有公式计算时 公式表达式
      formulaConditionText: null, // 当字段有公式计算时 公式表达式文本形式
      filterRuleText: null, // 公式的计算规则的文本形式
      isRefByBusinessData: 0,
      orderBy: 2, // 页面字段显示顺序
      parentName: null,
      isOneLine: false, // 是否独占一行
      displayFields: null,
      displayFields__text: "",
      IsHidden: false, // 是否是隐藏的属性
      DBKey: null,
      DisKey: null,
      isPrimary: false, // 重复分组时用到，是否是主键，主键唯一校验
      fieldType: null,
      groupType: 0, // 0 不可重复分组  1可重复分组
      dataFromType: 0,
      canSetPrimary: 0,
      canCancelPrimary: 0,
      belongProductBusinessObjectGUID: null,
      belongProductGroupId: null,
      interfaceId: null,
      isMulti: false // 是否允许多选
    };
    if (this.editvalue !== {}) {
      tempForm = Object.assign({}, tempForm, this.editvalue);
      tempForm.parent = undefined;
    }
    return {
      form: tempForm,
      treedata: [],
      activeNames: "2",
      activeNames2: "1",
      loading: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      column: [
        {
          text: "",
          value: "name"
        }
      ],
      showTags: [],
      defaultcheckedkeys: "",
      value7: "",
      op: "=",
      formulaCondition: [],
      resultParentName: undefined,
      FormulaConditionData: {
        formulaScript: "",
        resultBusinessObjectId: "",
        resultPropertyName: "",
        resultParentName: "",
        resultGroupId: "",
        resultNormId: "",
        resultGroupType: 0,
        resultDec: 0,
        type: "Concat",
        childBusinessObjectId: "00000000-0000-0000-0000-000000000000",
        childIsPropertyObject: false,
        data: [],
        dataId: [],
        sumDataGroupId: "00000000-0000-0000-0000-000000000000",
        parentBusinessObjectId: "00000000-0000-0000-0000-000000000000",
        parentData: [],
        formulaCondition: "",
        formulaConditionText: "",
        manual: 0,
        resultPropertyFullName: "",
        fullData: null,
        filterRule: null
      }
    };
  },
  watch: {
    editvalue(curVal, oldVal) {
      let tempForm = {
        id: undefined, // ID
        name: "", // 控件名称 label
        groupId: this.groupid, // 所属分组
        isSystem: false, // 是否系统级  前台不需要
        isReadonly: false, // 是否只读
        defaultValue: "", // 默认值
        propertyType: 0, // 前端不用
        serviceLine: "", // 根据传进来的参数，判断是否只读，比如传进来的是运营，则可以填写，其他的不能填写
        modifyReasonReq: false, // 修改的时候显示文本框 需要填写修改属性，页面编辑状态才需要
        isMustFill: false, // 是否必填
        valueType: "", // 控件类型
        remark: "", // 前台不需要
        unit: "", // 数字类型时  显示的单位
        dec: 2, // 数字类型时，保留位
        limitFileCount: 0, // 文件类型时  上传文件限制数量
        dataItems: "", // 枚举类型时对应的值，逗号分隔
        businessObjectName: "",
        legalPersonCompanyUrl: null,
        businessParamName: "", // 类型为业务参数时，选择的业务参数名字
        fieldName: null,
        formulaCondition: null, // 当字段有公式计算时 公式表达式
        formulaConditionText: null, // 当字段有公式计算时 公式表达式文本形式
        filterRuleText: null, // 公式的计算规则的文本形式
        isRefByBusinessData: 0,
        orderBy: 2, // 页面字段显示顺序
        parentName: null,
        isOneLine: false, // 是否独占一行
        displayFields: null,
        displayFields__text: "",
        IsHidden: false, // 是否是隐藏的属性
        DBKey: null,
        DisKey: null,
        isPrimary: false, // 重复分组时用到，是否是主键，主键唯一校验
        fieldType: null,
        groupType: 0, // 0 不可重复分组  1可重复分组
        dataFromType: 0,
        canSetPrimary: 0,
        canCancelPrimary: 0,
        belongProductBusinessObjectGUID: null,
        belongProductGroupId: null,
        interfaceId: null,
        isMulti: false // 是否允许多选
      };
      const temp = Object.assign({}, tempForm, curVal);
      temp.parent = undefined;
      this.form = temp;
      this.initPage();
    }
  },
  computed: {},
  created() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.loading = true;
      // 获取公式
      getFormula({
        templateGuid: this.templateGuid,
        businessObjectGuid: this.businessObject.businessObjectGUID,
        normGroupId: this.editvalue.groupId,
        normId: this.form.id
      }).then(response => {
        this.FormulaConditionData = response.data.result;
        if (response.data.result.formulaCondition != null) {
          this.formulaCondition = JSON.parse(
            response.data.result.formulaCondition
          ).map(item => {
            return JSON.parse(item);
          });
        } else {
          this.formulaCondition = [];
        }
      });
      getBusinessObjectTreeForStringConcatFormula({
        templateGuid: this.templateGuid,
        businessObjectGuid: this.businessObject.businessObjectGUID,
        normGroupId: this.editvalue.groupId,
        normId: this.form.id,
        formulaType: "String"
      }).then(response => {
        this.treedata = response.data.result;
        if (this.treedata.length > 0) {
          this.showTags = response.data.result[0].children[0].availableNorms;
          this.$refs.StringTree.setCurrentKey(
            response.data.result[0].children[0].id
          );
          this.resultParentName = this.FormulaConditionData.resultParentName;
        }
        this.loading = false;
      });
    },
    currentchange(row, rownode) {
      this.showTags = row.availableNorms;
    },
    handleCheckTag(item) {
      const normId = item.id;
      const propertyName = item.parentName? `${item.parentName}.${item.name}` : item.name;
      const propertyType = item.propertyType;
      const parentName = item.parentName;
      const title = item.name;

      //固定列字段对应的字段名称
      let fieldName = null;
      if (propertyType == 1 || propertyType == 3) {
        fieldName = item.parentName? `${item.parentName}.${item.fieldName}` : item.fieldName;
      }
      if(item.key===undefined){
        this.formulaCondition.push({
          normId: normId,
          name: propertyName,
          fieldName: fieldName || propertyName,
          parentName: parentName,
          key:item.key
        });
      }else{
        this.formulaCondition.push({
          name: item.name,
          key:item.key
        });
      }
      
    },
    handleSave() {
      // if (this.validate()) {
      const data = this.getFormulaCondition();
      const formula = convertToFormulaObj(
        this.businessObject.businessObjectGUID,
        data,
        this.getBusinessObjectInfo
      );
      const postdata = Object.assign({}, data, formula);
      saveFormula(postdata, {
        templateGuid: this.templateGuid,
        businessObjectGuid: this.businessObject.businessObjectGUID,
        normGroupId: this.editvalue.groupId,
        normId: this.form.id,
        formulaType: "String"
      }).then(response => {
        this.$emit("reload", "c");
      });
      // } else {
      //   this.$message({
      //     message: "公式设置错误！",
      //     type: "error",
      //     duration: 5 * 1000
      //   });
      // }
    },
    //根据业务对象名称获取业务对象信息
    getBusinessObjectInfo(businessObjectName) {
      const arrdata = treeToArray(this.treedata);
      const obj = arrdata.find(item => {
        return item.name == businessObjectName;
      });
      obj.isPropertyObject = obj.type == 1;
      return obj;
    },
    handleDelete(index) {
      this.formulaCondition.splice(index, 1);
    },
    getFormulaCondition: function() {
      var self = this;
      var data = {};
      if (self.formulaCondition.length) {
        data = {
          dataId: [],
          formulaCondition: [],
          resultParentName: self.resultParentName,
          formulaConditionText: "",
          formulaConditionTextField: "",
          formulaType: "Concat",
          type: "Concat"
        };
        self.formulaCondition.forEach(item => {
          data.formulaCondition.push(JSON.stringify(item));

          if (item.key!==undefined) {
            data.formulaConditionText = data.formulaConditionText + item.name;
            data.formulaConditionTextField =
              data.formulaConditionTextField + item.name;
          } else {
            data.formulaConditionText =
              data.formulaConditionText + "[" + item.name + "]";
            data.formulaConditionTextField =
              data.formulaConditionTextField +
              "[" +
              (item.fieldName || item.name) +
              "]";
            data.dataId.push(item.normId);
          }
        });
        data.formulaCondition = JSON.stringify(data.formulaCondition);

        data.formulaConditionText =
          this.editvalue.name + "=" + data.formulaConditionText;
        data.formulaConditionTextField =
          (this.editvalue.fieldName || this.editvalue.name) +
          "=" +
          data.formulaConditionTextField;
      }

      return data;
    },
    //验证公式的合法性
    validate() {
      var self = this;
      var isValidate = true;

      if (!self.formulaCondition.length) {
        return isValidate;
      }

      if (self.formulaCondition.length == 1) {
        //如果设置的指标为1的时候
        if (!self.formulaCondition[0].hasOwnProperty("key")) {
          //如果不是单独的公式，验证通过
          return true;
        } else {
          //如果是单独的公式，验证不通过
          return false;
        }
      }

      //开始公式条件不能是除括弧以外的计算条件
      var firstFormula = self.formulaCondition[0];
      if (firstFormula.hasOwnProperty("key") && firstFormula['key']!==undefined && firstFormula.key != 4) {
        //结尾公式条件如果是公式且公式不是括弧，验证不通过
        return false;
      }

      //结尾公式条件不能是除括弧以外的计算条件
      var lastFormula = self.formulaCondition[self.formulaCondition.length - 1];
      if (lastFormula.hasOwnProperty("key") && lastFormula['key']!==undefined && lastFormula.key != 4) {
        //结尾公式条件如果是公式且公式不是括弧，验证不通过
        return false;
      }
      return true;
      //如果设置的公式为多个
      // var isValidate = self.formulaCondition.find((item, index) => {
      //   if (index >= 1) {
      //     //从第二个公式开始比较

      //     var prevItem = self.formulaCondition[index - 1];
      //     if (item.hasOwnProperty("key") && item['key']!==undefined) {
      //       //公式合法校验
      //       if (item.key == 4) {
      //         //括弧的处理，不能出现 ")("或者" ()"的情况
      //         if (item.brackets == "right") {
      //           //右括弧
      //           if (prevItem.hasOwnProperty("key")  && prevItem['key']!==undefined) {
      //             //右括弧前不能是计算公式
      //             return true;
      //           }
      //         } else {
      //           //左括弧
      //           if (prevItem.hasOwnProperty("key") && prevItem['key']!==undefined) {
      //             //左括弧前面的元素如果是计算公式，则只能是括弧以外的公式
      //             return prevItem.key == 4;
      //           } else {
      //             return false;
      //           }
      //         }
      //       } else {
      //         //括弧外的其他计算条件
      //         return prevItem.hasOwnProperty("key") && prevItem['key']!==undefined && prevItem.key != 4; //不能连续出现公式
      //       }
      //     } else {
      //       //除开计算条件外公式以外
      //       if (prevItem.hasOwnProperty("key") && prevItem['key']!==undefined) {
      //         return prevItem.brackets == "right"; //指标前不能是右括号
      //       } else {
      //         return !(prevItem.hasOwnProperty("key") && prevItem['key']!==undefined); //指标前不能是指标
      //       }
      //     }
      //   }
      // });
      // if (isValidate) {
      //   return false;
      // } else {
        
      // }
    }
  }
};
</script>
<style scoped>
.tip {
  padding: 2px 8px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 10px 0;
}
.item {
  cursor: pointer;
  background-color: #f4f5f9;
  height: 60px;
  width: 54px;
  float: left;
  margin-bottom: 1px;
  margin-right: 1px;
}
.item span {
  background-repeat: no-repeat;
  background-position: center center;
  display: block;
  height: 100%;
  width: 100%;
}
.char1 span {
  background-image: url(~@/assets/image/char01.png);
}
.char2 span {
  background-image: url(~@/assets/image/char02.png);
}
.char3 span {
  background-image: url(~@/assets/image/key03.png);
}
.char4 span {
  background-image: url(~@/assets/image/char04.png);
}
.char5 span {
  background-image: url(~@/assets/image/char05.png);
}
.char6 span {
  background-image: url(~@/assets/image/char06.png);
}
.item2 span {
  background-image: url(~@/assets/image/key02.png);
}
.item3 span {
  background-image: url(~@/assets/image/key03.png);
}
.item4 span {
  background-image: url(~@/assets/image/key04.png);
}
.item5 span {
  background-image: url(~@/assets/image/key05.png);
}
.item6 span {
  background-image: url(~@/assets/image/key06.png);
}
.item7 span {
  background-image: url(~@/assets/image/key07.png);
}
.custom {
  width: 109px;
}
.custom span {
  color: #444;
  text-align: center;
  line-height: 60px;
}
</style>

