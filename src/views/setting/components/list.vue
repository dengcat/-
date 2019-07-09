<template>
  <div>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAddParam()">新增</el-button>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%;margin-top:20px">
      <el-table-column v-for="(o,$index) in tableThead" :key="$index" :label="o.label">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="mini"  @click="handleEditParam(scope.row)">编辑</el-button>
          <el-button type="text" size="mini"  @click="handleDelteParam(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-el-drag-dialog :visible.sync="propertyVisible" :title="`新增`+type" width="30%" @dragDialog="handleDrag">
      <el-form label-width="80px" :model="form"  :rules="rules" ref="pform" >
        <el-form-item :label="'选项'" prop="text">
          <el-input v-model="form.text"/>
        </el-form-item>
        <el-form-item :label="'选项值'" prop="value">
          <el-input v-model="form.value"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleSaveParam();">保存</el-button>
          <el-button @click="resetForm('pform')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getParamValueList,deleteParamValue,getParamValueInfo,saveParamValue } from '@/api/mdmsyssetting'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

export default {
  name: 'List',
  directives: {
    waves,
    elDragDialog
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info',
        2: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  props: {
    type: String,
    code: String
  },
  data() {
    const tableData = []
    const tableThead = []
    tableThead.push({ key: this.code, label: this.type })        
    return {
      tableData,
      tableThead,
      propertyVisible: false,
      form:{},
      rules: {
        text: [
          { required: true, message: '请输入选项', trigger: 'blur' }         
        ],
        value: [
          { required: true, message: '请输入选项编码', trigger: 'blur' }
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
      getParamValueList(this.code).then(response => {       
        this.tableData = response.data.result    
      })
    },
    handleDrag() {
      this.$refs.select.blur()
    },    
    handleAddParam: function(){
      this.form = {
            'id': undefined,
            'paramCode': this.code,
            'paramName': this.type,
            'text': '',
            'value': ''
      } 
      this.propertyVisible=true;   
    },
    handleEditParam: function(row){
       getParamValueInfo(row.id).then(response => {      
        this.form = response.data.result  ;         
      })  
      this.propertyVisible=true;       
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.propertyVisible=false;
    },
    handleSaveParam: function(){
       this.$refs['pform'].validate((valid) => {     
         if (valid) {
          saveParamValue(this.form).then((response) => {
              this.$message({
                    message: "保存成功！",
                    type: "success",
                    duration: 5 * 1000
                  });          
              this.propertyVisible=false;
              this.getList();          
            }
          )}
       });
    },
    handleDelteParam: function(row){
      deleteParamValue(row.id).then(
        (response) => {
          this.$message({
                message: "删除成功！",
                type: "success",
                duration: 5 * 1000
              });
          this.getList()
        }
      )
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
  .collapse {
    margin-top: 20px;
  }
</style>
