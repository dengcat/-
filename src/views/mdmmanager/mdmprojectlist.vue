<template>
  <div class="app-container projectlist" style="min-width:1024" v-loading="pageLoading">
    <div class="filter-container">
      <el-input
        v-model="projectname"
        @keyup.enter.native="initPage"
        placeholder="请输入项目名称"
        style="width: 400px;vertical-align: middle;margin-bottom: 10px;"
        class="input-with-select"
      >
        <el-button slot="append" type="primary" @click="initPage" icon="el-icon-search"/>
      </el-input>
      <el-button v-permission="[{functionCode: '1013', actionCodes: '02'}]"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增项目</el-button>
    </div>
    <el-row :gutter="6">
      <el-col :md="8" :lg="5">
        <!-- type 0 公司,1 公司部门;currRow 当前选中行；expanded 展开层级；node-click:选中事件，初始化会选中第一条，触发选中事件 -->
        <org-tree 
        :currRow.sync="currOrg"
        :type="0"
        :expanded="3"
        :highlight-current="true" 
        :expand-on-click-node="false" 
        @node-click="checkRow"></org-tree>
      </el-col>
      <el-col :md="16" :lg="19">
        <el-table
          :height="tableHeight"
          v-loading="listLoading"
          style="width: 99%"
          :data="list"
          :key="key"
          border
          fit
        >
          <!-- <el-table-column v-for="head in formTheadOptions" :key="head.key" :label="head.label">
            <template slot-scope="scope">
              {{ scope.row[head.key] }}
            </template>
          </el-table-column>-->
          <el-table-column min-width="150px" label="项目名称" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="所属公司" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.buName }}</template>
          </el-table-column>
          <el-table-column label="维护状态" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.approveState | stateFilter }}</template>
          </el-table-column>
          <el-table-column label="创建日期" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.creationTime | moment("YYYY-MM-DD HH:MM:SS") }}
              <!-- {{moment(scope.row.creationTime,"MM-DD-YYYY")}} -->
            </template>
          </el-table-column>
          <el-table-column label="引用模板" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.templateName }}</template>
          </el-table-column>
          <el-table-column width="220px" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.approveState===0 || scope.row.approveState===1"
                type="primary"
                size="mini"
                @click="handleOpenProjectInfo(scope.row)"
                v-permission="[{functionCode: '1013', actionCodes: '03'}]"
              >编辑</el-button>
              <!-- {{scope.row.approveState}} {{checkPermission([{functionCode: '1013', actionCodes: '00'}])}} -->
              <el-button
                v-if="(scope.row.approveState!==0 && scope.row.approveState!==1) || ((scope.row.approveState===0 || scope.row.approveState===1) && checkPermission([{functionCode: '1013', actionCodes: '00'}]) && !checkPermission([{functionCode: '1013', actionCodes: '03'}]))"
                type="success"
                size="mini"
                @click="handleOpenProjectInfo(scope.row)"
              >查看</el-button>
              <el-button
                style="margin-left:-1px"
                v-if="scope.row.approveState===0 || scope.row.approveState===1"
                type="primary"
                size="mini"
                @click="handleDelteProject(scope.row)"
                v-permission="[{functionCode: '1013', actionCodes: '04'}]"
              >删除</el-button>       
              <el-dropdown v-if="scope.row.status!==1" v-permission="[{functionCode: '1013', actionCodes: '06'}]" @command="handleCommand($event,scope.row)">
                <el-button size="mini">更多
                  <i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item v-if="scope.row.status!=2">维护数据权限</el-dropdown-item> -->
                  <el-dropdown-item v-permission="[{functionCode: '1013', actionCodes: '06'}]" command="reDistributeProjects" v-if="scope.row.status!=2">重新分发</el-dropdown-item>
                  <el-dropdown-item v-permission="[{functionCode: '1013', actionCodes: '06'}]" @click.native="distributeLog(scope.row)" v-if="scope.row.status!=2">分发日志</el-dropdown-item>
                  <el-dropdown-item v-permission="[{functionCode: '1013', actionCodes: '06'}]" @click.native="handleExportProject(scope.row)" v-if="scope.row.status!=2">导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30,50]"
            :page-size="limit"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import {
  getBusinessUnits,
  getBusinessData,
  deleteBusinessData,
  reDistributeProjects,
  exportBusinessDataExcel
} from "@/api/mdmmanager";
import mixin_commom from "@/utils/mixin_commom";
import OrgTree from "@/components/OrgTree";
import checkPermission from '@/utils/permission' // 权限判断函数
import Cookies from 'js-cookie'


