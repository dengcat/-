<template>
  <div class="app-container" v-loading="pageLoading">
    <tree-table :columns="column" :data="busData" :expand-all="true" style="height:100%;width: 100%; margin-top:10px" border>
      <el-table-column :key="i" label="是否邮件通知" width="200">
        <template slot-scope="scope">
          {{scope.row.isEnable===1?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="handSetEnable(scope.row)">{{scope.row.isEnable===1?'禁用':'启用'}}</el-button>
          <el-button type="text" @click="handleSet(scope.row)">设置收件人</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog  v-el-drag-dialog v-if="groupVisible" :visible="true" top="5vh" @close="() => {this.groupVisible = false}" title="设置收件人"  @dragDialog="handleDrag">
       <div style="margin-bottom:10px">
          <el-input
            v-model="userNameQuery"
            placeholder="请输入姓名或者邮箱"
            style="width: 200px;vertical-align: middle"
            class="input-with-select"
            @keyup.enter.native="handleSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"/>
          </el-input>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleAddUser"
          >添加人员</el-button>
        </div>
        <el-table v-loading="userlistloading" :data="displayMailUserList" style="width: 100%" height="300" border>
          <el-table-column prop="receiverName" label="姓名"></el-table-column>
          <el-table-column prop="emailAddress" label="邮箱地址" width="180"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="handleRemoveUser(scope.row,scope.$index)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="widht:100%;margin: 10px auto;text-align: center;">
          <el-button
            class="filter-item"
            type="primary"
            @click="handleSave()"
          >保存</el-button>
          <el-button
            class="filter-item"
            type="info"
          >取消</el-button>
        </div>
        
    </el-dialog>
    <el-dialog
      :visible="true"
      v-cloak
      v-if="hackAddUser"
      @close="hackAddUser = false"
      title="添加人员"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- <select-user @updateVale="handleUpdate"></select-user> -->
      <user-select @updateVale="handleUpdate"></user-select>
    </el-dialog>
  </div>
</template>

<script>
// import selectUser from "@/views/setting/pub/selectUserByOrg";
import { Message } from 'element-ui'
import treeTable from '@/components/TreeTable'
import UserSelect from '@/components/UserSelect'
import { getBusinessUnitsIncludeProj,enable,disable,getImportedUser,addNotificationManage } from '@/api/mdmmall'
import { getMailUserList } from '@/api/basicdata'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import {arrayTransTree} from '@/utils'

const defaultForm = {

}

export default {
  name: 'MailSetting',
  components: {
    treeTable,UserSelect
  },
  directives: { elDragDialog },
  data() {
    return {
      busData: [],
      column: [{
        text: '项目',
        value: 'buName',
      },
      ],
      pageLoading:true,
      groupVisible:false,
      hackAddUser:false,
      mailUserList:[],
      userNameQuery:'',
      currbusinessDataGUID:undefined,
      userlistloading:false,
      displayMailUserList:[]
    }
  },
  computed: {
  },
  created(){
    this.initPage()
  },
  methods: {
    initPage(){
      // 页面初始化
      getBusinessUnitsIncludeProj().then(
        response => {
          this.busData = arrayTransTree(response.data.result,'parentGuid','id')
          this.pageLoading = false
        }
      )
    },
    handleSearch(){
      if(this.userNameQuery && this.userNameQuery!==''){
        this.displayMailUserList = this.mailUserList.filter(element => {
          if((element.receiverName && element.receiverName.indexOf(this.userNameQuery)>=0) || (element.emailAddress && element.emailAddress.indexOf(this.userNameQuery)>=0)){
            return true
          }
          else{
            return false
          }
        });
      }
      else{
        this.displayMailUserList = this.mailUserList
      }
    },
    handleDelete(){
      this.groupVisible = true
    },
    handleDrag() {
      this.$refs.select.blur()
    },
    handleSet(row){
      this.currbusinessDataGUID = row.id
      this.groupVisible = true
      this.$nextTick(function(){
        this.initUserList()
      })
    },
    initUserList(){
      this.userlistloading = true
      // 获取收件人
      getImportedUser(this.currbusinessDataGUID).then(
        response => {
          this.mailUserList = response.data.result
          this.displayMailUserList = response.data.result
          this.userlistloading = false
        }
      )   
    },
    handleAddUser(){
      this.hackAddUser = true
    },
    //添加用户确认取消回调函数
    handleUpdate(val) {    
      const userTemp = val.filter(
        item => {
          const isExist = this.mailUserList.find(mitem => mitem.importedUserId === item.userId)
          if(!isExist){
            return true
          }
          else{
            return false
          }
        }
      )
      this.mailUserList = this.mailUserList.concat(userTemp.map(item=>{return {
        businessDataGUID:this.currbusinessDataGUID,
        receiverName:item.userName,
        emailAddress:item.emailAddress,
        importedUserId:item.userId
      }}));
      this.displayMailUserList = this.mailUserList
      this.hackAddUser = false; 
    },
    handSetEnable(row){
      this.pageLoading = true
      if(row.isEnable===1){
        disable(row.id).then(
          response => {
            this.initPage()
          }
        )
      }else{
        enable(row.id).then(
          response => {
            this.initPage()
          }
        )
      }
    },
    handleSave(){
      addNotificationManage(this.mailUserList).then(
        response =>{
          this.$message({
                  type: "success",
                  message: "设置成功!"
                });
          this.groupVisible = false
        }
      )
    },
    handleRemoveUser(row,index){
      this.mailUserList.splice(index,1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
