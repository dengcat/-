<template>
  <div v-loading="loading">    
     <div style="margin-top: 20px">
        <div class="filter-container">
          <el-input v-model="reportName" placeholder="报表名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter()"/>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter()">搜索</el-button>
        </div>
        <el-table v-loading="listLoading" :data="reportlist" border fit  highlight-current-row style="width: 100%;">
          <el-table-column label="序号" type="index" align="center" width="65"/>
          <el-table-column label="报表名称" min-width="150px">
            <template slot-scope="scope">                  
              <router-link :to="{ path: `/report/detail/${encodeURIComponent(scope.row.reportUrl)}`}" tag="a">{{ scope.row.reportName }}</router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30, 50]"
            :page-size="limit"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import waves from '@/directive/waves' // 水波纹指令
import { getReportList} from '@/api/mdmreport'
export default {
  name: 'ReportList',
  filters: {},
  directives:{waves},
  props: {
    reportClass: {
      type: String
    },
    reportClassGuid: {
      type: String
    }  
  },
  data() {
    return {      
      loading: false    ,
      total: null,
      limit: 10,
      currentPage: 1,
      reportlist:[]  ,
      reportName: undefined,
      listLoading: false
    }
  },
  computed: {    
    listQuery: function() {
      return {
        reportClassGuid: this.reportClassGuid || "00000000-0000-0000-0000-000000000000",
        page: this.currentPage - 1,
        reportName: this.reportName,
        filter: this.reportName,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      }
    }
  },
  created() {
    this.listLoading = true
    this.getList();
  },
  methods: {
    getList() {         
      getReportList(this.listQuery).then(response => {       
        this.reportlist = response.data.result.items;  
        this.total = response.data.result.totalCount          
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList();
    },
  }
}
</script>