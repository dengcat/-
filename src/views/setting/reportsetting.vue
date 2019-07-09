<template>
  <div class="app-container">
    <el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreateReportType()">新增报表分类</el-button>
    <tree-table :data="datalist" :columns="columns" :expand-all="true" style="width: 100%; margin-top:20px" border>
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
            <el-button v-if="scope.row.children!=undefind" type="text" @click="handleAddReport(scope.row)">添加报表</el-button>
            <el-button v-if="scope.row.children!=undefind" type="text" @click="handleEditReportType(scope.row)">修改分类</el-button>
            <el-button v-if="scope.row.children!=undefind" type="text" @click="handleDeleteReportType(scope.row)">删除分类</el-button>
            <el-button v-if="scope.row.children==undefind" type="text" @click="handleEditReport(scope.row)">修改报表</el-button>
            <!-- <el-button v-if="scope.row.children==undefind" type="text" @click="edit(scope.row)">设置参数</el-button> -->
            <!-- <el-button v-if="scope.row.children==undefind" type="text" @click="edit(scope.row)">授权</el-button> -->
            <el-button v-if="scope.row.children==undefind" type="text" @click="handleDeleteReport(scope.row)">删除报表</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <!-- 新增报表分类 -->
    <el-dialog v-el-drag-dialog :visible.sync="reportTypeVisible" :title="addoredit + '报表分类'"  @dragDialog="handleDrag">
      <el-form ref="reportclassform" :model="reportclassform" :rules="rules"   label-width="120px">
        <el-form-item label="报表分类名称">
          <el-input v-model="reportclassform.reportClass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveReportClass()">保存</el-button>
          <el-button @click="resetForm('reportclassform')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增报表 -->
    <el-dialog v-el-drag-dialog :visible.sync="reportVisible" :title="addoredit + '报表'"  @dragDialog="handleDrag">
      <el-form ref="reportform" :model="reportform" :rules="rules"   label-width="120px">
        <el-form-item label="报表名称">
          <el-input v-model="reportform.reportName"></el-input>
        </el-form-item>
        <el-form-item label="报表地址">
          <el-input v-model="reportform.reportUrl"></el-input>
        </el-form-item>
        <el-form-item label="报表说明">
          <el-input v-model="reportform.reportRemark"></el-input>
        </el-form-item>
        <el-form-item label="报表参数">
          <el-checkbox-group v-model="reportform.reportParamList">     
            <el-checkbox label="当前用户" ></el-checkbox>
            <el-checkbox label="项目" ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleSaveReport()">保存</el-button>
          <el-button @click="resetForm('reportform')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { Message } from 'element-ui'
import treeTable from '@/components/TreeTable'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { getALLReportList,getReportClassInfo,deleteReportClass,saveReportClass ,saveReport,deleteReport,getReportInfo} from '@/api/mdmreport'

const defaultForm = {}

export default {
  name: 'ReportSetting',
  directives: { waves,elDragDialog },
  components: {
     treeTable
  },
  data() {
    return {
      reportclassform:{},
      reportform:{},      
      columns: [
      {
        text: '报表名称',
        value: 'reportName',
      },
      {
        text: '说明',
        value: 'reportRemark',
      },
      {
        text: '参数',
        value: 'reportParams',
      },
      ],
      cek:['当前用户',''],
      datalist:[],
      reportTypeVisible:false,
      reportVisible:false,
      addoredit:'新增',
      rules: {
        reportClass: [
          { required: true, message: '请输入报表分类', trigger: 'blur' }         ,
        ],
        reportName: [
          { required: true, message: '请输入报表名称', trigger: 'blur' }
        ],
        reportUrl: [
          { required: true, message: '请输入报表地址', trigger: 'blur' }
        ],
         reportRemark: [
          { required: true, message: '请输入报表说明', trigger: 'blur' }
        ],
        reportParams: [
          { required: true, message: '请输入选择报表参数', trigger: 'blur' }
        ]   
      }
    }
  },
  computed: {
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {         
      getALLReportList().then(response => {       
        this.datalist = response.data.result ;        
      })
    },
    handleCreateReportType(){
      this.reportclassform = {
            'id': undefined,     
            'reportClass': ''
      } 
      console.log(this.reportclassform)   
      this.addoredit='新增'
      this.reportTypeVisible = true
    },
    handleEditReportType(row){
       getReportClassInfo(row.id).then(response => {      
        this.reportclassform = response.data.result  ;     
        console.log(this.reportclassform)       
      })  
      this.addoredit='修改'
      this.reportTypeVisible = true
    },
    handleSaveReportClass: function(){
       this.$refs['reportclassform'].validate((valid) => {     
         if (valid) {
          saveReportClass(this.reportclassform).then((response) => {
              this.$message({
                    message: "保存成功！",
                    type: "success",
                    duration: 5 * 1000
                  });          
              this.reportTypeVisible=false;
              this.getList();          
            }
          )}
       });
    },
    handleDeleteReportType(row){
      this.$confirm('删除报表分类将删除分类下所有报表，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteReportClass(row.id).then((response) => {
              this.$message({
                    message: "删除成功！",
                    type: "success",
                    duration: 5 * 1000
                  });          
              this.getList();          
            })
        }).catch(() => {});
    },
    handleAddReport(row){
      this.reportform = {
            'id': undefined,     
            'reportName': '',
            'reportUrl': '',
            'reportParamList': [],
            'reportParams': '',
            'reportRemark': '',
            'reportClassGuid': row.id
      } 
      this.addoredit = '新增'
      this.reportVisible=true
    },
    handleEditReport(row){
      getReportInfo(row.id).then(response => {      
        this.reportform = response.data.result  ;      
        console.log(this.reportform)   
      })  
      this.addoredit = '修改'
      this.reportVisible=true
    },
    handleSaveReport: function(){
      console.log(this.reportform)   
      this.reportform.reportParams =  this.reportform.reportParamList.join(',')
      if  (this.reportform.reportParams=='')
      {
        this.reportform.reportParams=undefined;
      }
       this.$refs['reportform'].validate((valid) => {     
         if (valid) {
          saveReport(this.reportform).then((response) => {
              this.$message({
                    message: "保存成功！",
                    type: "success",
                    duration: 5 * 1000
                  });          
              this.reportVisible=false;
              this.getList();          
            }
          )}
       });
    },
    handleDeleteReport(row){
      this.$confirm('确定删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteReport(row.id).then((response) => {
              this.$message({
                    message: "删除成功！",
                    type: "success",
                    duration: 5 * 1000
                  });          
              this.getList();          
            })
        }).catch(() => {
                   
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.reportTypeVisible=false;
        this.reportVisible=false;
    },
  }
}
</script>
