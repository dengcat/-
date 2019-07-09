<template>
  <div class="app-container userinfo">
    <el-input
        v-model="filter"
        placeholder="请输入用户姓名或者账号"
        @keyup.enter.native="initUserList"
        style="width: 350px;vertical-align: middle;margin-bottom: 10px;"
      >
        <el-button slot="append" icon="el-icon-search" @click="initUserList"/>
      </el-input>
    <el-row :gutter="6" style="heigth:100%">
      <el-col :md="8" :lg="5">
        <!-- type 0 公司,1 公司部门;currRow 当前选中行；expanded 展开层级；node-click:选中事件，初始化会选中第一条，触发选中事件 -->
        <org-tree 
        :currRow.sync="currOrg"
        :type="1"
        :expanded="2"
        :highlight-current="true" 
        :expand-on-click-node="false" 
        @node-click="checkRow"
        ></org-tree>
      </el-col>
      <el-col :md="16" :lg="19">
        <el-table
          :data="tableData"
          v-loading="listLoading"
          border
          style="min-height:calc(100vh - 135px);width: 100%"
          fit
        >
          <el-table-column prop="userName" label="用户姓名" width="180"/>
          <el-table-column prop="userCode" label="账号" width="180"/>
          <el-table-column prop="buFullName" label="组织"/>
          <el-table-column prop="address" label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">授权角色</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10,20,30, 50]"
          :page-size="limit"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
    <!-- 授权 -->
    <el-dialog v-el-drag-dialog :visible.sync="roleVisible" title="授权角色">
      <el-transfer
        style="margin-bottom:10px"
        filterable
        filter-placeholder="请输入角色名称"
        v-model="value2"
        :titles="['待选角色','已选角色']"
        :data="data2"
      ></el-transfer>
      <el-button type="primary" @click="saveRoleUser()">保存</el-button>
      <el-button @click="() => this.roleVisible = false">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import treeTable from "@/components/TreeTable";
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import { GetBusinessUnitsIncludDepartMent } from "@/api/mdmmanager";
import * as userApi from "@/api/mdmUser";
import * as roleApi from "@/api/mdmrole";
import OrgTree from "@/components/OrgTree";

const defaultForm = {};

export default {
  name: "UserInfo",
  directives: { elDragDialog },
  components: {
    treeTable,
    OrgTree
  },
  data() {
    return {
      busData: [],
      column: {
        children: "children",
        label: "buName"
      },
      roleVisible: false,
      tableData: null,
      currBuGuid: undefined,
      total: null,
      listLoading: true,
      limit: 10,
      currentPage: 1,
      currentUserId: null,
      value2: [],
      data2: [],
      currOrg:undefined,
      filter:undefined
    };
  },

  computed: {
    roleUsersQuery: function() {
      return {
        page: this.currentPage - 1,
        orderHierarchyCode: this.currOrg.orderHierarchyCode,
        filter: this.filter,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      };
    },
    expandedKeys: function() {
      let expandedKeys = [];
      this.busData.forEach(item => {
        expandedKeys.push(item.id);
        if (item.children && item.children.length > 0) {
          item.children.forEach(childrenItem => {
            expandedKeys.push(childrenItem.id);
          });
        }
      });
      return expandedKeys;
    }
  },
  created() {
    // GetBusinessUnitsIncludDepartMent().then(response => {
    //   if (Array.isArray(response.data.result)) {
    //     this.busData = response.data.result;
    //     this.currBuGuid = response.data.result[0].id;
    //     this.initUserList();
    //   }
    // });
    // this.currBuGuid = this.currOrg.id || "00000000-0000-0000-0000-000000000000"
  },
  methods: {
    initUserList: function() {
      this.listLoading = true;
      userApi.getRoleUserListByOrg(this.roleUsersQuery).then(response => {
        this.tableData = response.data.result.items || [{}];
        this.total = response.data.result.totalCount;
        this.listLoading = false;
      });
    },
    checkRow(row, event, column) {
      this.currBuGuid = row.id;
      this.currentPage = 1;
      this.initUserList();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.initUserList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initUserList();
    },
    edit(row) {
      this.roleVisible = true;
      this.data2 = [];
      this.value2 = [];
      this.currentUserId = row.userId;
      roleApi.getMdmRolesNotPaged(this.currentUserId).then(res => {
        res.data.result.allRoles.forEach(ele => {
          this.data2.push({
            key: ele.id,
            label: ele.roleName
          });
        });
        this.value2 = res.data.result.selectedRoles
          ? res.data.result.selectedRoles
          : [];
      });
    },
    saveRoleUser() {
      this.roleVisible = false;
      var userRoleData = {
        userId: this.currentUserId,
        roles: this.value2
      };
      roleApi.saveUserRole(userRoleData).then(response => {
        if (response.data.success == true) {
          this.$message({
            type: "success",
            message: "授权成功!"
          });
        } else {
          this.$message({
            type: "error",
            message: "授权失败!"
          });
        }
        this.initUserList();
      });
    }
  }
};
</script>


<style lang="scss">
.userinfo {
  .el-tree {
    overflow: auto;
    height: calc(100vh - 172px);
  }
  .el-transfer-panel{
    width: 350px !important;
  }
}
</style>



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
