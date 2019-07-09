<template>
  <div class="app-container projectselect" v-loading="pageLoading">
    <div class="filter-container">
      <el-input
        v-model="projectname"
        @keyup.enter.native="initPage"
        placeholder="请输入项目名称"
        style="width: 400px;vertical-align: middle;margin-bottom: 10px;"
        class="input-with-select"
      >
        <el-button slot="append" type="primary" @click="initPage" icon="el-icon-search"/>
      </el-input>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          style="width: 99%"
          :data="list"
          border
          fit
          row-key="id"
          :isTreeExpandAll="true"
          :height="tableHeight"
        >
          <el-table-column min-width="100px" label="项目分期名称">
            <template slot-scope="scope">
              <router-link target="_blank" :to="`/mdmmanager/mdmprojectobject/${scope.row.projectId}/${scope.row.projectName}/${scope.row.templateGUID}/${scope.row.projectId}/分期/${scope.row.businessDataGuid}`">
                <el-link type="primary" style="font-size:12px">{{ scope.row.businessDataName }}</el-link>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" label="版本名称">
            <template slot-scope="scope">
              {{ scope.row.editonName }}
              <svg-icon
                v-if="scope.row.isNew"
                icon-class="new"
                style="width:50px;height:20px;vertical-align: top;color:red;float:right"
              />
            </template>
          </el-table-column>
          <el-table-column label="所属公司">
            <template slot-scope="scope">{{ scope.row.buName }}</template>
          </el-table-column>
          <el-table-column label="审核状态" width="100">
            <template slot-scope="scope">{{ scope.row.approveStateName }}</template>
          </el-table-column>
          <el-table-column label="编制人" width="100">
            <template slot-scope="scope">{{ scope.row.editionCreatedName }}</template>
          </el-table-column>
          <el-table-column label="编制日期" width="150">
            <template
              slot-scope="scope"
            >{{ scope.row.editionCreatedTime | moment("YYYY-MM-DD HH:MM:SS") }}</template>
          </el-table-column>
          <el-table-column width="120px" label="操作" align="center">
            <template slot-scope="scope">
              <el-popover
                placement="top"
                width="160"
                v-model="scope.row.popover"
                >
                <p style="font-size:12px">{{scope.row.approveStateName==='已审核'? '选择此版本?': '未审核不允许创建实施纲要！'}}</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleChoose(scope.row)">确定</el-button>
                </div>
                <i class="el-icon-finished el-icon-hover" slot="reference">
                </i>
              </el-popover>
              
              <!-- <el-button v-if="scope.row.approveStateName==='已审核'" type="primary" size="mini" @click="handleChoose(scope.row)">选择此版本</el-button> -->
              <!-- <svg-icon
                v-else
                icon-class="tip"
              ></svg-icon> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[15,20,30,50]"
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

    <el-dialog
      :close-on-click-modal="false" title="新增实施纲要信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="项目分期名称" label-width="180px">
          <el-input v-model="form.businessDataName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="主数据版本" label-width="180px">
          <el-input v-model="form.editonName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="实施纲要版本名称" prop="version" label-width="180px">
          <el-input v-model="form.version" class="input-with-select">
            <!-- <el-tooltip slot="prepend" :content="form.editonName" effect="light">
              <el-select style="min-width:150px" v-model="form.editonName" >
                <el-option label="启动版" value="1"></el-option>
                <el-option label="在建版" value="2"></el-option>
                <el-option label="拿地版" value="3"></el-option>
              </el-select>
            </el-tooltip> -->
          </el-input>
        </el-form-item>
        <el-form-item label="初始年份" prop="year" label-width="180px">
          <el-select v-model="form.year" style="width:100%">
            <el-option v-for="item in arrYear" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getStages,createMpiVersion } from "@/api/outLineManager";
import mixin_commom from '@/utils/mixin_commom'
import moment from "moment";


export default {
  mixins:[mixin_commom],
  data() {
    const currYear = parseInt(moment().format('YYYY'))
    const arrYear = []
    for(let i = currYear -5 ;i<= currYear + 3; i++){
      arrYear.push(i)
    }
    return {
      projectname: "",
      listLoading: false,
      pageLoading: false,
      currentId: undefined,
      total: null,
      limit: 15,
      currentPage: 1,
      list: [],
      currOrg: undefined,
      currRow:{},
      form:{
        businessDataName: undefined,
        version: undefined, // 实施纲要版本
        editonName: undefined, // 主数据版本名称
        year:undefined
      },
      dialogFormVisible:false,
      visible2:false,
      rules:{version: [
            { required: true, message: '请填写实施纲要版本名称', trigger: 'change' }
          ]},
      arrYear
    };
  },
  computed: {
    tableHeight:function(){
      return this.clientHeight -180
    },
    listQuery: function() {
      return {
        page: this.currentPage - 1,
        name: this.name,
        filter: this.name,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      };
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      outline_info: state => state.outline_info
    })
  },
  methods: {
    initPage() {
      this.listLoading = true;
      getStages({
        page: this.currentPage - 1,
        name: this.projectname,
        filter: this.projectname,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      }).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.totalCount;
        this.listLoading = false;
        this.pageLoading = false;
      });
    },
    ...mapActions(['outline_stepInfo_UpdateStepInfo','CreateOutlineInfo']),
    handleChoose(row) {
      row.popover = false
      if(row.approveStateName!=='已审核'){
        return
      }
      this.currRow = row
      const arrEditonName = row.editonName.split('_')
      this.form = {
        businessDataName: row.businessDataName,
        editonName: row.editonName,
        version: `${arrEditonName[0]}实施纲要_${moment().format('YYYYMMDD')}`,
        year: parseInt(moment().format('YYYY'))
      }
      this.dialogFormVisible = true
    },
    handleConfirm(){
      this.dialogFormVisible = false
      const loading = this.$loading({
        lock: true,
        text: '正在生成实施纲要中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // 保存信息，生成实施纲要
      this.CreateOutlineInfo({
        version: `${this.form.editonName}_${this.form.version}`,
        projectId: this.currRow.projectId,
        projectCode: this.currRow.projectCode,
        projectName: this.currRow.projectName,        
        stagesId: this.currRow.businessDataGuid,
        stagesCode: this.currRow.businessDataCode,
        stagesName: this.currRow.businessDataName,
        projectVersion:this.currRow.editonName,
        buGuid: this.currRow.buGuid,
        buName: this.currRow.buName,
        year: this.form.year
      }).then(response => {
        loading.close()
        // 更新步骤信息
        this.outline_stepInfo_UpdateStepInfo({step: 1})
        this.$router.push(`/outline/outlineinfo/${response.data.result}`)
      });
    },
    handleSizeChange: function(val) {
      this.limit = val;
      Cookies.set("pageSize", val);
      this.initPage();
    },
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.initPage();
    }
  },
  created() {
    this.initPage();
  }
};
</script>

<style lang="scss" scoped>
.el-icon-finished:hover{
  font-size: 16px;
  cursor: pointer;
  color:#409EFF;
}
.el-icon-finished{
  font-size: 14px;
  cursor: pointer;
}
</style>