export default {
  name: "MdmProjectList",
  components: { treeTable,OrgTree },
  filters: {
    stateFilter(type) {
      const statusMap = {
        0: "创建",
        1: "修订中",
        2: "审核中",
        5: "已审核"
      };
      return statusMap[type];
    }
  },
  mixins: [mixin_commom],
  data() {
    return {
      key: 1, // table key
      projectname: "",
      busData: [],
      column: [
        {
          text: "公司",
          value: "buName"
        }
      ],
      formTheadOptions: [
        { key: "name", label: "项目名称" },
        { key: "company", label: "所属公司" },
        { key: "state", label: "维护状态" },
        { key: "creationTime", label: "创建日期" },
        { key: "createByName", label: "创建人" },
        { key: "templateName", label: "引用模板" }
      ],
      tableData: [],
      list: null,
      total: null,
      listLoading: true,
      limit: parseInt(Cookies.get('pageSize')) || 10,
      currentPage: 1,
      pageLoading: false,
      defaultProps: {
        children: "children",
        label: "buName"
      },
      currOrg:undefined,
      BASE_API:process.env.BASE_API
    };
  },
  computed: {
    tableHeight: function() {
      return this.clientHeight - 220;
    },
  },
  methods: {
    checkPermission,
    handleOpenProjectInfo: function(project) {
      this.$router.push({
        path: `/mdmmanager/mdmprojectedit/${project.projectGUID}/${
          project.templateGUID
        }`
      });
    },
    handleCreate: function() {
      this.$router.push({ path: "/mdmmanager/addmdmproject" });
    },
    checkRow(row) {
      this.initPage();
    },
    initPage: function() {
      this.listLoading = true;
      getBusinessData({
        buGuid: this.currOrg.id || "00000000-0000-0000-0000-000000000000",
        page: this.currentPage - 1,
        name: this.projectname,
        filter: this.projectname,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined,
        orderHierarchyCode: this.currOrg.orderHierarchyCode
      }).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.totalCount;
        this.listLoading = false;
        this.pageLoading = false;
      });
    },
    handleSizeChange: function(val) {
      this.limit = val;
      Cookies.set('pageSize', val)
      this.initPage();
    },
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.initPage();
    },
    handleDelteProject: function(row) {
      deleteBusinessData(row.businessDataGUID).then(response => {
        this.$message({
          message: "删除成功！",
          type: "info",
          duration: 5 * 1000
        });
        this.initPage();
      });
    },
    handleCommand(command, row) {
      switch (command) {
        case "reDistributeProjects":
          if (row.approveState !== 0) {
            reDistributeProjects([row.projectGUID]).then(response => {
              this.$message({
                message: "重新分发成功！",
                type: "info",
                duration: 2 * 1000
              });
            });
          } else {
            this.$message({
              message: "创建版不允许分发!",
              type: "info",
              duration: 2 * 1000
            });
          }

          break;
      }
    },
    distributeLog(project){
      this.$router.push({
        path: `/mdmmanager/distributeLog/${project.businessDataGUID}`
      });
    },
    handleExportProject(row){
      window.location.href=`${this.BASE_API}api/services/app/projectManage/ExportExcel?businessDataGuid=${row.businessDataGUID}`;
    }
  }
};
</script>


<style lang="scss">
.projectlist {
  .el-tree {
    overflow: auto;
    height: calc(100vh - 250px);
  }
}
</style>

