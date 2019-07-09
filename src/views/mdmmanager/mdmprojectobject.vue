<template>
  <div class="app-container" v-loading = "loading">
    <el-row style="margin-bottom:30px" type="flex" justify="center">
      <el-col :span="24">
        <el-form-renderer v-if="content!==undefined && initData!==undefined && businessObject!==undefined" :mode="mode" ref="projectForm" :initData="initData" :businessObject="businessObject" :content="content"/>
        <!-- <el-form-renderer v-if="content!==undefined && initData!==undefined && businessObject!==undefined && mode!==1" :mode="mode" ref="projectForm" :initData="initData" :businessObject="businessObject" :content="content"/> -->
      </el-col>
    </el-row>
    <el-row v-if="!loading" class="fixButton" style="text-align:center">
      <el-col :span="24" align="middle" style="text-align:center">     
        <el-button v-if="!isDisabled" type="primary" @click="handleSave()">保存</el-button>
        <!-- <el-button v-if="!isDisabled" type="primary" @click="handleSave()">保存并发起审批</el-button> -->
        <el-button @click="cannelSave()">取消</el-button>
      </el-col>
    </el-row>

    <el-dialog v-if="modiVisible==true" width="900px" v-el-drag-dialog :visible.sync="modiVisible" title="修订原因" @dragDialog="handleDrag">
      <tree-table :data="modidata"  :columns="modicolumns" :expand-all="true" >
        <el-table-column label="本次修订数据" width="150">
          <template slot-scope="scope">
            <font color="red">{{scope.row.currentData}}</font>
          </template>
        </el-table-column>
        <el-table-column label="上一版本数据" width="150">
          <template slot-scope="scope">
            {{scope.row.prevData}}
          </template>
        </el-table-column>
        <el-table-column label="修订原因" width="250">
          <template slot-scope="scope">
            <span style="width:10px;margin-right:10px;color:red" v-if="scope.row.isMustFillReason">*</span>
            <span style="width:10px;margin-right:10px" v-if="!scope.row.isMustFillReason">&nbsp;</span>
            <el-input style="width:200px" :name="scope.row.name" v-validate="scope.row.isMustFillReason?'required':''" v-if="scope.row._level==2" v-model="scope.row.reviseReason"></el-input>
          </template>
        </el-table-column>
      </tree-table> 
      <el-row style="margin-top:20px;text-align:center" >
          <el-col :span="24" align="middle" style="text-align:center">
            <el-button type="primary" @click="handleSaveBusinessDataWithModi()">保存</el-button>
            <el-button @click="() => { this.modiVisible = false}">取消</el-button>
          </el-col>
        </el-row>     
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import ElFormRenderer from "@/components/ElFormRender/render";
import { getPublishTemplate,getTemplateBusinessObjectList} from "@/api/mdmtemplates";
import { saveBusinessData,getBusinessUnits,getProjectInitData,getBusinessObjectData,getBusinessObjectInitData,buildDiffDataList } from "@/api/mdmmanager";
import treeTable from "@/components/TreeTable";
import {arrayTransTree} from '@/utils'
import treeToArray from './eval'
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import checkPermission from '@/utils/permission' // 权限判断函数


const defaultForm = {};

