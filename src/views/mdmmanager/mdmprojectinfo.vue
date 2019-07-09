<template>
  <div v-loading="loading" class="app-container" style="min-width:1400px;">
    <el-row :gutter="12">
      <el-col :span="6">
        <div >
          {{project.name}}
        </div>
      </el-col>
      <el-col style="text-align:right" :span="18">  
      </el-col>
    </el-row>
      <div class="createPost-main-container" >
        <el-row type="flex" justify="center">
          <el-col :lg="4" :md="6">
            <tree-table-project style="width: 100%; margin-top:10px" v-on:row-click="checkRow" :data="projectData" :columns="columns" :expand-all="expandAll" border>
              <el-table-column label="修改状态" width="80px">
                <template slot-scope="scope">
                  <el-alert v-if="scope.row.modifyState!==0" style="width:50px;padding: 0px 0px"
                    :title="scope.row.modifyState | modiStateFilter"
                    :type="scope.row.modifyState | modiColorFilter"
                    :closable="false">
                  </el-alert>
                </template>
              </el-table-column>
            </tree-table-project>
          </el-col>
          <el-col :lg="20" :md="18">
            <div v-if="editionGrid && editionGrid.length>0">
              <tree-table-com v-loading="tableLoading" style="margin-top:10px" v-for="item in editionGrid" :key="item.gridID" :collectionPropertyItem="item"></tree-table-com>
            </div>
          </el-col>
        </el-row>
      </div>
  </div>
</template>

<script>
import TreeTableProject from "@/components/TreeTable/TreeTableProject";
import { getProjectDetailBySerialNo,getEditionGridForDetail } from "@/api/mdmmanager";
import {arrayTransTree} from '@/utils'
import TreeTableCom from "@/components/TreeTable/treetablecom";


const defaultForm = {};

export default {
  components: {
    TreeTableProject,
    TreeTableCom
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
        0: '新增',
        1: '新增',
        2: '修改',
        3: '删除'
      }
      return statusMap[state]
    },
    modiColorFilter(state){
      const statusMap = {
        0: 'success',
        1: 'success',
        2: 'warning',
        3: 'error'
      }
      return statusMap[state]
    }  
  },
  name: "MdmProjectInfo",
  data() {
    return {
      columns: [
        {
          text: "项目名称",
          value: "name"
        }
      ],
      loading: true,
      projectData: [
      ],
      expandAll:true,
      id:this.$route.params.businessDataGUID,
      checkBusinessDataGUID:this.$route.params.businessDataGUID,
      templateGUID:undefined,
      editionGrid:undefined,
      serialNo:this.$route.params.serialNo,
      tableLoading:false,
      project:{
        "businessDataGUID": this.$route.params.businessDataGUID,
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
      }
    };
  },
  computed: {},
  created() {
    // this.initPage()
    Promise.all([getProjectDetailBySerialNo({businessDataGUID:this.id,serialNo:this.serialNo}),getEditionGridForDetail({businessDataGUID:this.checkBusinessDataGUID,serialNo:this.serialNo})]).then(
      (result) =>{
        if(result[0]){
          const projectTreeInfo  = arrayTransTree(result[0].data.result,'parentGUID','businessDataGUID')
          this.projectData = projectTreeInfo
          this.project = projectTreeInfo[0]
        }
        if(result[1]){
          this.editionGrid = result[1].data.result
        }
        this.loading = false
      }
    )
  },
  methods: {
    initGrid(){
      getEditionGridForDetail({businessDataGUID:this.checkBusinessDataGUID,serialNo:this.serialNo}).then(
        response => {
          this.editionGrid = response.data.result
          this.tableLoading=false
        }
      )
    },
    checkRow(row, event, column){
      this.tableLoading=true
      this.checkBusinessDataGUID=row.businessDataGUID
      this.initGrid()
    },
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
