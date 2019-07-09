<template>
  <div class="fileuploaddiv">
    <el-upload
      class="fileupload"
      drag
      action=""
      multiple
      :show-file-list="false"
      :http-request="uploadHttpRequest"
      :on-success="uploadSuccess"
      :on-progress="uploadProgress"
      :on-change="uploadChange"
      :file-list="componentFileList"
      :disabled ="isDisabled"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <ul class="el-upload-list el-upload-list--picture">
      <!-- <li v-for="fileitem in fileList" :key="fileitem.documentGuid" class="el-upload-list__item is-success">
          <div class="el-upload-list__item-thumbnail"><svg-icon  icon-class="wj" /></div>
          <a class="el-upload-list__item-name">
            <i class="el-icon-document"></i>{{fileitem.name}}
          </a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <i class="el-icon-close"></i>
          <i class="el-icon-close-tip">按 delete 键可删除</i>  
      </li> -->
      <li v-for="fileitem in componentFileList" :key="fileitem.documentGuid" class="el-upload-list__item is-success">
        <template v-if="!fileitem.status || fileitem.status==='success'">
          <div class="el-upload-list__item-thumbnail"><svg-icon :icon-class="fileitem.name | fileTypeFilter" /></div>
          <a class="el-upload-list__item-name">
            <!-- <i class="el-icon-document"></i> -->
            <!-- <i :class="fileitem.name | fileTypeFilter"></i> -->
            <el-tooltip :content="fileitem.name" placement="top-start" effect="light">
            <a target="_blank" :href="`${BASE_API}api/services/app/fileManager/Download?documentGuid=${fileitem.id}`">
              <span style="color:#606266;font-size:12px">{{fileitem.name}}</span>
            </a>
            </el-tooltip>
          </a>
          <!-- <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label> -->
          <i class="el-icon-close" v-if="!isDisabled" @click="deleteFile(fileitem)"></i>
          <i class="el-icon-close-tip">按 delete 键可删除</i>
        </template>
        <template v-else>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="fileitem.percentage"></el-progress>
        </template>    
      </li>
    </ul>
  </div>
</template>

<script>

import { upload } from "@/api/mdmmanager";
import { newGuid } from "@/utils/index.js";


export default {
  name: "Upload",
  components: {
  },
  model: {
    prop: 'fileList',
    event: 'updateFileList'
  },
  filters: {
    fileTypeFilter(filename){
      const type = filename.split('.').pop()
      switch(type.toLowerCase()){
        case 'xls'.toLowerCase():
        case 'xlsx'.toLowerCase():
        case 'xlsm'.toLowerCase():
          return 'excel_icon'
          break;
        case 'doc'.toLowerCase():
        case 'docx'.toLowerCase():
          return 'doc'
        break;
        case 'rar'.toLowerCase():
        case 'zip'.toLowerCase():
          return 'zip'
        break;
        case 'pdf'.toLowerCase():
          return 'pdf'
        break;
        default:
          return 'wj'

      }
    }
  },
  props: Object.assign({}, {
    fileList: {
      type: Array,
      required: true
    },
    isDisabled:{}
  }),
  data() {
    let tempList = []
    tempList = tempList.concat(this.fileList)
    return {
      componentFileList:tempList,
      BASE_API:process.env.BASE_API,
    }
  },
  computed: {
  },
  watch: {
    
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadSuccess(response, file, fileList){
      file.id=response.Id
      // this.savedata['相关文档'].push({"name":file.name,"documentGuid":this.newGuid()})
      console.log('sucess',response,file,fileList)
    },
    uploadProgress(event, file, fileList){
      console.log('Progress',event,file,fileList)
    },
    beforeUpload(file){
      console.log('beforeUpload',file)
    },
    uploadHttpRequest(file){
      let formData = new FormData()
      formData.append('file', file.file)
      formData.append('name', newGuid())
      formData.append('chunk', 0)
      formData.append('chunks', 1)
      formData.append('filename', file.file.name)
      formData.append('filesize', file.file.size)
      upload(formData,file).then(
        (response) => {
          const result = JSON.parse(response.data.result)
          file.onSuccess(result)
        }
      ).catch(
        err => {
          file.onError(err)
        }
      )
    },
    uploadChange(file, fileList){
      this.componentFileList = fileList
      this.$emit('updateFileList',this.componentFileList)
    },
    deleteFile(file){
      this.componentFileList=this.componentFileList.filter(item=>item!==file)
      this.$emit('updateFileList',this.componentFileList)
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fileuploaddiv {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  // justify-content:center;
}
.formitem {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: calc(50% - 40px);
}
.formitemoneline {
  align-items: flex-start;
  width: calc(100% - 40px);
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 100%;
}
.cell-icon {
  cursor: pointer;
  color: #fff;
}
.el-row {
  margin-bottom: 5px;
}
.formiteminline {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  // justify-content:center;
  align-items: flex-start;
}
.fixButton {
  right: 0px;
  left: 0px;
  position: fixed;
  bottom: 0;
  background: #fff;
  z-index: 300;
  height: 47px;
  margin-top: 10px;
  padding-top: 18px;
  border: 0;
  border-top: solid 1px #e9ebee;
}
.fileupload {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  // justify-content:center;
  margin-left: 0px;
  margin-right: 20px;
}
.el-upload-list--picture .el-upload-list__item {
  // overflow: hidden;
  z-index: 0;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 5px;
  margin-left: 5px;
  padding: 0px 10px 0px 10px;
  height: 28px;
  width:200px;
  float: left;
}
.el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name{
  line-height:28px;
  margin-top: 0;
  margin-right: 20px;
}
.el-upload-list--picture .el-upload-list__item-thumbnail{
  vertical-align: middle;
  text-align: left;
  display: inline-block;
  width: 20px;
  height: 70px;
  float: left;
  position: relative;
  z-index: 1;
  margin-left: 0px;
  line-height: 28px;
}
.el-upload-list{
  width:calc(100% - 400px)
}
.error_span{
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      left: 0;
    }
.el-upload-list--picture .el-progress {
    position: relative;
    top: 4px;
}
</style>
