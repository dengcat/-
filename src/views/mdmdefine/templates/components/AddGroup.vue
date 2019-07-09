<template>
  <div>
    <el-form ref="form" :disabled="disabled" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model.trim="form.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分组类型">
            <el-select v-model="form.groupType" style="width:100%" placeholder="请选择">
              <el-option :key="0" :value="0" label="普通分组"/>
              <el-option :key="1" :value="1" label="列表分组"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row v-if="form.groupType==0" :gutter="24" type="flex" justify="center">
        <el-col :span="12">
          <el-form-item label="数据生成方式">
            <el-select v-model="form.dataFromType" style="width:100%" placeholder="请选择">
              <el-option :value="0" label="手工填报"/>
              <el-option :value="1" label="自动汇总"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"/>
      </el-row>
      <el-row v-if="form.dataFromType==1 && form.groupType==0" :gutter="24" type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="汇总对象">
            <el-input v-model="input4" placeholder="请选择汇总对象">
              <template slot="append"><svg-icon icon-class="add" /></template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.dataFromType==1 && form.groupType==0" :gutter="24" type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="分组字段">
            <el-input v-model="input4" placeholder="请选择分组字段">
              <template slot="append"><svg-icon icon-class="add" /></template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.dataFromType==1 && form.groupType==0" :gutter="24" type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="汇总字段">
            <el-input v-model="input4" placeholder="请选择汇总字段">
              <template slot="append"><svg-icon icon-class="add" /></template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-form-item>
        <el-button type="primary" v-if="mode===0" :loading="loading" @click="handerSaveNormGroup()">保存</el-button>
        <el-button  @click="() => {this.$emit('reload','g')}">取消</el-button>
      </el-form-item> -->
    </el-form>
    <div style="widht:100%;margin: 0 auto;text-align: center;">
      <el-button type="primary" v-if="mode===0" :loading="loading" @click="handerSaveNormGroup()">保存</el-button>
      <el-button  @click="() => {this.$emit('reload','g')}">取消</el-button>
    </div>
    
  </div>
</template>

<script>

import numeral from 'numeral'
import {saveNormGroup} from '@/api/mdmtemplates'

export default {
  name: 'AddGroup',
  filters: {
    intFilter(i) {
      const intMap = {
        0: '是',
        1: '否',
        true: '是',
        false: '否',
      }
      return intMap[i]
    },
    numberFilter(num) {
      console.log('num', numeral(num).format('0,0.00'))
      return numeral(num).format('0,0.00')
    }
  },
  props: {
    editvalue: {
      type: Object,
    },
    businessObject:{
      type: Object
    },
    templateGuid:{
      type:String
    },
    mode:{
      type:Number
    },
    region:{
      type:Object
    }
  },
  data() {
    let tempForm = {
            'id': undefined,
            'groupId': undefined,
            'name': '',
            'busiObjName': null,
            'hasSystemNorm': false,
            'groupType': undefined,
            'dataFromType': 1,
            'refBusinessObjectGUID': null,
            'groupField': '',
            'groupField__text': '',
            'sumField': '',
            'sumField__text': '',
            'refBusinessObjectGroupName': '',
            'refBusinessObjectGroupId': null,
            'selectSumObjectValue': '',
            'selectSumObjectValue__text': '',
            'orderBy': undefined,
            'regionId': undefined,
            'displayStyle': '有边框',
            'interfaceId': null,
            'interfaceField': '',
            'initializationData': null,
            'dataModelType': '弹出编辑',
            'labelWidth': 0
          }
      if(this.editvalue){
        // this.editvalue.children=null
        tempForm = Object.assign({},tempForm,this.editvalue);  
        tempForm.children=null
        tempForm.parent=null
      }
      else{
        if(this.region){
          tempForm.regionId = this.region.id
        }
      }
      
    return {
      form:tempForm,
      loading:false,
      rules:{
        name:[{required: true, message: '请输入分组名称', trigger: 'blur'}],
      }
    }
  },
  computed: {
    disabled:function(){
      return this.mode!==0
    }
  },
  watch: {
     editvalue(curVal,oldVal){
        let tempForm = {
            'id': undefined,
            'groupId': undefined,
            'name': '',
            'busiObjName': null,
            'hasSystemNorm': false,
            'groupType': undefined,
            'dataFromType': 1,
            'refBusinessObjectGUID': null,
            'groupField': '',
            'groupField__text': '',
            'sumField': '',
            'sumField__text': '',
            'refBusinessObjectGroupName': '',
            'refBusinessObjectGroupId': null,
            'selectSumObjectValue': '',
            'selectSumObjectValue__text': '',
            'orderBy': undefined,
            'regionId': undefined,
            'displayStyle': '有边框',
            'interfaceId': null,
            'interfaceField': '',
            'initializationData': null,
            'dataModelType': '弹出编辑',
            'labelWidth': 0
          }
      if(this.editvalue!=={}){
        tempForm = Object.assign({},tempForm,this.editvalue);
        tempForm.children=null
        tempForm.parent=null
      }
      this.form =tempForm
     }

  },
  created() {
  },
  methods: {
    handerSaveNormGroup: function() {
      this.$refs.form.validate((valid) => {
      if(valid){  
        const postdata = {
              "templateGuid": this.templateGuid,
              "businessObjectGuid": this.businessObject.businessObjectGUID,
              "norm": this.form
            }
        saveNormGroup(postdata).then(response => {
          this.$emit('reload','g')
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
    })
    }
  }
}
</script>

