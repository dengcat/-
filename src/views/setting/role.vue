<template>
  <div class="app-container role">
    <div>
      <router-link :to="{path : '/setting/addsystem'}" class="document-btn">
        <el-button style="margin-bottom: 10px;" type="primary" icon="el-icon-edit">维护子系统信息</el-button>
      </router-link>
    </div>
    <el-row :gutter="6" style="height:calc(100vh - 135px);">
      <!-- <el-col :span="6" style="min-height:calc(100vh - 200px);overflow-y:auto">
        <div
          style="border: 1px solid #ebeef5;background-color: #fafafa;height:38px; border-bottom-width:2px;">
          <div style="position: relative;
        overflow-wrap: normal;
        text-overflow: ellipsis;
        vertical-align: middle;
        width: 100%;
        box-sizing: border-box;
        line-height: 33px;
        font-size: 12px;
        padding-left: 10px;">组织</div>
        </div>
        <el-tree
          :props="column"
          :highlight-current="true"
          node-key="id"
          v-on:node-click="checkRow"
          :expand-on-click-node="false"
          :default-expanded-keys="expandedKeys"
          :data="busData"
          style="border:1px solid #ebeef5;overflow: auto;height: calc(100vh - 188px);"
        ></el-tree>
      </el-col> -->
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
        <el-table :data="tableData" :height="tableHeight" v-loading="listLoading" border fit>
          <el-table-column prop="name" label="部门名称" width="180"/>
          <el-table-column
            v-for="(item,index) in columns"
            :key="index"
            :prop="item.value"
            :label="item.text"
            width="180"
          />
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <router-link
                :to="{path : '/setting/rolerelation',query: { id: scope.row.id }}"
                class="document-btn"
              >
                <el-button type="text">维护角色关系</el-button>
              </router-link>
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
  </div>
</template>

<script>
import { Message } from "element-ui";
import ElFormRenderer from "@/components/ElFormRender/render";
import treeTable from "@/components/TreeTable";
import * as mdmSubSystem from "@/api/mdmsubsystem";
import { getBusinessUnits } from "@/api/mdmmanager";
import mixin_commom from "@/utils/mixin_commom";
import OrgTree from "@/components/OrgTree";


const defaultForm = {};

export default {
  name: "Role",
  mixins: [mixin_commom],
  components: {
    ElFormRenderer,
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
      columns: null,
      active: 0,
      currentRow: null,
      loading: false,
      datalist: null,
      total: null,
      listLoading: true,
      limit: 10,
      currentPage: 1,
      currBuGuid: null,
      tableData: null,
      currOrg:undefined
    };
  },
  computed: {
    tableHeight: function() {
      return this.clientHeight - 150;
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
    getBusinessUnits().then(response => {
      if (Array.isArray(response.data.result)) {
        this.busData = response.data.result;
        this.currBuGuid = response.data.result[0].id;
        
        this.initUserList();
      }
    });
  },
  methods: {
    initUserList() {
      this.listLoading = true;
      mdmSubSystem.GetSubSystemTreeCol().then(response => {
        this.columns = response.data.result.columns;
        mdmSubSystem.GetSubSystemTreeData(this.currBuGuid).then(response => {
          this.tableData = JSON.parse(response.data.result);
          this.listLoading = false;
        });
      });
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
    }
  }
};
</script>


<style lang="scss">
.role {
  .el-tree {
    overflow: auto;
    height: calc(100vh - 160px);
  }
}
</style>