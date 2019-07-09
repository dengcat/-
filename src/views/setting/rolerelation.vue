<template>
  <div class="app-container" style="height:calc(100vh - 84px)">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane v-for="(i,index) in subSystemList" :label="i.name"></el-tab-pane> -->
      <el-tab-pane
        :index="item.subsystem.id"
        v-for="(item,index) in subSystemList"
        :key="index"
        :name="item.subsystem.systemCode"
        :label="item.subsystem.name"
        v-loading="paneLoading"
      >
        <div style="margin-top: 20px;min-height:calc(100vh - 210px)">
          <el-checkbox
            v-for="(role,i) in rolesList"
            :key="i"
            :label="role.roleGuid"
            :checked="role.isChecked"
            v-model="role.isChecked"
            @change="selecteChange(role)"
            border
          >{{role.roleName}}</el-checkbox>
        </div>
        <el-button type="primary" @click="SaveSubSystemRole()">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { Message } from "element-ui";
import * as mdmSubSystem from "@/api/mdmsubsystem";

const defaultForm = {};

export default {
  name: "RoleRelation",
  components: {},
  data() {
    return {
      buGuid: null,
      activeName: "",
      subSystemList: null,
      rolesList: null,
      SelectedRoles: null,
      paneLoading: true
    };
  },
  computed: {},
  created() {
    this.getSubSystemList();
  },
  methods: {
    getSubSystemList() {
      this.buGuid = this.$route.query.id;
      var tabs = null;
      mdmSubSystem.GetSubSystemRoleList(this.buGuid).then(response => {
        tabs = response.data.result;
        this.SelectedRoles = response.data.result;
        this.activeName = tabs[0].subsystem.systemCode;
        this.subSystemList = tabs;
        this.GetAllRolesList(this.activeName);
      });
    },
    GetAllRolesList(subSystemCode) {
      //根据子系统code获取子系统对应的角色
      mdmSubSystem
        .GetRolesListBySysCode(subSystemCode, this.buGuid)
        .then(response => {
          this.rolesList = response.data.result;
          this.paneLoading = false;
        });
    },
    handleClick(tab, event) {
      var subSystemCode = tab.name;
      this.rolesList = [];
      this.paneLoading = true;
      //根据子系统code获取子系统对应的角色
      mdmSubSystem
        .GetRolesListBySysCode(subSystemCode, this.buGuid)
        .then(response => {
          this.rolesList = response.data.result;
          this.paneLoading = false;
        });
    },
    selecteChange(role) {
      console.log(this.activeName);
      console.log(this.SelectedRoles);
      var selectedRole = this.SelectedRoles.filter(item => {
        return item.subsystem.systemCode == this.activeName;
      });

      console.log(selectedRole);

      if (role.isChecked) {
        selectedRole[0].roleList.push(role.roleGuid);
      }
      console.log(this.SelectedRoles);
    },
    SaveSubSystemRole() {
      console.log(1);
      var SelectedData = {
        data: this.SelectedRoles,
        bUGUID: this.buGuid
      };
      mdmSubSystem
        .SaveSubSystemRole(SelectedData)
        .then(response => {
          if (response.data.success == true) {
            if (response.data.result.isSuccess == true) {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
            } else {
              this.$message({
                type: "error",
                message: "保存失败，失败原因：" + response.data.result.message
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "保存失败!"
            });
          }
        })
        .catch();
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
