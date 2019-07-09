<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="name" placeholder="请输入供应商名称" @keyup.enter.native="handleFilter" style="width: 400px;vertical-align: middle;margin-bottom: 10px;" class="input-with-select">
        <el-button  slot="append" icon="el-icon-search" @click="handleFilter"/>
      </el-input>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      :height="tableHeight"
      style="width: 100%;">
      <el-table-column label="供应商简称" min-width="150px">
        <template slot-scope="scope">
          <router-link :to="`/supplier/detail/${scope.row.id}`">
            <el-button type="text">{{ scope.row.supplierShortName }}</el-button>
          </router-link> 
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.supplierName }}
        </template>
      </el-table-column>
      <el-table-column label="供应商类别" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.supplierCategory }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="所属公司" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.companyGUID }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="供应商编号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierCode }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <router-link :to="`/supplier/detail/${scope.row.id}`">
            <el-button type="primary">查看</el-button>
          </router-link> 
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="currentPage" :page-sizes="[10,20,30, 50]" :page-size="limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { getPagedSuppliers } from '@/api/supplier'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import {deepClone} from '@/utils/index.js'
import mixin_commom from '@/utils/mixin_commom'




export default {
  name: 'SupplierList',
  directives: {
    waves
  },
  mixins:[mixin_commom],
  filters: {
    
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      limit: 10,
      currentPage: 1,
      name: undefined,
    }
  },
  computed: {
    tableHeight:function(){
      return this.clientHeight -220
    },
    listQuery: function() {
      return {
        page: this.currentPage - 1,
        name: this.name,
        filter: this.name,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      }
    },
  },
  created() {
    this.getList()
  },
  // activated(){
  //   this.getList()
  // },
  methods: {
    // handleResize (event) {
    //   this.clientHeight = document.documentElement.clientHeight -220
    // },
    getList() {
      this.listLoading = true
      getPagedSuppliers(this.listQuery).then(response => {
        this.list = response.data.result.items
        this.total = response.data.result.totalCount
        this.listLoading = false
      })
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
   
  }
}
</script>
