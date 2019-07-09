<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row :gutter="6" style="heigth:100%">
      <!-- <el-col :span="6">
        <tree-table :columns="column" :data="busData" highlight-current-row :expand-all="true" style="height:100%;width: 100%; margin-top:20px" border/>
      </el-col>-->
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          :height="tableHeight"
          style="width: 100%;margin-top:20px;"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="businessName" label="项目名称"/>
          <el-table-column prop="creationName" label="操作者" width="180"/>
          <el-table-column label="分发日期" width="180">
            <template
              slot-scope="scope"
            >{{ scope.row.creationTime | moment("YYYY-MM-DD HH:mm:ss") }}</template>
          </el-table-column>
          <el-table-column prop="state" label="分发状态" width="180"/>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!-- <router-link
                :to="{ path: `${sipUrl}/ErrorFlowManager/timebasedFlowTree.html?${scope.row.businessGuid}`}"
                target="_blank"
                tag="a"
              >
                <el-button type="text">详情</el-button>
              </router-link> -->
              <a
                target="_blank"
                :href="`${sipUrl}/ErrorFlowManager/timebasedFlowTree.html?id=${scope.row.sipEventGuid}`"
              >
                <el-button type="text">详情</el-button>
              </a>
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
import mixin_commom from "@/utils/mixin_commom";
import { getDistributeLog } from "@/api/mdmmanager";
export default {
  name: "DistributeLog",
  mixins: [mixin_commom],
  data() {
    return {
      tableData: [],
      total: null,
      limit: 10,
      currentPage: 1,
      loading: false,
      pageLoading: true,
      businessGuid: this.$route.params.id,
      sipUrl: process.env.SIP_API
    };
  },
  computed: {
    tableHeight: function() {
      return this.clientHeight - 220;
    }
  },
  methods: {
    handleSizeChange: function(val) {
      this.limit = val;
      this.initPage();
    },
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.initPage();
    },
    initGrid() {
      this.loading = true;

      getDistributeLog({
        businessGuid:
          this.businessGuid || "00000000-0000-0000-0000-000000000000",
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      }).then(response => {
        this.tableData = response.data.result.items;
        this.total = response.data.result.totalCount;
        this.loading = false;
        this.pageLoading = false;
      });
    }
  },
  created() {
    this.initGrid();
  }
};
</script>