<template>
  <div v-loading="loading">
    <!-- <el-button  style="margin-bottom:10px;  " type="primary" icon="el-icon-edit">新增分区</el-button> -->
    <tree-table :data="data" :eval-func="func" :eval-args="args" :columns="columns" :expand-all="expandAll" >
      <el-table-column label="值类型" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.valueType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统级" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.isSystem | intFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计算公式" width="100">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.formulaConditionText!==undefined && scope.row.formulaConditionText!==null && scope.row.formulaConditionText!=='' " placement="top" effect="light">
            <svg-icon icon-class="fx1" />
             <div slot="content">
              公式：{{scope.row.formulaConditionText}}<br/>
              <template v-if="scope.row.filterRuleText && scope.row.filterRuleText!==''">条件：{{scope.row.filterRuleText}}</template>
             </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="业务线" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceLine }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" minWidth="250">
        <template slot-scope="scope">
          <template v-if="mode===0">
            <el-button v-if="scope.row._level==1" type="text" @click="addoreditGroup(undefined,scope.row)">新增分组</el-button>
            <el-button v-if="scope.row._level==2" type="text" @click="addoreditProperty(undefined,scope.row)">新增指标</el-button>
            <el-button type="text" v-if="scope.row._level==3 && scope.row.canSetPrimary===1" @click="setPrimaryKey(scope.row,true)">设为主键</el-button>
            <el-button type="text" v-if="scope.row._level==3 && scope.row.canCancelPrimary===1" @click="setPrimaryKey(scope.row,false)">取消主键</el-button>
            <!-- <el-button v-if="scope.row._level==3 && (scope.row.valueType=='数值' || scope.row.valueType=='文本')" type="text" @click="setCalc(scope.row)" >设置公式</el-button> -->
            <el-dropdown @command="handleCalcCommand($event,scope.row)" v-if="!scope.row.isSystem && scope.row._level==3 && (scope.row.valueType=='数值' || scope.row.valueType=='文本')">
              <span class="el-dropdown-link">
                <el-button type="text">设置公式</el-button><i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item v-if="scope.row.valueType=='文本'" command="String">文本公式</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.valueType=='数值'" command="default">计算公式</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.valueType=='数值'" command="SUM">汇总公式</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="text" v-if="!scope.row.isSystem && scope.row._level==2" @click="addoreditGroup(scope.row,undefined)">编辑</el-button>
            <el-button type="text" v-if="!scope.row.isSystem && scope.row._level==2" @click="handleDeleteGroup(scope.row)">删除</el-button>
            <el-button type="text" v-if="scope.row._level==3" @click="addoreditProperty(scope.row,undefined)">编辑</el-button>
            
            <el-button type="text" v-if="!scope.row.isSystem && scope.row._level==3" @click="handleDeletePropery(scope.row)">删除</el-button>
            <el-button v-if="scope.row._level==3" type="text" @click="handleNormMoveUp(scope.row)">上移</el-button>
            <el-button v-if="scope.row._level==3" type="text" @click="handleNormMoveDown(scope.row)">下移</el-button>
            <el-button v-if="scope.row._level==2" type="text" @click="handleGroupMoveUp(scope.row)">上移</el-button>
            <el-button v-if="scope.row._level==2" type="text" @click="handleGroupMoveDown(scope.row)">下移</el-button>
          </template>
          <template v-if="mode!==0">
            <el-button type="text" v-if="scope.row._level==2" @click="addoreditGroup(scope.row)">查看</el-button>
            <el-button type="text" v-if="scope.row._level==3" @click="addoreditProperty(scope.row,undefined)">查看</el-button>
          </template>
          
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog  v-el-drag-dialog v-if="propertyVisible" :visible="true" @close="() => {this.propertyVisible = false}" top="5vh" :title="addoredit + '指标'"  @dragDialog="handleDrag">
      <add-property :mode="mode" :editvalue="currEditData" :businessObject="businessObject" :templateGuid="templateGuid" :group="group" @reload="reload" />
    </el-dialog>
    <el-dialog  v-el-drag-dialog v-if="groupVisible" :visible="true" top="5vh" @close="() => {this.groupVisible = false}" :title="addoredit + '分组'"  @dragDialog="handleDrag">
      <add-group :mode="mode" :editvalue="currEditData" :businessObject="businessObject" :templateGuid="templateGuid" @reload="reload" :region="region" />
    </el-dialog>
    <el-dialog  v-el-drag-dialog v-if="calcVisible" :visible="true" @close="() => {this.calcVisible = false}" width="950px" top="5vh" title="设置公式"  @dragDialog="handleDrag">
      <set-calc :calcmode="calcmode" :editvalue="currEditData" :businessObject="businessObject" :templateGuid="templateGuid" :templateBusinessObject="templateBusinessObject" v-on:reload="reload" />
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from './eval'
import AddProperty from './AddProperty'
import AddGroup from './AddGroup'

import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import AddGroupVue from './AddGroup.vue';
import SetCalc from './setCalc.vue';

import {
  deleteGroup,
  deletePropery,
  normMoveUp,
  normMoveDown,
  groupMoveUp,
  groupMoveDown,
  setPrimaryKey,
  cancelPrimaryKey
} from "@/api/mdmtemplates";
import { Message } from "element-ui";



