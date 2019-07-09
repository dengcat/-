<template>
  <div class="addproperty">
    <el-form ref="form" :disabled="disabled" :model="form" label-position="left" :rules="rules" label-width="100px">
      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="指标名称" prop="name">
            <el-input :disabled="editvalue && editvalue.isSystem" v-model.trim="form.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务线">
            <el-select v-model="form.serviceLine" style="width:100%" placeholder="请选择业务线">
              <el-option v-for="item in businessLineList" :key="item.id" :label="item.text" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="值类型" prop="valueType">
            <el-select :disabled="editvalue && editvalue.isSystem" v-model="form.valueType" style="width:100%" placeholder="请选择值类型">
              <el-option label="文本" value="文本"/>
              <el-option label="数值" value="数值"/>
              <el-option label="日期" value="日期"/>
              <el-option label="下拉选择" value="枚举"/>
              <el-option label="备注文本" value="备注"/>
              <!-- <el-option label="附件" value="附件"></el-option> -->
              <el-option label="业务参数" value="业务参数"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.valueType!='日期' && form.valueType!='附件' && form.valueType!='业务参数'" label="默认值">
            <el-input :type="defaultValueType" :disabled="editvalue && editvalue.isSystem" v-model="form.defaultValue"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.valueType=='数值'" :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="小数位">
            <el-input v-model="form.dec"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量单位">
            <el-select v-model="form.unit" style="width:100%" placeholder="请选择">
              <el-option v-for="item in unitList" :key="item.id" :label="item.text" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.valueType=='枚举'" :gutter="24" type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="定义选项">
            <el-input v-model="form.dataItems" placeholder="请输入自定义选项 以“,”隔开，例如 选项一,选项二"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.valueType=='业务参数'" :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="业务参数">
            <el-select v-model="form.businessParamName" style="width:100%" placeholder="请选择">
              <el-option v-for="item in paramList" :label="item.paramName" :key="item.paramSettingGuid" :value="item.paramName"/>        
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-row v-if="form.valueType=='枚举' || form.valueType=='业务参数'" :gutter="24" type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="允许多选">
            <el-switch v-model="form.isMulti"/>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="是否系统级">
            <el-switch disabled v-model="form.isSystem"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否必填">
            <el-switch v-model="form.isMustFill"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="是否只读">
            <el-switch v-model="form.isReadonly"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否独占一行">
            <el-switch v-model="form.isOneLine"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="修改原因">
            <el-radio-group v-model="form.modifyReasonReq">
              <el-radio :label="true">必填</el-radio>
              <el-radio :label="false">非必填</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="说明">
            <el-input
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.remark"
              type="textarea"
              placeholder="请输入说明"/>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
    <div style="widht:100%;margin: 0 auto;text-align: center;">
      <el-button v-if="mode===0" type="primary" :loading="loading" @click="handerSaveNorm()">保存</el-button>
      <el-button @click="() => {this.$emit('reload','p')}">取消</el-button>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral';
import { saveNorm } from '@/api/mdmtemplates';
import { getBasicDataTreeByParamName,getParamValueListByParamName,getParamSettingList } from "@/api/basicdata";
import { Message } from "element-ui";


export default {
  name: "AddProperty",
  filters: {
    intFilter(i) {
      const intMap = {
        0: "是",
        1: "否",
        true: "是",
        false: "否"
      };
      return intMap[i];
    },
    numberFilter(num) {
      console.log("num", numeral(num).format("0,0.00"));
      return numeral(num).format("0,0.00");
    }
  },
  props: {
    editvalue: {
      type: Object
    },
    businessObject:{
      type: Object
    },
    templateGuid:{
      type:String
    },
    group:{
      type:Object
    },
    mode:{
      type:Number
    }
  },
  data() {
    let tempForm = {
        id: undefined, // ID
        name: "", // 控件名称 label
        groupId: undefined, // 所属分组
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
        groupType: undefined, // 0 不可重复分组  1可重复分组
        dataFromType: 1,
        canSetPrimary: 0,
        canCancelPrimary: 0,
        belongProductBusinessObjectGUID: null,
        belongProductGroupId: null,
        interfaceId: null,
        isMulti: false // 是否允许多选
      };
      if (this.editvalue) {
        tempForm = Object.assign({},tempForm,this.editvalue);
        tempForm.parent = undefined
        // tempForm = this.editvalue
      }
      else{
        tempForm.groupType = this.group.groupType
        tempForm.groupId = this.group.id
      }
    return {
      businessObjectGuid:this.businessObject.businessObjectGUID,
      form:tempForm,
      loading:false,
      paramList:[],
      unitList:[],
      businessLineList:[],
      rules:{
        name:[{required: true, message: '请输入指标名称', trigger: 'blur'}],
        valueType:[{required: true, message: '请选择值类型'}]
      }
    };
  },
  computed: {
    defaultValueType: function() {
      let result = "text";
      switch (this.form.valueType) {
        case "数值":
          result = "number";
          break;
      }
      return result;
    },
    disabled:function(){
      return this.mode!==0
    }
    // defaultValueDisplay: {
    //   get: function(){
    //     return numeral(this.form.defaultValue).format('0,0.00')
    //     // return
    //   },
    //   set: function(value){
    //     console.log('defaultValueDisplayset',value)
    //     this.form.defaultValue =value
    //   }
    // },
  },
  watch: {
    editvalue(curVal,oldVal){
      let tempForm = {
        id: undefined, // ID
        name: "", // 控件名称 label
        groupId: this.group.id, // 所属分组
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
      // this.form = curVal
    }
  },
  created() {
    getParamSettingList(4).then(
      response=>{
        console.log('etParamSettingList(4)',response)
        this.paramList = response.data.result
      }
    )
    getParamValueListByParamName('计量单位').then(
      response=>{
        console.log('计量单位',response)
        this.unitList = response.data.result
      }
    )
    getParamValueListByParamName('业务线').then(
      response=>{
        console.log('业务线',response)
        this.businessLineList = response.data.result
      }
    )
  },
  methods: {
    handerSaveNorm: function() {
      this.$refs.form.validate((valid) => {
        if(valid){
          this.loading = true
          const postdata = {
                "templateGuid": this.templateGuid,
                "businessObjectGuid": this.businessObjectGuid,
                "normGroupId": this.form.groupId || this.group.id,
                "norm": this.form
              }
          saveNorm(postdata).then(response => {
            this.$emit('reload','p')
            Message({
                    message: "保存成功！",
                    type: "info",
                    duration: 5 * 1000
                  });
            this.loading = false
          }
          ).catch(error =>{
            this.loading = false
          }
            // 
          )
        }
        else{
          return false
        }
      })
      
    }
  }
};
</script>

<style lang="scss">
  .addproperty {
    .el-form-item.is-success .el-input__inner {
      border-color:#dcdfe6
    }
  }

</style>