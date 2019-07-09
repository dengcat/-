<template>
  <div>
    <el-row
      :gutter="24"
      style="heigth:100%"
    >
      <el-col :span="10">
        <org-tree
          :currRow.sync="currOrg"
          :type="1"
          :expanded="3"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="checkRow"
          style="border:1px solid #ebeef5;overflow: auto;height: 363px;"
        ></org-tree>
      </el-col>
      <el-col :span="14">
        <el-table
          :data="tableData"
          v-loading="listLoading"
          style="width: 100%"
          height="400"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="userName"
            label="用户姓名"
            width="180"
          />
          <el-table-column
            prop="userCode"
            label="账号"
          />
        </el-table>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="end"
    >
      <el-col style="margin-top:20px;text-align:right;padding-right:20px;">
        <el-button
          style="width:100px;"
          @click="handleCancel()"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handleSave()"
          style="width:100px;"
        >确认</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from "element-ui";
import treeTable from "@/components/TreeTable";
import { GetBusinessUnitsIncludDepartMent } from "@/api/mdmmanager";
import * as userApi from "@/api/mdmUser";
import OrgTree from "@/components/OrgTree";

const defaultForm = {};

export default {
  name: "UserInfo",
  components: { treeTable, OrgTree },
  data() {
    return {
      tableData: null,
      busData: [],
      column: {
        children: "children",
        label: "buName"
      },
      currBuGuid: undefined,
      listLoading: true,
      multipleSelection: [],
      currOrg: undefined
    };
  },
  computed: {
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
    this.currBuGuid = this.currOrg
      ? this.currOrg.id
      : "00000000-0000-0000-0000-000000000000";
  },
  methods: {
    edit() {
      this.roleVisible = true;
    },
    checkRow(row, event, column) {
      this.currOrg = row;
      this.currBuGuid = row.id;
      this.initUserList();
    },
    initUserList: function() {
      this.listLoading = true;
      userApi.getRoleUserListByOrg(this.currOrg.orderHierarchyCode).then(response => {
        this.tableData = response.data.result.items || [];
        this.listLoading = false;
      });
    },
    handleSave() {
      //收集选中的用户数据，返回
      this.$emit("updateVale", this.multipleSelection);
    },
    handleCancel() {
      //取消返回空数组
      this.$emit("updateVale", []);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
