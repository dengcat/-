<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="name" placeholder="请输入分期名称" @keyup.enter.native="handleFilter" style="width: 400px;vertical-align: middle;margin-bottom: 10px;" class="input-with-select">
        <el-button  slot="append" icon="el-icon-search" @click="handleFilter"/>
      </el-input>
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <!-- <el-button v-waves v-permission="[{functionCode: '1012', actionCodes: '02'}]" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增项目模板</el-button> -->
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
      <el-table-column show-overflow-tooltip  label="项目" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.projectName }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  label="分期" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.stagesName }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  label="版本名称" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.version }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  label="公司名称" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.buName }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  label="主数据版本" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.projectVersion }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  label="创建人" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.creationName }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  label="创建时间" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.creationTime | moment("YYYY-MM-DD") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/outline/addoutline?id='+scope.row.id">
            <el-button v-permission="[{functionCode: '1012', actionCodes: '03'}]" type="primary" size="mini">编辑</el-button>
            <el-button type="success" size="mini">查看</el-button>
          </router-link>
          <el-dropdown @command="handleCommand($event,scope.row)">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-permission="[{functionCode: '1012', actionCodes: '06'}]"  v-if="scope.row.state!=1" command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="currentPage" :page-sizes="[10,20,30, 50]" :page-size="limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { getPagedMpiVersions,deleteTemplate } from '@/api/outLineManager'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import {deepClone} from '@/utils/index.js'
import mixin_commom from '@/utils/mixin_commom'

export default {
  name: 'OutlineList',
  directives: {
    waves
  },
  mixins:[mixin_commom],
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusCnFilter(status) {
      const statusMap = {
        1: '已发布',
        0: '未发布',
      }
      return statusMap[status]
    }
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
      importanceOptions: [1, 2, 3],
      downloadLoading: false,
      templatesobject: '项目',
      publishLoading:false,
    }
  },
  computed: {
    tableHeight:function(){
      return this.clientHeight -220
    },
    listQuery: function() {
      return {
        page: this.currentPage - 1,
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
  methods: {
    getList() {
      this.listLoading = true
      getPagedMpiVersions(this.listQuery).then(response => {
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
    handleCreate() {
      this.$router.push({ path: '/outline/addoutline' })
    },
    

    handleCommand(command,row) {
      switch(command){
        case 'delete': 
          this.$confirm('此操作将删除该项目模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            this.listLoading = true
            deleteTemplate(row.id).then(()=>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            this.getList()
            })
            
            // const index = this.list.indexOf(row)
            // this.list.splice(index, 1)
          }).catch();
        break;
        case 'copy':
          this.$prompt('请输入模板名称', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '请填写模板名称'
          }).then(({ value }) => {
            const newrow = deepClone(row)
            newrow.name = value
            this.listLoading = true
            copyTemplate(newrow).then(
              (response) => {
                this.$message({
                  type: 'success',
                  message: '复制成功!'
                });
                this.getList()
              }
            )
          }).catch(() => {
                  
          });
        break
      }
      
      
      
    },
    handlePublishTemplate(row){
      publishTemplate({templateGuid:row.id}).then(
        (response) => {
          this.$message({
            type: 'success',
            message: '发布成功!'
            }); 
        }
      )
    }
  }
}
</script>
