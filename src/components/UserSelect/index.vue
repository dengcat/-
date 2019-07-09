<template>
  <div class="userselect">
    <el-input
      v-model="searchKey"
      @keyup.enter.native="initUserList"
      placeholder="请输入姓名或者账号"
      style="width: 290px;vertical-align: middle;margin-bottom: 10px;"
      class="input-with-select"
    >
      <el-button slot="append" type="primary" @click="initUserList" icon="el-icon-search"/>
    </el-input>
    <el-row :gutter="24" style="heigth:100%">
      <el-col :span="8">
        <org-tree 
          :currRow.sync="currOrg"
          :type="1"
          :expanded="3"
          :highlight-current="true" 
          :expand-on-click-node="false" 
          @node-click="checkRow"
        ></org-tree>
      </el-col>
      <el-col :span="16">
        <el-table
          ref="usertable"
          :data="tableData"
          v-loading="listLoading"
          style="width: 100%"
          height="400"
          @select="handleSelection"
          @select-all="handleSelectionAll"
          border
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="userName" label="用户姓名" width="180"/>
          <el-table-column prop="userCode" label="账号"/>
        </el-table>
        <div class="pagination-container">
          <el-pagination :current-page="currentPage" :page-sizes="[10,20,30, 50]" :pager-count="5" :page-size="limit" :total="total" background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col style="margin-top:20px;text-align:right;padding-right:20px;">
        <el-button style="width:100px;" @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="handleSave()" style="width:100px;">确认</el-button>
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
  name: "UserSelect",
  components: { treeTable,OrgTree },
  props:{
    defaultMultipleSelection:{
      type:Array,
      default:[]
    }
  },
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
      currOrg:undefined,
      searchKey:undefined,
      total: null,
      limit: 10,
      currentPage: 1,
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
  methods: {
    defaultSelection(){
      this.multipleSelection.forEach(
        multipleSelectionitem => {
          const row = this.tableData.find(item => multipleSelectionitem.userId === item.userId)
          if(row){
            this.$refs.usertable.toggleRowSelection(row,true)
          }
        }
      )
      
    },
    edit() {
      this.roleVisible = true;
    },
    checkRow(row, event, column) {
      this.currBuGuid = row.id;
      this.initUserList();
    },
    handleSizeChange(val) {
      this.limit = val
      this.initUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.initUserList()
    },
    initUserList: function() {
      this.listLoading = true;
      const listQuery ={
        orderHierarchyCode: this.currOrg.orderHierarchyCode,
        page: this.currentPage - 1,
        filter: this.searchKey,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      }
      
      userApi.getRoleUserListByOrg(listQuery).then(response => {
        this.tableData = response.data.result.items || [];
        this.total = response.data.result.totalCount;
        this.$nextTick(function(){this.defaultSelection()})
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
    handleSelection(selection,row) {
      if(selection.findIndex((selectionitem) => row.userId === selectionitem.userId)>=0 && 
      this.multipleSelection.findIndex((multipleSelectionitem) => {
      return row.userId === multipleSelectionitem.userId})<0){
        this.multipleSelection.push(row)
      }
      else{
        this.multipleSelection.splice(this.multipleSelection.findIndex((item) => row.userId === item.userId),1)
      }
    },
    handleSelectionAll(selection){
      if(selection.length>0){
        selection.forEach(item=>{
          if(this.multipleSelection.findIndex((multipleSelectionitem) => {
            return item.userId === multipleSelectionitem.userId})<0)
          {
            this.multipleSelection.push(item)
          }
        })
      }
      else{
        this.tableData.forEach(item=>{
          const index = this.multipleSelection.findIndex((multipleSelectionitem) => {
            return item.userId === multipleSelectionitem.userId}
          )
          if(index>=0)
          {
            this.multipleSelection.splice(index,1)
          }
        })
      }
    }
  }
};
</script>
<style lang="scss">
.userselect {
  .el-tree {
    overflow: auto;
    height: 363px;
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
