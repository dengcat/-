<template>
  <div class="app-container" v-loading="loading">
    <el-row type="flex" justify="center">
      <el-col :span="24">
          <el-tabs style="min-height:calc(100vh - 130px)" v-model="activeName"  type="border-card">
            <el-tab-pane v-for="item in templateBusinessObjectList" :label="item.name" :key="item.businessObjectGUID" :name="item.name">
              <keep-alive>
                <set-property :mode="mode" v-if="activeName==item.name" :type="item.name" :templateGuid="templateGuid" :businessObject="item" :templateBusinessObject="templateBusinessObjectList" :treedata="item.normDefineRegion" v-on:reload="reload" />
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
      </el-col>
    </el-row>
  <el-row type="flex" justify="center" style="margin-top:10px">
      <el-button type="primary" v-if="mode===0" @click="handleSave(0)">完成</el-button>
      <el-button type="primary" :loading="publishLoading" v-if="mode===0" @click="handleSave(1)">完成并发布</el-button>
      <!-- <el-button type="primary" :loading="unPublishLoading" v-if="mode!==0" @click="handleSave(2)">取消发布</el-button> -->
      <el-button  @click="handleSave(0)">返回</el-button>
  </el-row>
  </div>
</template>

<script>
import setProperty from "./components/SetProperty";
import {
  fetchBusinessObject,
  addTemplate,
  getTemplateBusinessObjectList,
  publishTemplate,
  cancelPublishTemplate,getTemplatesState,
} from "@/api/mdmtemplates";
import { Message } from "element-ui";

const defaultForm = {
  name: undefined,
  remark: undefined,
  businessObjectGUIDs: []
};

export default {
  name: "EditTemplates",
  components: { setProperty },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error(rule.text + "为必填项"));
      } else {
        callback();
      }
    };
    return {
      templateGuid: undefined,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      businessObjects: [],
      activeName: "项目",
      templateBusinessObjectList: [],
      mode:1,
      publishLoading:false,
      unPublishLoading:false
    };
  },
  computed: {},
  created() {
    // this.loading = true;
    // this.templateGuid = this.$route.params.id;
    // getTemplateBusinessObjectList({ id: this.templateGuid }).then(response => {
    //   if (response.data.success) {
    //     this.templateBusinessObjectList = response.data.result;
    //   }
    //   this.loading = false;
    // });
    // getTemplatesState(this.templateGuid).then(response => {
    //   if (response.data.success) {
    //     this.mode = response.data.result;
    //   }
    // });
    this.reload()
  },
  methods: {
    reload(){
      this.loading = true;
      this.templateGuid = this.$route.params.id;
      Promise.all([getTemplateBusinessObjectList({ id: this.templateGuid }).then(response => {
        if (response.data.success) {
          this.templateBusinessObjectList = response.data.result;
        }
        
      }),getTemplatesState(this.templateGuid).then(response => {
        if (response.data.success) {
          this.mode = response.data.result;
        }
      })]).then(
        ()=>{
          this.loading = false;
        }
      )
    },
    handleSave(type){
      if(type && type===1){
        this.publishLoading = true
        publishTemplate({templateGuid:this.templateGuid}).then(
          response => {
            this.$notify({
                title: '发布成功',
                message: '模板发布成功！',
                type: 'success'
              });
            this.publishLoading = false
            this.$router.push('/mdmdefine/index')
          }
        )
      }else if(type && type===2){
        this.unPublishLoading = true
        cancelPublishTemplate({templateGuid:this.templateGuid}).then(
          (response) => {
            this.$message({
              type: 'success',
              message: '取消发布成功!'
              });
            this.unPublishLoading = false
            this.reload()
             
          }
        )
      }
      else{
        this.publishLoading = false
        this.$router.push('/mdmdefine/index')
      }
    }
  }
};
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