export default {
  directives: { elDragDialog },
  name: "MdmProjectObject",
  components: {
    ElFormRenderer,treeTable
  },
  data() {
    let tempMode = '1'
    const param_id = this.$route.params.id
    const hasMPermission = checkPermission([{functionCode: '1013', actionCodes: '03'}])
    const hasVPermission = checkPermission([{functionCode: '1013', actionCodes: '00'}])

    if(param_id && hasMPermission){
      tempMode = '2'
    }
    else if(param_id && hasVPermission &&!hasMPermission){
      tempMode = '3'
    }
    return {
      modidata:[],
      modiVisible:false,
      mode:tempMode,
      templateGUID: this.$route.params.templateGUID, 
      parentId: this.$route.params.parentId, 
      type: this.$route.params.type, 
      id: this.$route.params.id,
      businessObject:undefined,
      content:undefined,
      loading:true,
      formdata: {},
      initData:undefined,
      modicolumns: [
        {
          text: "指标名称",
          value: "name"
        }
      ],
      senddata:{
        "businessDataGuid":undefined, 
        "templateGuid":undefined, 
        "templateBusinessObjectGuid":undefined, 
        "name":undefined, 
        "code":undefined,
        "codeIdentifying":undefined,
        "buGuid":undefined, 
        "buName":undefined, 
        "reviseReason":undefined, 
        "reviseReasonExtInfo":undefined, 
        "projectGuid":undefined, 
        "parentGuid":undefined,
        "projectStage":undefined, 
        "businessObjectGuid":undefined, 
        "businessObjectName":undefined, 
        "createDate":undefined,
        "modifyState":this.$route.params.id?undefined:1,
        "propertyValue":undefined,
        "isTempSave":0
      }
    };
  },
  computed: {
    isDisabled:function(){
      if((this.initData && (this.initData.data.approveState===2 || this.initData.data.approveState===5)) || this.mode==='3'){
        return true
      }
      else{
        return false
      }
    }
  },
  mounted(){
      // 获取表单定义
    getTemplateBusinessObjectList({id:this.templateGUID}).then(
      (response) => {
        if(Array.isArray(response.data.result)){
          const businessObject = response.data.result.find(item=> item.name==this.type)
          this.businessObject = businessObject
          this.content = businessObject.normDefineRegion[0].children
          // 修改时获取数据
          if(this.id){
            getBusinessObjectData(this.id).then((response)=>{
              this.initData = response.data.result
              this.loading = false
            })        
          }else{
            getBusinessObjectInitData({parentGuid: this.parentId, businessObjectGuid:this.businessObject.businessObjectGUID}).then(
              (response)=>{
                this.initData = response.data.result
                this.loading = false
              }
            )
          }

        }
      }
    )

  },
  created() {
    if (this.$route.params.id) {
      this.$route.meta.title = `维护` + this.$route.params.type;
    } else {
      this.$route.meta.title = `新增` + this.$route.params.type;
    }
  },
  methods: {
    checkPermission,
    handleDrag() {
      this.$refs.select.blur();
    },
    handleSave:function(){
      this.$refs.projectForm.validate().then(
        (data) => {
          if(data && !data.result){
            Message({
                message: data.error,
                type: "error",
                duration: 5 * 1000
              });
            return
          }
          const businessData = this.$refs.projectForm.getFormValue()
          this.senddata = Object.assign(this.senddata,{
            "businessDataGuid":businessData.businessDataGuid, 
            "templateGuid":businessData.templateGuid, 
            "templateBusinessObjectGuid":businessData.templateBusinessObjectGuid, 
            "name":businessData.name, 
            "code":businessData.code,
            "codeIdentifying":businessData.codeIdentifying,
            "buGuid":businessData.buGuid, 
            "buName":businessData.buName, 
            "reviseReason":businessData.reviseReason, 
            "reviseReasonExtInfo":businessData.reviseReasonExtInfo, 
            "projectGuid":businessData.projectGuid, 
            "parentGuid":businessData.parentGuid,
            "projectStage":businessData.projectStage, 
            "businessObjectGuid":businessData.businessObjectGuid, 
            "businessObjectName":businessData.businessObjectName, 
            "createDate":businessData.createDate,
            "propertyValue":JSON.stringify(businessData)
          })
          if(this.initData.fillRevise){
            buildDiffDataList(this.senddata).then(
              response => {
                if(response.data.result.mainDatas && response.data.result.mainDatas.length>0){
                  this.modidata=arrayTransTree(response.data.result.mainDatas,'parentId','id')
                  this.modiVisible = true
                }
                else{
                  this.handleSaveBusinessData()
                }     
              }
            )
          }
          else{
            this.handleSaveBusinessData()
          }
          
        }
      )
    },
    handleSaveBusinessDataWithModi(){
      this.$validator.validate().then(result => {
        if (!result) {
          Message({
                message: "请填写修改原因",
                type: "error",
                duration: 5 * 1000
              });
        }
        else{
          this.handleSaveBusinessData()
        }
      });
    },
    //保存项目数据
    handleSaveBusinessData:function(){
      const loading = this.$loading({
        lock: true,
        text: '数据保存中,正在通过接口管理平台校验,请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let ReviseReason = {}
      treeToArray(this.modidata).forEach((element) => {
        ReviseReason = Object.assign(
          {},ReviseReason, {[`${element.name}`]:element.reviseReason}
        )
      })
      this.senddata.reviseReason = JSON.stringify(ReviseReason)
      saveBusinessData(this.senddata).then(
        (response)=>{
          
          loading.close()
          Message({
                message: "保存成功！",
                type: "info",
                duration: 2 * 1000
              });
          this.$router.push({ path: `/mdmmanager/mdmprojectedit/${this.senddata.projectGuid}/${this.templateGUID}` });
        }
      ).catch(
        (error) => {
          loading.close()
        }
      )
    },
    cannelSave(){
      this.$router.push({ path: `/mdmmanager/mdmprojectedit/${this.initData.data.projectGuid}/${this.templateGUID}` });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
  
}
.fixButton {
    right: 0px;
    left: 0px;
    position: fixed;
    bottom: 0px;
    background: #fff;
    z-index: 300;
    height: 47px;
    margin-top: 5px;
    padding-top: 5px;
    border: 0;
    border-top: solid 1px #e9ebee;
  }
</style>
