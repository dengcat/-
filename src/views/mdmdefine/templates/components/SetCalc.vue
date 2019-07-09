<template>
  <div v-loading ='loading'>
      <string-calc v-if="calcmode=='String'" :editvalue="editvalue" :businessObject="businessObject" :templateGuid="templateGuid" :templateBusinessObject="templateBusinessObject" v-on:reload="reload"></string-calc>
      <arithmetic-calc v-if="calcmode=='default'" :editvalue="editvalue" :businessObject="businessObject" :templateGuid="templateGuid" :templateBusinessObject="templateBusinessObject" v-on:reload="reload"></arithmetic-calc>
      <sum-calc v-if="calcmode=='SUM'" :editvalue="editvalue" :businessObject="businessObject" :templateGuid="templateGuid" :templateBusinessObject="templateBusinessObject" v-on:reload="reload"></sum-calc>
  </div>
</template>

<script>

import numeral from 'numeral'
import { getBusinessObjectTreeForStringConcatFormula } from "@/api/mdmtemplates";
import treeToArray from './eval'
import {arrayTransTree} from '@/utils'
import treeTable from '@/components/TreeTable'
import StringCalc from './StringCalc'
import ArithmeticCalc from './ArithmeticCalc'
import SumCalc from './SumCalc'


export default {
  name: 'SetCalc',
  components: { StringCalc,ArithmeticCalc,SumCalc },
  filters: {
    
  },
  props: {
    editvalue: {
      type: Object,
    },
    businessObject:{
      type:Object
    },
    templateBusinessObject:{
      type:Array
    },
    templateGuid:{
      type:String
    },
    calcmode:{
      type:String
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
        tempForm = Object.assign({},tempForm,this.editvalue);
        tempForm.parent = undefined
        // tempForm = this.editvalue
      }
    return {
      form:tempForm,
      treedata:[],
      activeNames:'2',
      activeNames2:"1",
      loading:false,
      defaultProps:{children: 'children',
          label: 'name'},
      column: [{
          text: '',
          value: 'name',
        }],
      showTags:[],
      defaultcheckedkeys:'',
      cities: [{
          label: '项目.产品类型ID',
          value: '项目'
        }, {
          label: '项目.产品类型名称',
          value: '项目'
        }, ],
        value6: '',
        cities1: [{
          label: '楼栋.产品类型ID',
          value: '楼栋'
        }, {
          label: '楼栋.产品类型名称',
          value: '楼栋'
        }, ],
        value7: '',
        op:'=',
        formulaCondition:[
          {
            type:'且',
            Condition1:'',
            op:'',
            Condition2:''
          }
        ]
    }
  },
  watch: {
    editvalue(curVal,oldVal){
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
      const temp = Object.assign({},tempForm,curVal)
      temp.parent = undefined
      this.form = temp
      // this.initPage()
      // this.form = curVal
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    // this.initPage()
  },
  methods: {
    initPage(){
      this.loading = true
      getBusinessObjectTreeForStringConcatFormula({
        "templateGuid": this.templateGuid,
        "businessObjectGuid": this.businessObject.businessObjectGUID,
        "normGroupId": this.editvalue.groupId,
        "normId": this.form.id,
        "formulaType":this.calcmode
      }).then((response => {
        // this.treedata =arrayTransTree(response.data.result,'parentId','id') 
        this.treedata =response.data.result
        switch(this.calcmode){
          case 'String':
            if(this.treedata.length>0){
              this.showTags =response.data.result[0].children[0].availableNorms.filter((item)=> item.valueType=='文本')
              this.$refs.StringTree.setCurrentKey(response.data.result[0].children[0].id)    
              // this.defaultcheckedkeys=response.data.result[0].children[0].id
              
            }
          break;
        }
        this.loading = false
      }))
    },
    currentchange(row,rownode){
      this.showTags= row.availableNorms.filter((item)=> item.valueType=='文本')
    },
    addFormulaCondition(type){
      this.formulaCondition.push({
            type:type,
            Condition1:'',
            op:'',
            Condition2:''
          })
    },
    deleteFormulaCondition(index){
      this.formulaCondition.splice(index,1)
    },
    reload(){
      this.$emit('reload','c')
    }
  }
}
</script>
<style scoped>
.tip{
    padding: 2px 8px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 10px 0;
}
.item{
    cursor: pointer;
    background-color: #f4f5f9;
    height: 60px;
    width: 54px;
    float: left;
    margin-bottom: 1px;
    margin-right: 1px;
}
.item span{
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

