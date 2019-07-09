<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="projectname" placeholder="请输入项目名称" style="width: 400px;vertical-align: middle;margin-bottom: 10px;" class="input-with-select">
        <!-- <el-select v-model="templatesobject" style="width: 150px;" slot="prepend" placeholder="请选择模板对象">
          <el-option label="项目" value="项目"></el-option>
          <el-option label="供应商" value="供应商"></el-option>
        </el-select> -->
        <el-button slot="append" type="primary" icon="el-icon-search" @click="handleFilter"/>
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增{{ this.$route.params.type | typeFilter }}</el-button>
    </div>
    <el-row :gutter="24">
      <el-col :span="6">
        <tree-table :columns="column" :data="busData" :expand-all="true" style="height:100%;width: 100%; margin-top:20px" border/>
      </el-col>
      <el-col :span="18">
        <el-table :data="tableData" :key="key" border fit highlight-current-row style="width: 100%">
          <el-table-column v-for="head in formTheadOptions" :key="head.key" :label="head.label">
            <template slot-scope="scope">
              {{ scope.row[head.key] }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="'/mdmmanager/mdmdatadetail/'+scope.row.id">
                <el-button type="primary" size="mini" >{{ $t('table.edit') }}</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination :current-page="currentPage" :page-sizes="[10,20,30, 50]" :page-size="limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>

export default {
  name: 'MdmManagerList',
  filters: {
    typeFilter(type) {
      const statusMap = {
        xm: '项目',
        gys: '供应商',
      }
      return statusMap[type]
    }
  },
  data() {
    return {
      key: 1, // table key
      busData: [{
          label: '力高集团',
          children: [{
            label: '地产总部',
            
          }]
        }],
      currentPage:1,
      limit:10,
      total:0,
      projectname:''
    }
  },
  computed: {
    formTheadOptions: function() {
      const type = this.$route.params.type
      if (type == 'xm') {
        return [
        { key: 'projectname', label: '项目名称' },
        { key: 'status', label: '维护状态' },
        { key: 'date', label: '创建日期' },
        { key: 'people', label: '创建人' },
        { key: 'm', label: '引用模板' },
        ]
      } else {
        return [
        { key: 'gysname', label: '供应商名称' },
        { key: 'status', label: '维护状态' },
        { key: 'date', label: '创建日期' },
        { key: 'people', label: '创建人' },
        { key: 'm', label: '引用模板' },
        ]
      }
    },
    tableData: function() {
      const type = this.$route.params.type
      if (type == 'xm') {
        return [
        {
          projectname: '项目一',
          status: '审核中',
          date: '2017-07-01',
          people: '张三',
          m: '项目模板'
        },
        {
          projectname: '项目二',
          status: '已归档',
          date: '2017-07-01',
          people: '李四',
          m: '项目模板1'
        }
      ]
      } else {
        return [
        {
          gysname: '供应商一',
          status: '审核中',
          date: '2017-07-01',
          people: '张三',
          m: '供应商模板'
        },
        {
          gysname: '供应商二',
          status: '已归档',
          date: '2017-07-01',
          people: '李四',
          m: '供应商模板1'
        }
      ]
      }
    },
  },
  methods:{
    handleSizeChange(){

    },
    handleCurrentChange(){
      
    }
  }
}
</script>

