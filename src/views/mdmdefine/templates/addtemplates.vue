<template>
  <div class="app-container">
    <el-form v-loading="loading" ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div v-if="active==0">

          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item style="margin-top: 40px;" label-width="80px" label="模板名称:" prop="name">
                <!-- <el-input v-model="postForm.name" type="text" class="customer-input" autosize placeholder="请输入模板名称"/> -->
                <el-input v-model="postForm.name" type="text" placeholder="请输入模板名称"/>              
              </el-form-item>
            </el-col>

          </el-row>
          

          <el-row type="flex" justify="center" align-items="center">
            <el-col :span="12">
              <el-form-item style="margin-top: 10px;" label-width="80px" label="设置对象:" prop="title">
                <treeselect v-if="businessObjects"
                  :multiple="true"
                  :options="businessObjects"
                  :flat="true"
                  sort-value-by="LEVEL"
                  :default-expand-level="3"
                  placeholder="请选择对象"
                  v-model="postForm.businessObjectGUIDs"
                  :normalizer="normalizer"
                  />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-form-item style="margin-top: 10px;" label-width="80px" label="说明:" prop="remark">
                <!-- <el-input :rows="1" v-model="postForm.remark" type="textarea" class="customer-input" autosize placeholder="请输入说明"/> -->
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入说明"
                  v-model="postForm.remark">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row type="flex" justify="center">
          <el-form-item style="margin-top: 40px;">
            <!-- <el-button v-if="active>0 && active<2" @click="pre">上一步</el-button>
            <el-button v-if="active<1" :loading="loading" type="primary" @click="next">下一步</el-button> -->
             <el-button :loading="loading" type="primary" @click="handleSave()">保存</el-button>
            <!-- <el-button v-if="active==2" type="primary" >完成</el-button> -->
          </el-form-item>
        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>
import setProperty from "./components/SetProperty";
import Treeselect,{ASYNC_SEARCH } from '@riophae/vue-treeselect'

import {
  fetchBusinessObject,
  addTemplate,
  getTemplateBusinessObjectList
} from "@/api/mdmtemplates";
import { Message } from "element-ui";

const defaultForm = {
  name: undefined,
  remark: undefined,
  businessObjectGUIDs: ['4e947176-a557-42d1-8acf-dea5bec1d15a']
};

export default {
  name: "AddTemplates",
  components: { setProperty,Treeselect },
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
      userListOptions: [],
      rules: {
        name: [{ validator: validateRequire, text: "模板名称",trigger: 'blur' }]
      },
      active: 0, // 步骤条
      businessObjects: undefined,
      activeName: "项目",
      templateBusinessObjectList: [],
      templatesobject: "项目"
    };
  },
  computed: {},
  created() {
    this.loading = true;
    fetchBusinessObject({}).then(response => {     
      this.businessObjects = response.data.result;
      this.businessObjects[0].isDisabled=true
      this.loading = false;      
    });
  },
  methods: {
    handleSave(){
      this.$refs["postForm"].validate(valid => {
        if (valid) {
            if (
              this.postForm.businessObjectGUIDs == undefined ||
              this.postForm.businessObjectGUIDs.length == 0
            ) {
              Message({
                message: "请至少选择一个对象！",
                type: "info",
                duration: 5 * 1000
              });
              return false;
            }
            this.addTemplate();
        }
        return false;
      });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
    },
    next() {
      this.$refs["postForm"].validate(valid => {
        if (valid) {
          if (this.active == 1) {
            if (
              this.postForm.businessObjectGUIDs == undefined ||
              this.postForm.businessObjectGUIDs.length == 0
            ) {
              Message({
                message: "请至少选择一个对象！",
                type: "info",
                duration: 5 * 1000
              });
              return false;
            }
            this.addTemplate();
          } else {
            if (this.active++ > 2) this.active = 0;
          }
        }
        return false;
      });
    },
    pre() {
      if (this.active-- < 0) this.active = 0;
      this.loading = false;
    },
    setChecked(row, node, curnode) {
      this.postForm.businessObjectGUIDs = this.$refs.tree.getCheckedKeys();
    },
    addTemplate() {
      this.loading = true;
      addTemplate(this.postForm)
        .then(response => {
          if (response.data.success) {
            this.templateGuid = response.data.result;
            this.$notify({
              title: "保存成功",
              message: "新增模板成功",
              type: "success",
              duration: 2000
            });
            this.loading = false;
            // if (this.active++ > 2) this.active = 0;
            // getTemplateBusinessObjectList({ id: this.templateGuid }).then(
            //   response => {
            //     if (response.data.success) {
            //       this.templateBusinessObjectList = response.data.result;
            //     }
            //   }
            // );
            this.$router.push(`/mdmdefine/edittemplates/${this.templateGuid}`)
          } else {
            this.$notify({
              title: "保存失败",
              message: response.data.error.message,
              type: "error",
              duration: 2000
            });
            this.loading = false;
          }
        })
        .catch(response => {
          this.loading = false;
        });
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
.vue-treeselect {
    position: relative;
    text-align: left;
    line-height: 14px;
  }

</style>
<style lang="scss">
  .createPost-main-container {
    .el-form-item.is-success .el-input__inner {
      border-color:#dcdfe6
    }
  }

</style>

