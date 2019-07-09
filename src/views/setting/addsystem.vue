<template>
  <div class="app-container">
    <el-button
      style="margin-left: 10px;"
      type="primary"
      icon="el-icon-edit"
      @click="handleCreate"
    >新增子系统信息</el-button>
    <el-table :data="tableData" v-loading="listLoading" style="width: 100%;margin-top:20px">
      <el-table-column prop="name" label="系统名称" width="180"/>
      <el-table-column prop="url" label="接口地址"/>
      <el-table-column prop="systemCode" label="系统代码" width="180"/>
      <el-table-column prop="address" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增子系统 -->
    <el-dialog
      v-el-drag-dialog
      :visible.sync="systemVisible"
      :title="addoredit + '子系统'"
      @dragDialog="handleDrag"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="系统名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="系统代码">
          <el-input v-model="form.systemCode"></el-input>
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="接口描述">
          <div style="border:1px solid #ebeef5;">
          <p
            style="color:#777777;line-height: 120%;text-indent: 1em;font-size:9pt;"
          >请填写上面接口地址，接口说明如下：</p>
          <p style="color:#777777;line-height: 120%;text-indent: 1em;font-size:9pt;">接口地址:
            <font style="color:green">http:localhost/GetRoles</font>
          </p>
          <p style="color:#777777;line-height: 120%;text-indent: 1em;font-size:9pt;">返回值:
            <font
              style="color:green"
            >[{"RoleName":"role1","RoleID":"roleid1"},{"RoleName":"role2","RoleID":"roleid2"}]</font>
          </p>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSubSystem()">保存</el-button>
          <el-button @click="() => this.systemVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import * as mdmSubSystem from "@/api/mdmsubsystem";
import { newGuid } from "@/utils/index.js";

const defaultForm = {};

export default {
  name: "AddSystem",
  components: {},
  data() {
    return {
      form: {
        name: "",
        systemCode: "",
        url: ""
      },
      addoredit: "新增",
      systemVisible: false,
      tableData: null,
      listLoading: true,
      apiDescribe:
        '请实现以下Api接口：GetRoles。\r\n接口示例：\r\n接口地址-> http:localhost/GetRoles \r\n返回值:[{"RoleName":"role1","RoleID":"roleid1"},{"RoleName":"role2","RoleID":"roleid2"}]'
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      mdmSubSystem.GetSubSystemList().then(response => {
        this.tableData = response.data.result;
        this.listLoading = false;
      });
    },
    handleCreate() {
      this.addoredit = "新增";
      this.form = {
        name: "",
        systemCode: "",
        url: ""
      };
      this.systemVisible = true;
    },
    handleEdit(row) {
      this.addoredit = "修改";
      this.form.id = row.id;
      this.form.name = row.name;
      this.form.url = row.url;
      this.form.systemCode = row.systemCode;
      this.systemVisible = true;
    },
    handleDelete(row) {
      this.$confirm("确定删除该子系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          mdmSubSystem.RemoveSubSystem(row).then(response => {
            if (response.data.success == true) {
              if (response.data.result.isSuccess == true) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败，失败原因：" + response.data.result.message
                });
              }
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
            this.getList();
          });
        })
        .catch();
    },
    saveSubSystem() {
      var subSystemData = {
        id: this.form.id ? this.form.id : newGuid(),
        name: this.form.name,
        url: this.form.url,
        systemCode: this.form.systemCode
      };
      if (this.addoredit == "新增") {
        mdmSubSystem.AddSubSystem(subSystemData).then(response => {
          if (response.data.success == true) {
            if (response.data.result.isSuccess == true) {
              this.$message({
                type: "success",
                message: this.addoredit + "子系统成功!"
              });
              this.btnSaveRoleLoading = false;
              this.hackAddRole = false;
            } else {
              this.$message({
                type: "error",
                message:
                  this.addoredit +
                  "子系统失败，失败原因：" +
                  response.data.result.message
              });
              this.btnSaveRoleLoading = false;
            }
          } else {
            this.$message({
              type: "error",
              message: this.addoredit + "子系统失败!"
            });
            this.btnSaveRoleLoading = false;
          }
          this.getList();
        });
      } else {
        mdmSubSystem.EditSubSystem(subSystemData).then(response => {
          if (response.data.success == true) {
            if (response.data.result.isSuccess == true) {
              this.$message({
                type: "success",
                message: this.addoredit + "子系统成功!"
              });
              this.btnSaveRoleLoading = false;
              this.hackAddRole = false;
            } else {
              this.$message({
                type: "error",
                message:
                  this.addoredit +
                  "子系统失败，失败原因：" +
                  response.data.result.message
              });
              this.btnSaveRoleLoading = false;
            }
          } else {
            this.$message({
              type: "error",
              message: this.addoredit + "子系统失败!"
            });
            this.btnSaveRoleLoading = false;
          }
          this.getList();
        });
      }
      this.systemVisible = false;
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

  p {
    color: #777777;
    line-height: 120%;
    text-indent: 1em;
    font-size: 9pt;
  }
}
</style>
