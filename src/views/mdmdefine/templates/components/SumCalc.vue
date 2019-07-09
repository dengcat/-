<template>
  <div v-loading ='loading'>
    <el-form ref="form" :model="form" label-position="left" label-width="100px">
      <el-tabs @tab-click="handleGetFormulaRule" v-model="activeName">
        <el-tab-pane label="设置公式" name="first">
          <el-row :gutter="24">
            <el-col :span="24">
              <div class="tip">
                <blockquote>
                  <p style="font-weight: 600;color: #1f2f3d;">{{this.editvalue.name}} =</p>
                  <p>
                    SUM(<el-tag type="success" v-if="formulaCondition" closable @close="handleDelete()">{{formulaCondition.id}}</el-tag>)  
                  </p>
                </blockquote>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-tree ref="StringTree" @current-change="currentchange" node-key="id" highlight-current :data="treedata" :props="defaultProps" :default-expand-all="true"  ></el-tree>
            </el-col>       
            <el-col :span="16">
              <span v-if="showTags.length > 0" v-for="item in showTags" :key="item.id" ><el-tag @click="handleCheckTag(item)" size="small" style="margin-right:10px;cursor:pointer" type="info">{{item.name}}</el-tag></span>
              <span style="margin:0 auto;" v-if="showTags.length == 0">无可选数据</span>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="汇总条件" name="second">
          <el-row v-if="formulaRule.length>0">  
            <el-col style="height:100%" :span="24">
              <calc-rule :formulaRule="formulaRule" v-bind.sync="filterRule"></calc-rule>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
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
  saveFormula,
  getFormulaRule
} from "@/api/mdmtemplates";
import treeToArray from "./eval";
import { arrayTransTree } from "@/utils";
import treeTable from "@/components/TreeTable";
import { convertToFormulaObj } from "./formulaConvert";
import CalcRule from "./CalcRule";

export default {
  name: "ArithmeticCalc",
  components: { CalcRule },
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
      isOneLine: false, // 是否独占一行`
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
      activeName: "first",
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
      formulaCondition: undefined,
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
      },
      formulaRule: [
      ],
      value7: "",
      filterRule: {
        condition: "AND",
        rules: [
          
        ]
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
        if(response.data.result.filterRule){
          this.filterRule = response.data.result.filterRule
        }
        
        if (response.data.result.formulaCondition != null) {
          this.formulaCondition ={
            normId: response.data.result.dataId[0],
            name: JSON.parse(
              response.data.result.formulaCondition
            ).formulaSummary,
            id: JSON.parse(
              response.data.result.formulaCondition
            ).formulaSummary,
            groupId: undefined,
            parentName: undefined
          } ;
        } else {
          this.formulaCondition = undefined;
        }
      });
      getBusinessObjectTreeForStringConcatFormula({
        templateGuid: this.templateGuid,
        businessObjectGuid: this.businessObject.businessObjectGUID,
        normGroupId: this.editvalue.groupId,
        normId: this.form.id,
        formulaType: "SUM"
      }).then(response => {
        this.treedata = response.data.result;
        if (this.treedata.length > 0) {
          // this.showTags = response.data.result[0].children[0].availableNorms;
          // this.$refs.StringTree.setCurrentKey(
          //   response.data.result[0].children[0].id
          // );
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
      const propertyName = item.name;
      const propertyType = item.propertyType;
      const parentName = item.parentName;
      const groupId = item.groupId;

      this.formulaCondition = {
        normId: normId,
        name: `${parentName}.${propertyName}`,
        id: `${parentName}.${propertyName}`,
        groupId: groupId,
        parentName: parentName
      };
      // this.handleGetFormulaRule();
    },
    //根据选择的汇总字段，获取计算条件
    handleGetFormulaRule(item) {
      if(item.name==='second'){
        getFormulaRule({
          templateGuid: this.templateGuid,
          oLeftGuid: this.treedata.find(
            item => item.name == this.formulaCondition.id.split(".")[0]
          ).id,
          resultNormId: this.form.id,
          oRightGuid: this.businessObject.businessObjectGUID,
          beSumedNormId: this.formulaCondition.normId
        }).then(response => {
          this.formulaRule=response.data.result
        });
      }
      
    },
    // 计算条件
    handleCheckAri(item) {
      this.formulaCondition.push({
        name: item.name,
        key: item.key,
        brackets: item.brackets
      });
    },
    validate(postdata){
      // 保存前校验
      let checkResult = true
      if(!this.checkRule(postdata.filterRule)){
        checkResult = false
      }
      return checkResult
    },
    checkRule(rule){
      // 条件的递归校验
      let ruleCheckResut = true
      if(!rule){
        ruleCheckResut = true
      }
      if(!rule.condition){
        ruleCheckResut = false
      }
      if(rule.rules.length>0){
        rule.rules.forEach(
          item => {
            if(!item.condition){
              if(!item.operator){
                ruleCheckResut = false
              }
              else if(item.operator!=='is_empty' && item.operator!=='is_not_empty' && (!item.value || item.value==='') ){
                ruleCheckResut = false
              }
            }
            else{
              this.checkRule(item)
            }
          }
        )
      }
      return ruleCheckResut
    },
    handleSave() {
      const data = this.getFormulaCondition();
      const formula = convertToFormulaObj(
        this.businessObject.businessObjectGUID,
        data,
        this.getBusinessObjectInfo
      );
      const postdata = Object.assign({}, data, formula);
      // 规则校验
      
      let checkResult = true

      if(Object.keys(postdata).length>0 && !this.validate(postdata)){
        this.$message(
          {
            message: "请检查公式与条件！",
            type: "error",
            duration: 2 * 1000
          }
        )
        return false
      }
      saveFormula(postdata, {
        templateGuid: this.templateGuid,
        businessObjectGuid: this.businessObject.businessObjectGUID,
        normGroupId: this.editvalue.groupId,
        normId: this.form.id,
        formulaType: "String"
      }).then(response => {
        this.$emit("reload", "c");
      });
    },
    //根据业务对象名称获取业务对象信息
    getBusinessObjectInfo(businessObjectNames) {
      const arrdata = treeToArray(this.treedata);
      const n1 = businessObjectNames[0];
      const n2 = businessObjectNames[1];
      let obj = arrdata.find(item => {
        return item.name == n1;
      });

      if (businessObjectNames.length > 2) {
        obj = arrdata.find(item => {
          return item.parentId == obj.id && item.name == n2;
        });
      }

      obj.isPropertyObject = obj.type == 1;

      return obj;
    },
    handleDelete() {
      this.formulaCondition=undefined
      this.formulaRule=[]
      this.filterRule= {
        condition: "AND",
        rules: [
          
        ]
      }
    },
    getFormulaCondition: function() {
      var self = this;
      var data = {};
      if (
        self.formulaCondition==undefined ||
        self.formulaCondition.id === undefined ||
        self.formulaCondition.id === null
      ) {
        return {};
      }

      const tempFormulaCondition = { formulaSummary: self.formulaCondition.id };

      data = {
        dataId: [self.formulaCondition.normId],
        formulaCondition: JSON.stringify(tempFormulaCondition),
        resultParentName: self.resultParentName,
        formulaConditionText:
          this.editvalue.name + "=Sum([" + self.formulaCondition.id + "])",
        formulaType: "SUM",
        dataGroupId: this.editvalue.groupId
      };
      data.manual = 1;

      data.filterRule = this.filterRule;
      return data;
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

<style>
.sumcalc .el-card__header {
  padding: 3px 3px;
}
</style>


