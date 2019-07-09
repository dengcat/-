<template>
  <div v-loading="pageLoading" class="app-container" style="height: 100%">
    <el-tabs :tab-position="tabPosition"  style=" min-height: 700px">
      <!-- 业务参数 -->
      <el-tab-pane  v-for="o in paramSettingList" :key="o.Id" :label="o.paramName">
        <list :type="o.paramName" :key="o.Id" :code="o.paramCode"/>
      </el-tab-pane>      
    </el-tabs>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令

import List from './components/list'
import { getParamSettingList,getSysParamValueList,saveSysParamValueList } from '@/api/outLineManager'

export default {
  name: 'MpiParamValue',
  directives: {
    waves
  },
  components: { List },
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
  data() {
    return {
      pageLoading:true,
      tabPosition: 'left',         
      paramSettingList: [],
      sysParamValueList: [],
      systemCodeFormatType: [],
      activeNames: ['1', '2'],
      propertyVisible:false,
      productForm:[],
      mdmEditionSettingList:[],
      value: undefined,
      productcolumns: [ { text: '产品类型', value: 'name' } ],
      productdata: [],
      CodeFormatList: [],
      editionVisible:false,
      editionForm:{
        id:undefined,
        editionName:undefined,
        isMultiple:0
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {    
    getList() {
      Promise.all([getParamSettingList(4).then(response => {       
        this.paramSettingList = response.data.result ; 
      })
      ]).then(
        response => {
          this.pageLoading = false
        }
      )     
      
    },
    handleSaveSysParamValue() {
      saveSysParamValueList(this.sysParamValueList).then((response) => {
          this.$message({
                message: "保存成功！",
                type: "success",
                duration: 5 * 1000
              });          
          this.getList();          
        }
      )
    }, 
    handleAddProduct: function(parent){
      this.productForm = {
            'id': undefined,
            'name': '',
            'code': '',
            'paramCode': 'mdm_ProductType',
            'paramName': '产品类型',
            'parentGuid': parent      
      } 
      this.propertyVisible=true;   
    },
    handleEditProduct: function(row){
       getBasicDataById(row.id).then(response => {      
        this.productForm = response.data.result  ;       
      })  
      this.propertyVisible=true;       
    },
    handleSaveProduct() {
       this.$refs['pform'].validate((valid) => {     
         if (valid) {
            saveBasicData(this.productForm).then((response) => {
                this.$message({
                      message: "保存成功！",
                      type: "success",
                      duration: 5 * 1000
                    }); 
                this.propertyVisible = false;         
                this.getList();          
              }
            )
        }
       });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.propertyVisible=false;
    },
    handleDeleteProduct: function(row){
      this.$confirm('此操作将删除该产品类型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(
            ()=>{
               deleteBasicData(row.id).then((response) => {
                  this.$message({
                        message: "删除成功！",
                        type: "success",
                        duration: 5 * 1000
                      });
                  this.getList();
                }
              )
            }
          )
    },
    handleChangeCodeFormatType:function(type){
      getCodeFormatList(type).then(response => {      
        this.CodeFormatList = response.data.result  ;  
      }) 
    },
    handleSaveCodeFormat:function(){         
       saveCodeFormat(this.CodeFormatList).then((response) => {
          this.$message({
                message: "保存成功！",
                type: "success",
                duration: 5 * 1000
              });          
          this.getList();          
        }
      )
    },
    getInputType: function(o)
    {
      if (o.paramName.indexOf("密码")>0)
        return 'password';
      else 
        return '';
    },
    handleAddEdition: function(){
      this.editionForm = {
        id:undefined,
        editionName:undefined,
        isMultiple:undefined
      }
      this.editionVisible = true
    },
    handleSaveEdition: function(){
      saveEdition(this.editionForm).then(
        response => {
          getMdmEditionSetting().then(response => {       
            this.mdmEditionSettingList = response.data.result ; 
          })
          this.editionVisible = false
        }
      )
    },
    handleEditEdition: function(data){
      let {id,editionName,isMultiple} = data
      this.editionForm = {id,editionName,isMultiple}
      this.editionVisible = true
    },
    handleDeleteEdition:function(data){
      deleteEdition(data.id).then(
        response => {
          getMdmEditionSetting().then(response => {       
            this.mdmEditionSettingList = response.data.result ; 
          })
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
