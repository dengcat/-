<template>
  <div v-loading="pageLoading" class="app-container" style="height: 100%">
    <el-tabs :tab-position="tabPosition"  style=" min-height: 700px">
      <el-tab-pane label="系统参数" >        
        <el-form ref="form" label-position="left" label-width="200px">
          <el-collapse v-model="activeNames" > 
            <el-collapse-item title="邮箱服务" name="2"  >
              <el-form-item v-for="o in sysParamValueList" :key="o.Id" :label="o.paramName" >
                  <el-input v-model="o.value" :type="getInputType(o)" />                
              </el-form-item>              
            </el-collapse-item>
          </el-collapse>
          <el-form-item style="margin-top:20px">
            <el-button type="primary" @click="handleSaveSysParamValue()">保存</el-button>
            <el-button  @click="getList()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="编码规则">
        <el-select v-model="value" @change="handleChangeCodeFormatType(value)">
          <el-option v-for="item in systemCodeFormatType" :key="item.id" :label="item.typeName" :value="item.id"></el-option>     
        </el-select>
        <el-table ref="multipleTable" :data="CodeFormatList" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column label="属性名称"  width="300">
            <template slot-scope="scope">{{ scope.row.fieldNameChn }}</template>
          </el-table-column>
          <el-table-column label="是否参与编码" width="120">
            <template slot-scope="scope"><el-switch v-model="scope.row.ifIncluded" :disabled="scope.row.fieldNameChn=='流水号'"/></template>
          </el-table-column>
          <el-table-column  label="位数" show-overflow-tooltip width="120">
            <template slot-scope="scope" v-if="scope.row.levelLimitRule==1"><el-input v-model="scope.row.levelLimit"/></template>                       
          </el-table-column>
          <el-table-column label="是否参与复位" show-overflow-tooltip width="120">
            <template slot-scope="scope"><el-switch v-model="scope.row.ifRestore" :disabled="scope.row.fieldNameChn=='流水号'"/></template>
          </el-table-column>
          <el-table-column label="实例" show-overflow-tooltip>
            <template slot-scope="scope"><el-input v-model="scope.row.exampleData"/></template>
          </el-table-column>
        </el-table>
        <div style="margin-top:20px">
          <el-button type="primary" @click="handleSaveCodeFormat()">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="产品类型">
        <el-button style="margin: 10px;" type="primary" icon="el-icon-edit" @click="handleAddProduct()">新增一级</el-button>
        <tree-table :data="productdata" :columns="productcolumns" :expand-all="true" border>          
          <el-table-column width="300px" label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row._level!=3" type="text" size="mini"  @click="handleAddProduct(scope.row.id)" >新增子级</el-button>
              <el-button type="text" size="mini" @click="handleEditProduct(scope.row)" >编辑</el-button>
              <el-button type="text" size="mini" @click="handleDeleteProduct(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </tree-table>
      </el-tab-pane>
      <el-tab-pane label="项目版本">
        <el-button style="margin: 10px;" type="primary" icon="el-icon-edit" @click="handleAddEdition()">新增</el-button>
        <el-table :data="mdmEditionSettingList" :expand-all="true" border>
          <el-table-column  label="版本名称">
            <template slot-scope="scope">
              {{scope.row.editionName}}
            </template>
          </el-table-column>
          <el-table-column width="300px" label="是否允许创建多个">
            <template slot-scope="scope">
              {{scope.row.isMultiple===1? '是' : '否'}}
            </template>
          </el-table-column>        
          <el-table-column width="300px" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleEditEdition(scope.row)" >编辑</el-button>
              <el-button type="text" size="mini" @click="handleDeleteEdition(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 业务参数 -->
      <el-tab-pane  v-for="o in paramSettingList" :key="o.Id" :label="o.paramName">
        <list :type="o.paramName" :key="o.Id" :code="o.paramCode"/>
      </el-tab-pane>      
    </el-tabs>
    <!-- 产品类型编辑页面 -->
    <el-dialog :visible.sync="propertyVisible" title="编辑产品类型" width="30%">
      <el-form label-width="80px" :model="productForm" :rules="rules" ref="pform"> 
        <el-form-item label="编码" prop="code" >
          <el-input v-model="productForm.code"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="productForm.name"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleSaveProduct()">保存</el-button>
          <el-button @click="resetForm('pform')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 项目版本编辑页面 -->
    <el-dialog :visible.sync="editionVisible" title="项目版本" width="30%">
      <el-form label-width="100px" :model="editionForm" :rules="rules" ref="eform"> 
        <el-form-item label="版本名称" prop="editionName" >
          <el-input v-model="editionForm.editionName"/>
        </el-form-item>
        <el-form-item label="可创建多个" prop="isMultiple">
          <el-switch
            v-model="editionForm.isMultiple"
            :active-value='1'
            :inactive-value='0'
           >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleSaveEdition()">保存</el-button>
          <el-button @click="() => {resetForm('eform'); this.editionVisible=false;}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import List from './components/list'
import ElFormRenderer from "@/components/ElFormRender/render";
import treeTable from '@/components/TreeTable'
import { getParamSettingList,getSysParamValueList,saveSysParamValueList,getBasicDataTreeByParamCode,saveBasicData,getBasicDataById,deleteBasicData
,getSystemCodeFormatType,getCodeFormatList,saveCodeFormat,getMdmEditionSetting,saveEdition,deleteEdition } from '@/api/mdmsyssetting'
import directiveVue from '../permission/directive.vue';

export default {
  name: 'ReportList',
  directives: {
    waves
  },
  components: { List, treeTable,ElFormRenderer },
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
    var checkProductRule = (rule, value, callback) => {      
        setTimeout(() => { 
          if (!true) {              
            callback(new Error('test'));
          }
          else{
            callback();
          }         
        }, 1000);
      };
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
      rules: {
        code: [
          { required: true, message: '请输入产品类型编码', trigger: 'blur' } ,
          { validator: checkProductRule, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入产品类型名称', trigger: 'blur' },
          { validator: checkProductRule, trigger: 'blur' }  
        ]      
      },
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
      }),
      getSysParamValueList().then(response => {       
        this.sysParamValueList = response.data.result ;             
      }),
      getBasicDataTreeByParamCode('mdm_ProductType').then(response => {       
        this.productdata = response.data.result ; 
      }),
      getSystemCodeFormatType('0302').then(response => {       
        this.systemCodeFormatType = response.data.result ; 
        if(response.data.result && response.data.result[0])  
        this.value=response.data.result[0].id
        getCodeFormatList(response.data.result[0].id).then(response => {      
          this.CodeFormatList = response.data.result  ;  
        })
      }),
      getMdmEditionSetting().then(response => {       
        this.mdmEditionSettingList = response.data.result ; 
      }),
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
