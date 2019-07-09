<template>
  <div class="app-container">
    <el-form ref="postForm" style="width:100%">
      <div class="createPost-main-container">
        <el-steps :active="active" style="margin-bottom:10px" simple finish-status="success">
          <el-step title="选择模板" icon="el-icon-edit"/>
          <el-step title="创建项目" icon="el-icon-setting"/>
          <el-step title="维护项目属性" icon="el-icon-upload"/>
        </el-steps>
        <div :style="{display:active==0? '':'none'}">
          <el-row type="flex" justify="center" style="margin-top:20px">
            <el-col :span="12">
              <el-form ref="form" label-width="80px">
                <el-form-item label="选择公司">
                  <el-cascader
                    v-model="buGuid"
                    style="width:100%"
                    :props="{label:'buName',value:'id'}"
                    :options="businessUnits"
                    :show-all-levels="false"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="选择模板">
                  <el-select v-model="templateGuid" placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in tableTemplates"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <!-- <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-table
                ref="templateTable"
                :current-row="currentRow"
                :data="tableTemplates"
                highlight-current-row
                style="width: 100%; " 
                @current-change="handleCurrentChange">
                <el-table-column
                  prop="name"
                  label="模板名称"
                  width="180"/>
                <el-table-column
                  prop="remark"
                  label="说明"
                />
              </el-table>
            </el-col>

          </el-row> -->
          
        </div>

        <div v-loading="loading" v-if="active==1">
          <el-row type="flex" justify="center">
            <el-col :span="24">
              <el-form-renderer mode="1" ref="projectForm" :initData="initData" :businessObject="businessObject" :content="content"/>
            </el-col>
          </el-row>
        </div>

        <div v-if="active==2">
          <el-row type="flex" justify="center">
            <el-col :span="24">
              <tree-table :data="projectData" :columns="columns" :expand-all="expandAll" style="width: 100%; margin-top:20px" border>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button v-if="scope.row._level==1" type="text" @click="edit(scope.row)">新增分期</el-button>
                    <el-button v-if="scope.row._level==2" type="text" @click="edit(scope.row)">新增楼栋</el-button>
                  </template>
                </el-table-column>
              </tree-table>
            </el-col>
          </el-row>
        </div>
        <el-row type="flex" justify="center">
          <el-form-item style="margin-top: 40px;">
            <el-button v-if="active>0 && active<2" @click="pre">上一步</el-button>
            <el-button v-if="active<2" :loading="loading" type="primary" @click="next">下一步</el-button>
            <el-button v-if="active==2" type="primary" >保存</el-button>
            <el-button v-if="active==2" type="primary" >保存并发起审批</el-button>
          </el-form-item>
        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>
import { Message } from "element-ui";
import ElFormRenderer from "@/components/ElFormRender/render";
import treeTable from "@/components/TreeTable";
import { getPublishTemplate,getTemplateBusinessObjectList} from "@/api/mdmtemplates";
import { saveBusinessData,getBusinessUnits,getProjectInitData } from "@/api/mdmmanager";


const defaultForm = {};

export default {
  name: "AddMdmProject",
  components: {
    ElFormRenderer,
    treeTable,
  },
  data() {
    return {
      test:undefined,
      columns: [
        {
          text: "项目名称",
          value: "name"
        }
      ],
      expandAll: true,
      active: 0,
      currentRow: null,
      loading: false,
      tableTemplates: [],
      businessObject:{},
      projectData: [
        {
          name: "咸阳-御景湾",
          remark: "",
          children: [
            {
              name: "御景湾一期",
              remark: ""
            }
          ]
        }
      ],
      content: [
      ],
      initData:{},
      buGuid:undefined,
      businessUnits:[],
      templateGuid:undefined,
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
        "modifyState":1,
        "propertyValue":undefined,
        "isTempSave":0
      }
    };
  },
  computed: {},
  created() {
    getPublishTemplate({}).then(response => {
      this.tableTemplates = response.data.result;
      // if (response.data.result.length > 0) {
      //   this.$refs.templateTable.setCurrentRow(response.data.result[0]);
      //   this.currentRow = response.data.result[0];
      // }
    });

    getBusinessUnits().then(response=>{
      this.businessUnits = response.data.result
    })
  },
  methods: {
    next() {
      if(this.active == 0){
        this.loading = true
        getTemplateBusinessObjectList({id:this.templateGuid}).then(
          (response) => {
            if(Array.isArray(response.data.result)){
              const businessObject = response.data.result.find(item=> item.businessObjectGUID=='4e947176-a557-42d1-8acf-dea5bec1d15a')
              this.businessObject = businessObject
              this.content = businessObject.normDefineRegion[0].children
              getProjectInitData({buGuid:this.buGuid[this.buGuid.length-1],templateGuid : this.templateGuid}).then((response) => {
                this.initData = response.data.result
                this.loading = false
                if (this.active++ > 2) this.active = 2; 
              })
              
            }
          }
        )
      }else if(this.active==1){
        this.$refs.projectForm.validate().then(
        (result) => {
          if(!result) {
            Message({
                message: "表单校验不通过，请检查",
                type: "error",
                duration: 5 * 1000
              })
            return
          }
          this.loading = true
          this.handleSaveBusinessData()
        })    
      }
    },
    pre() {
      if (this.active-- < 0) this.active = 0;
      this.loading = false;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },

    //保存项目数据
    handleSaveBusinessData(){
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
        "propertyValue":JSON.stringify(businessData),
        "IsTempSave":0,
        "ModifyState":1
      })
      saveBusinessData(this.senddata).then(
        (response)=>{
          Message({
                message: "保存成功！",
                type: "info",
                duration: 5 * 1000
              });
          this.loading = false
          this.$router.push({ path: `/mdmmanager/mdmprojectedit/${response.data.result}/${this.templateGuid}` });
        }
      ).catch(
        error =>{
          this.loading = false
        }
      )
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
</style>
