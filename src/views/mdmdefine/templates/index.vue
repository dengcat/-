<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="name" placeholder="请输入模板名称" @keyup.enter.native="handleFilter" style="width: 400px;vertical-align: middle;margin-bottom: 10px;" class="input-with-select">
        <el-select slot="prepend" v-model="templatesobject" style="width: 100px;" placeholder="请选择模板对象">
          <el-option label="项目模板" value="项目"/>
          <!-- <el-option label="供应商模板" value="供应商"></el-option> -->
        </el-select>
        <el-button  slot="append" icon="el-icon-search" @click="handleFilter"/>
      </el-input>
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button v-permission="[{functionCode: '1012', actionCodes: '02'}]" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增项目模板</el-button>
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
      <el-table-column label="序号" type="index" align="center" width="65"/>
      <el-table-column label="模板名称" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="说明" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ scope.row.state | statusCnFilter }}</el-tag>
          <!-- <el-tag :type="1 | statusFilter">{{ 1 | statusCnFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="left" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/mdmdefine/edittemplates/'+scope.row.id">
            <el-button v-permission="[{functionCode: '1012', actionCodes: '03'}]" type="primary" size="mini" v-if="scope.row.state==0">编辑</el-button>
            <el-button type="success" size="mini" v-if="scope.row.state!=0">查看</el-button>
          </router-link>
          <el-button v-permission="[{functionCode: '1012', actionCodes: '04'}]" size="mini" type="success" v-if="scope.row.state==0"  @click="handleModifyStatus(scope.row,1)">发布
          </el-button>
          <el-button v-permission="[{functionCode: '1012', actionCodes: '05'}]"  v-if="scope.row.state==1" style="width:70px" type="primary" size="mini" @click="handleModifyStatus(scope.row,0)">取消发布</el-button>
          <el-dropdown @command="handleCommand($event,scope.row)">
            <el-button size="mini">
              更多<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-permission="[{functionCode: '1012', actionCodes: '06'}]"  v-if="scope.row.state!=1" command="delete">删除</el-dropdown-item>
              <el-dropdown-item v-permission="[{functionCode: '1012', actionCodes: '07'}]"  command="copy">复制</el-dropdown-item>
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
import { deleteTemplate,publishTemplate,cancelPublishTemplate,copyTemplate } from '@/api/mdmtemplates'
import { fetchList } from '@/api/mdmtemplates'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import {deepClone} from '@/utils/index.js'
import mixin_commom from '@/utils/mixin_commom'




export default {
  name: 'MdmTemplates',
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
      // clientHeight:document.documentElement.clientHeight -220
    }
  },
  // mounted: function() {
  //   window.addEventListener('resize', this.handleResize)
  // },
  // beforeDestroy: function() {
  //   window.removeEventListener('resize', this.handleResize)
  // },
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
      fetchList(this.listQuery).then(response => {
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
    handleModifyStatus(row, state) {
      this.listLoading = true
      if(state==1){
        publishTemplate({templateGuid:row.id}).then(
                (response) => {
                  this.getList()
                  this.$message({
                    type: 'success',
                    message: '发布成功!'
                    }); 
                }
              )
      }else{
        cancelPublishTemplate({templateGuid:row.id}).then(
                (response) => {
                  this.getList()
                  this.$message({
                    type: 'success',
                    message: '取消发布成功!'
                    }); 
                }
              )
      }
      
      
      // row.status = status
    },
    handleCreate() {
      this.$router.push({ path: '/mdmdefine/addtemplates' })
    },

    handleCommand(command,row) {
      switch(command){
        case 'delete': 
          this.$confirm('此操作将删除该项目模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            deleteTemplate(row).then(()=>{
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
