<template>
  <div v-loading="loading" class="app-container">
    <el-row :gutter="12">
      <el-col :span="6">
        <div >
          {{project.name}}<span class="project_info">{{$options.filters.stateFilter(project.approveState)}}</span>
        </div>
        <!-- <el-alert
          style="display:inline-block;width:100px;vertical-align:center;vertical-align:middle"
          :title="`${$options.filters.stateFilter(project.approveState)}`"
          type="info"
          :closable="false"> 
        </el-alert>-->
      </el-col>
      <el-col style="text-align:right" :span="18">  
        <el-button v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="project.approveState==5" type="primary"  @click="EditProject()">修订项目数据</el-button>
        <el-button v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="project.approveState==1" type="primary"  @click="ProjectUnActivateEdition()">取消修订</el-button>
        <el-button v-permission="[{functionCode: '1013', actionCodes: '07'}]" v-if="project.approveState==0 || project.approveState==1" type="primary" @click="ProjectEditionProcessInitiate()" >发起审批</el-button>
        <el-button v-permission="[{functionCode: '1013', actionCodes: '09'}]" v-if="project.approveState==2" type="primary" @click="ProjectEditionProcessUnApproved()" >驳回审批</el-button>
        <el-button v-permission="[{functionCode: '1013', actionCodes: '08'}]" v-if="project.approveState==2" type="primary" @click="ProjectEditionProcessApproved()" >审批通过</el-button>
        <!-- <el-button  v-if="project.approveState==1 || project.approveState==2 || project.approveState==5"  type="primary" >查看审批流程</el-button> -->
      </el-col>
    </el-row>
    <el-form ref="postForm" class="form-container">
      <div class="createPost-main-container">
        <el-row type="flex" justify="center">
          <el-col :span="24">
            <tree-table-project style="width: 100%; margin-top:10px" :data="projectData" :columns="columns" :expand-all="expandAll" border>
              <el-table-column label="修改状态">
                <template slot-scope="scope">
                  <el-alert v-if="scope.row.modifyState!==0" style="width:50px;padding: 0px 0px"
                    :title="scope.row.modifyState | modiStateFilter"
                    :type="scope.row.modifyState | modiColorFilter"
                    :closable="false">
                  </el-alert>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                 <template slot-scope="scope">
                  <router-link v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="(project.approveState==0 || project.approveState==1) && scope.row.modifyState!==3" 
                  :to="{name: 'MdmProjectObject', params: { templateGUID: templateGUID, parentId: scope.row.parentGUID?scope.row.parentGUID:'00000000-0000-0000-0000-000000000000', type: scope.row.businessSimplifyName, id: scope.row.businessDataGUID }}">
                    <el-button v-permission="[{functionCode: '1013', actionCodes: '03'}]" type="text">编辑</el-button>
                  </router-link>
                  <router-link
                  :to="{name: 'MdmProjectObject', params: { templateGUID: templateGUID, parentId: scope.row.parentGUID?scope.row.parentGUID:'00000000-0000-0000-0000-000000000000', type: scope.row.businessSimplifyName, id: scope.row.businessDataGUID }}">
                    <el-button type="text" >查看</el-button>
                  </router-link>
                  <router-link v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="(project.approveState==0 || project.approveState==1) && scope.row.modifyState!==3" 
                  :to="{name: 'MdmProjectObject', params: { templateGUID: templateGUID, parentId: scope.row.businessDataGUID, type: scope.row.childBusinessSimplifyName }}">
                    <el-button v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="scope.row._level==1" type="text" >新增分期</el-button>
                  </router-link>
                  <router-link v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="(project.approveState==0 || project.approveState==1) && scope.row.modifyState!==3" 
                  :to="{name: 'MdmProjectObject', params: { templateGUID: templateGUID, parentId: scope.row.businessDataGUID, type: scope.row.childBusinessSimplifyName }}">
                    <el-button v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="scope.row._level==2" type="text" >新增楼栋</el-button>
                  </router-link>
                  <el-button v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="(project.approveState==0 || project.approveState==1) && scope.row.modifyState!==3" @click="handleDeleteBusinessData(scope.row,project.approveState)" type="text">删除</el-button>
                  <el-button v-permission="[{functionCode: '1013', actionCodes: '03'}]" v-if="(project.approveState==0 || project.approveState==1) && scope.row.modifyState===3" @click="handleUnDeleteBusinessData(scope.row)" type="text">取消删除</el-button>
                </template>
              </el-table-column>
            </tree-table-project>
          </el-col>
        </el-row>
      </div>
    </el-form>
  <el-dialog width="600px" v-if="propertyVisible==true" v-el-drag-dialog :visible.sync="propertyVisible" title="新建版本修订项目数据" ref="select"  @dragDialog="handleDrag">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="项目名称">
          {{project.name}}
        </el-form-item>
        <el-form-item label="版本名称">
          <span slot="label" style="color:red">版本名称</span>
          <div style="display: flex;">
            <el-select v-model="editon" @change="handleEditonChange" value-key="id" placeholder="请选择">
              <el-option
                v-for="item in editonList"
                :key="item.id"
                :label="item.editionName"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-if="editon && editon.isMultiple===1" style="margin-left:10px" v-model="editonName_s"></el-input>
          </div>
        </el-form-item>
        <!-- <el-form-item label="小版本号">
            <span slot="label" style="color:red">小版本号</span>
          <el-input v-model="editonName_s"></el-input>
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="editionRemark" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ProjectActivateEdition()">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import TreeTableProject from "@/components/TreeTable/TreeTableProject";
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import { unDeleteBusinessData,deleteBusinessData,getProjectDetailBusinessData,projectEditionProcessInitiate,projectEditionProcessUnApproved,projectEditionProcessApproved,projectActivateEdition,projectUnActivateEdition } from "@/api/mdmmanager";
import {getMdmEditionSetting} from '@/api/mdmsyssetting'
import {arrayTransTree} from '@/utils'
import moment from 'moment';
import permission from '@/directive/permission/index.js' // 权限判断指令
// import checkPermission from '@/utils/permission' // 权限判断函数

