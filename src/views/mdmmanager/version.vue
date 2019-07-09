<template>
  <div class="app-container" v-loading = "pageLoading">
    <el-row type="flex" justify="end">
      <el-col :span="6">
          <treeselect
            noResultsText="没有搜索到结果"
            :options="busData"
            :normalizer="normalizer"
            :disable-branch-nodes="true"
            :show-count="false"
            placeholder="选择项目"
            @select="selectProject"
            noChildrenText="无项目"
            />
      </el-col>
      <el-col :span="6" :offset="6">
        <el-tag
          v-for="tag in multipleSelection"
          :key="tag.id"
          :disable-transitions="false"
          closable
          @close="handleClose(tag)">
          {{ tag.editonName }}
        </el-tag>
      </el-col>
      <el-col :span="6">
        <el-button @click="versionContrast" type="primary">对比</el-button>
      </el-col>

    </el-row>
    <el-row :gutter="6" style="heigth:100%">
      <!-- <el-col :span="6">
        <tree-table :columns="column" :data="busData" highlight-current-row :expand-all="true" style="height:100%;width: 100%; margin-top:20px" border/>
      </el-col> -->
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          :height="tableHeight"
          style="width: 100%;margin-top:20px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column
            prop="editonName"
            label="版本名称"
            width="180"/>
          <el-table-column
            prop="editionCreatedName"
            label="创建人"
          />
          <el-table-column
            label="创建日期"
            width="180">
            <template slot-scope="scope">
              {{ scope.row.creationTime | moment("YYYY-MM-DD HH:MM:SS") }}
            </template>
            </el-table-column>
          <el-table-column
            prop="editionRemark"
            label="说明"
            width="180"/>
            <el-table-column
            label="版本详情"
            width="180">
            <template slot-scope="scope">
              <router-link :to="{ path: `/mdmprojectinfo/${scope.row.businessDataGuid}/${scope.row.serialNo}`}" target="_blank">
                <el-button type="text">详情</el-button>                            
              </router-link>
            </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import { getBusinessUnitsIncludeProj } from '@/api/mdmrole'
import {arrayTransTree} from '@/utils'
import { getProjectDetailBusinessDataWithEditionList,getBusinessEditionDataByBusinessDataGuid } from '@/api/mdmmanager'
import mixin_commom from '@/utils/mixin_commom'

// import the component
import Treeselect,{ASYNC_SEARCH } from '@riophae/vue-treeselect'
// import the styles

export default {
  name: "Version",
  components: {
    treeTable,
    Treeselect
  },
  filters: {},
  mixins:[mixin_commom],
  data() {
    return {
      tableData: [
      ],
      busData: [   
      ],
      multipleSelection: [],
      currProject:{},
      loading:false,
      pageLoading:true
    };
  },
  computed: {
    tableHeight:function(){
      return this.clientHeight -220
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    versionContrast() {
      if(this.multipleSelection.length <= 1){
        this.$message({
                message: "至少选择两条记录！",
                type: "error",
                duration: 5 * 1000
              })
        return false
      }
      const comlist = this.multipleSelection
        .map(item => {
          return item.serialNo;
        })
        .join(",");
      // this.$router.push({ name: "VersionCom", params: comlist });
      this.$router.push({ path: `versioncom/${this.currProject.id}/${comlist}` });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.buName,
        children: node.children,
      }
    },
    selectProject(node, instanceId){
      this.loading = true
      this.currProject = node
      this.initGrid()
    },
    initGrid(){
      // getProjectDetailBusinessDataWithEditionList({businessDataGuid:this.currProject.id,type:1}).then(
      //   response => {
      //     this.tableData
      //   }
      // )
      this.loading = true

      getBusinessEditionDataByBusinessDataGuid(this.currProject.id).then(
          response => {
          this.tableData = response.data.result
          this.loading=false
        }
      )
    }
  },
  created(){
    getBusinessUnitsIncludeProj().then(
      response => {
        // this.busData = arrayTransTree(response.data.result,'parentGuid','id')
        this.busData = response.data.result
        this.pageLoading = false
      }
    )
  },
  // activated() {
  //   getBusinessUnitsIncludeProj().then(
  //     response => {
  //       this.busData = response.data.result
  //     }
  //   )
  // },
};
</script>