export default {
  components: { treeTable, AddProperty, AddGroup,SetCalc },
  directives: { elDragDialog },
  filters: {
    intFilter(i) {
      const intMap = {
        0: '是',
        1: '否',
        true: '是',
        false: '否'
      }
      return intMap[i]
    }
  },
  props: {
    type: {
      type: String,
      default: '项目',
    },
    treedata: {
      type: Array,
      default: [],
    },
    businessObject:{
      type:Object
    },
    templateBusinessObject:{
      type: Array,
      default: [],
    },
    templateGuid:{
      type: String,
    },
    mode:{
      type:Number
    }
  },
  data() {
    return {
      propertyVisible: false,
      groupVisible: false,
      args: [null, null],
      func: treeToArray,
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false,
      expandAll: true,
      columns: [
        {
          text: '指标名称',
          value:'name',
          minWidth:'250px'
        }
      ],
      data: this.treedata,
      currEditData:'',
      addoredit:'',
      calcVisible:false,
      groupid:'',
      regionId:'',
      calcmode:'',
      group:{}
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    reload(type){
      console.log('type',type)
      switch(type){
        case 'p':
          this.propertyVisible=false
        break;
        case 'g':
          this.groupVisible=false
        break;
        case 'c':
          this.calcVisible=false
        break;
      }
      this.$emit('reload')
    },
    handleDrag() {
      this.$refs.select.blur()
    },
    // getList() {
    //   this.loading = true
    //   this.$emit('create') // for test
    //   fetchList(this.listQuery).then(response => {
    //     this.list = response.data.items
    //     this.loading = false
    //   })
    // }
    addoreditGroup(data,region){
      if(data){
        this.currEditData=data
        this.region = region
        this.addoredit = '修改'
      }
      else{
        this.currEditData=data
        this.region = region
        this.addoredit = '新增'        
      }
      this.groupVisible = true
    },
    addoreditProperty(data,group){
      if(!data){
        this.currEditData=data
        this.group = group
        this.addoredit = '修改'
      } 
      else{
        this.currEditData=data
        this.group = group
        this.addoredit = '新增'
      } 
      this.propertyVisible = true
    },
    setCalc(data){
       this.currEditData=data
       this.calcVisible = true
    },
    handleDeleteGroup(row){
      this.$confirm('此操作将删除该分组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then( () =>{
            deleteGroup({
              templateGuid:this.templateGuid,
              businessObjectGuid:this.businessObject.businessObjectGUID,
              normGroupId:row.id
            }).then(
              (response) => {
                this.$emit('reload')
                Message({
                      message: "删除成功！",
                      type: "info",
                      duration: 5 * 1000
                    });
              }
            )})
            
    },
    handleDeletePropery(row){
      this.$confirm('此操作将删除该指标, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then( ()=>{
      deletePropery({
        templateGuid:this.templateGuid,
        businessObjectGuid:this.businessObject.businessObjectGUID,
        normGroupId:row.groupId,
        normId:row.id
      }).then(
        (response) => {
          this.$emit('reload')
          Message({
                message: "删除成功！",
                type: "info",
                duration: 5 * 1000
              });
        }
      )})
    },
    handleNormMoveUp(row){
      normMoveUp({
        templateGuid:this.templateGuid,
        businessObjectGuid:this.businessObject.businessObjectGUID,
        normGroupId:row.groupId,
        normId:row.id
      }).then(
        (response) => {
          this.$emit('reload')
        }
      )
    },
    handleNormMoveDown(row){
      normMoveDown({
        templateGuid:this.templateGuid,
        businessObjectGuid:this.businessObject.businessObjectGUID,
        normGroupId:row.groupId,
        normId:row.id
      }).then(
        (response) => {
          this.$emit('reload')
        }
      )
    },
    handleGroupMoveUp(row){
      groupMoveUp({
        templateGuid:this.templateGuid,
        businessObjectGuid:this.businessObject.businessObjectGUID,
        normGroupId:row.id,
      }).then(
        (response) => {
          this.$emit('reload')
        }
      )
    },
    handleGroupMoveDown(row){
      groupMoveDown({
        templateGuid:this.templateGuid,
        businessObjectGuid:this.businessObject.businessObjectGUID,
        normGroupId:row.id,        
      }).then(
        (response) => {
          this.$emit('reload')
        }
      )
    },
    handleCalcCommand(command,data) {
      this.currEditData=data
      this.calcmode = command
      this.calcVisible = true
    },
    setPrimaryKey(row,type){
      const postData ={
          templateGuid:this.templateGuid,
          businessObjectGuid:this.businessObject.businessObjectGUID,
          normGroupId:row.groupId,
          normId:row.id
        }
      if(type){
        setPrimaryKey(postData).then(
          response => {
            this.$emit('reload')
          }
        )
      }
      else{
        cancelPrimaryKey(postData).then(
          response => {
            this.$emit('reload')
          }
        )
      }
    }
  },
  watch:{
    treedata:function(curvalue,oldvalue){
      this.data = curvalue
    }
  }
}
</script>

<style scoped>
 .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
    margin-right:10px; 
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