const defaultForm = {};

export default {
  directives: { elDragDialog,permission },
  components: {
    TreeTableProject
  },
  filters:{
    stateFilter(type) {
      const statusMap = {
        0: '创建',
        1: '修订中',
        2: '审核中',
        5: '已审核',
      }
      return statusMap[type]
    },
    modiStateFilter(state){
      const statusMap = {
        1: '新增',
        2: '修改',
        3: '删除'
      }
      return statusMap[state]
    },
    modiColorFilter(state){
      const statusMap = {
        1: 'success',
        2: 'warning',
        3: 'error'
      }
      return statusMap[state]
    }  
  },
  name: "MdmProjectEdit",
  data() {
    return {
      columns: [
        {
          text: "项目名称",
          value: "name"
        }
      ],
      form: {
        projectName: "",
        verName: "",
        remark: ""
      },
      editionRemark:'',
      propertyVisible: false,
      expandAll: true,
      active: 0,
      currentRow: null,
      loading: true,
      projectData: [
      ],
      id:this.$route.params.id,
      templateGUID:undefined,
      project:{
        "businessDataGUID": this.$route.params.id,
        "templateGUID": undefined,
        "templateBusinessObjectGUID": undefined,
        "businessObjectGUID": undefined,
        "parentBusinessObjectGUID": undefined,
        "childBusinessSimplifyName": undefined,
        "childPropertyRight": 0,
        "childTemplateBusinessObjectGUID": undefined,
        "childBusinessObjectGUID": undefined,
        "sectionChildBusinessSimplifyName": undefined,
        "sectionChildTemplateBusinessObjectGUID": undefined,
        "sectionChildBusinessObjectGUID": undefined,
        "modifyState": undefined,
        "approveState": undefined,
        "name": undefined,
        "businessSimplifyName": undefined,
        "propertyRight": undefined,
        "parentGUID": undefined,
        "projectGUID": undefined,
        "mayAdjustAffiliation": undefined,
        "code": undefined,
        "order": undefined,
        "productMustFill": undefined,
        "isProductCodeMustFill": undefined,
        "isEnableCodeFormat": undefined
      },
      editon:undefined,
      editonName_s:undefined,
      editonList:[]
    };
  },
  computed: {
    editonName:function(){
      return this.editonName_s ? `${this.editon.editionName}_${this.editonName_s}` : this.editon.editionName 
    }
  },
  created() {
    this.initPage()
    getMdmEditionSetting().then(
      response=>{
        this.editonList = response.data.result
      }
    )
  },
  methods: {
    // checkPermission,
    handleDrag() {
      this.$refs.select.blur();
    },
    initPage(){
      getProjectDetailBusinessData(this.id).then(
        response => {
          const projectTreeInfo  = arrayTransTree(response.data.result,'parentGUID','businessDataGUID')
          this.projectData = projectTreeInfo
          this.project = projectTreeInfo[0]
          this.$route.meta.title = `维护项目（${response.data.result[0].name}）`
          this.loading =false
          this.templateGUID = response.data.result[0].templateGUID
        }
      )
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    pre() {
      if (this.active-- < 0) this.active = 0;
      this.loading = false;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    EditProject() {
      this.propertyVisible = true;
      // this.project.approveState==1 = true;
    },
    UnEditProject() {
      // this.project.approveState==1 = false;
      
    },
    onSubmit(){
      Message({
                message: "创建版本成功！",
                type: "info",
                duration: 5 * 1000
              });
      this.propertyVisible = false;
    },
    // 发起审批
    ProjectEditionProcessInitiate(){
      this.loading = true
      projectEditionProcessInitiate(this.id).then(
        response=>{
          this.initPage()
        }
      )
    },

    // 审批驳回
    ProjectEditionProcessUnApproved(){
      this.loading = true
      projectEditionProcessUnApproved(this.id).then(
        response=>{
          this.initPage()
        }
      )
    },
    // 审批通过
    ProjectEditionProcessApproved(){
      this.loading = true
      projectEditionProcessApproved(this.id).then(
        response=>{
          this.initPage()
        }
      )
    },

    // 激活修订
    ProjectActivateEdition(){
      this.loading = true
      projectActivateEdition({
        "businessDataGUID": this.id,
        "editionRemark": this.editionRemark,
        "editonName": this.editonName
      }).then(
        response=>{
          Message({
                message: "创建版本成功！",
                type: "info",
                duration: 5 * 1000
              });
          this.propertyVisible = false;
          this.initPage()
        }
      )
    },
    // 取消修订
    ProjectUnActivateEdition(){
      this.loading = true
      this.$confirm('取消修订将会退回到上个版本?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          projectUnActivateEdition(this.id).then(
            response=>{
              this.initPage()
            }
          )
        }).catch(() => {
          this.loading = false    
        });
      
    },
    handleDeleteBusinessData(row,approveState){
      this.$confirm(`确定删除${row.name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
          ()=>{
            this.loading = true
            deleteBusinessData(row.businessDataGUID).then(
              response=>{
                if(approveState!==0){
                  this.initPage()
                }
                else{
                  this.$router.push({ path: `/mdmmanager/index` });
                }
              }
            )
          }
        )
    },
    handleUnDeleteBusinessData(){
      this.loading = true
        unDeleteBusinessData(row.businessDataGUID).then(
          response=>{
            this.initPage()
          }
        )
    },
    handleEditonChange(data){
      if(data && data.isMultiple===0){
        this.editonName_s = undefined
      }else if(data && data.isMultiple===1){
        this.editonName_s = moment().format('YYYYMMDD')
      }
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
.project_info {
    color: #009fff;
    background-color: #e3f5ff;
    line-height: 1.15;
    height: 28px;
    width:60px;
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 12px;
    margin-left: 10px;
  }
</style>
