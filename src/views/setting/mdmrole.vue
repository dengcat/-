<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="roleName"
        placeholder="请输入角色名称"
        style="width: 400px;vertical-align: middle;margin-bottom: 10px;"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleFilter"/>
      </el-input>
      <el-button
        style="margin-left: 10px;vertical-align: middle;margin-bottom: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增角色</el-button>
    </div>
    <el-table
      :height="tableHeight"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="roleName" label="角色名称" width="250"/>
      <el-table-column prop="roleDescription" label="说明"/>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10,20,30, 50]"
        :page-size="limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增/编辑角色 -->
    <el-dialog
      v-el-drag-dialog
      :visible="true"
      v-cloak
      v-if="hackAddRole"
      @close="hackAddRole = false"
      :title="addoredit + '角色'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :rules="rules"
        v-loading="formLoading"
        :model="form"
        label-width="80px"
        height="500px;"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="first">
            <el-form-item label="角色名称">
              <el-input v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item label="说明">
              <el-input v-model="form.roleDescription"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="功能权限" name="second">
            <el-tree
              :data="functionright"
              show-checkbox
              node-key="id"
              ref="functionRightTree"
              :default-expanded-keys="defaultFunctionRight"
              :props="functionrightProps"
              style="overflow: auto;height: 363px;"
            ></el-tree>
          </el-tab-pane>
          <el-tab-pane label="数据权限" name="third">
            <el-tree
              :data="dataright"
              show-checkbox
              :check-strictly="true"
              ref="dataRightTree"
              node-key="id"
              :default-expanded-keys="defaultDataRight"
              :props="datarightProps"
              style="overflow: auto;height: 363px;"
            ></el-tree>
          </el-tab-pane>
          <el-tab-pane label="人员信息" name="fourth">
            <div style="margin-bottom:10px">
              <el-input
                v-model="userNameQuery"
                placeholder="请输入账号或者姓名"
                style="width: 200px;vertical-align: middle"
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search" @click="handleUserFilter"/>
              </el-input>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                icon="el-icon-edit"
                @click="handleAddUser"
              >添加人员</el-button>
            </div>
            <el-table :data="userData" style="width: 100%" height="300" border>
              <el-table-column prop="userName" label="姓名"></el-table-column>
              <el-table-column prop="userCode" label="账号" width="180"></el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button @click="handleRemoveUser(scope.row)" type="text" size="small">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-form-item style="margin-top:20px;text-align:right;padding-right:20px;">
          <el-button style="width:100px;" @click="() => this.hackAddRole = false">取消</el-button>
          <el-button
            style="width:100px;"
            type="primary"
            @click="saveRole()"
            :loading="btnSaveRoleLoading"
          >保存</el-button>
        </el-form-item>
      </el-form>
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
      <user-select @updateVale="handleUpdate"></user-select>
    </el-dialog>
  </div>
</template>

<script>
import selectUser from "@/views/setting/pub/selectUserByOrg";
import { Message } from "element-ui";
import elDragDialog from "@/directive/el-dragDialog";
import * as mdmRoleApi from "@/api/mdmrole";
import { deepClone, newGuid } from "@/utils/index.js";
import { arrayTransTree } from "@/utils";
import mixin_commom from "@/utils/mixin_commom";
import UserSelect from '@/components/UserSelect'


const defaultForm = {};

export default {
  name: "MdmRole",
  directives: { elDragDialog },
  components: { selectUser,UserSelect },
  mixins: [mixin_commom],
  data() {
    return {
      form: {
        id: "",
        roleName: "",
        roleDescription: ""
      },
      userNameQuery:null,
      tableData: null,
      importUserVisble: false,
      addoredit: "新增",
      activeName: "first",
      datarightProps: {
        children: "children",
        label: "buName"
      },
      functionrightProps: {
        children: "children",
        label: "name"
      },
      functionright: null,
      dataright: null,
      userData: [],
      userRealData: [],
      total: null,
      listLoading: true,
      limit: 10,
      currentPage: 1,
      roleName: undefined,
      userName: undefined,
      hackAddRole: false,
      hackAddUser: false,
      defaultDataRight: [],
      defaultFunctionRight: [],
      btnSaveRoleLoading: false,
      formLoading: true,
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    rolesListQuery: function() {
      return {
        page: this.currentPage - 1,
        name: this.roleName,
        filter: this.roleName,
        maxResultCount: this.limit,
        skipCount: (this.currentPage - 1) * this.limit,
        sorting: undefined
      };
    },
    tableHeight: function() {
      return this.clientHeight - 220;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      mdmRoleApi.getMdmRoles(this.rolesListQuery).then(response => {
        this.tableData = response.data.result.items;
        this.total = response.data.result.totalCount;
        this.listLoading = false;
      });
    },
    //搜索角色
    handleFilter() {
      this.currentPage = 1;
      this.getList();
    },
    //新增角色
    handleCreate() {
      this.hackAddRole = false; //销毁组件
      this.$nextTick(() => {
        this.hackAddRole = true; //重建组件
      });
      this.formLoading = true;
      //清空用户信息
      this.btnSaveRoleLoading = false;
      this.userData = [];
      this.userRealData = [];
      this.userNameQuery = "";
      this.addoredit = "新增";
      this.activeName = "first";
      this.form = {
        id: "",
        roleName: "",
        roleDescription: ""
      };
      Promise.all([
        //加载数据权限树
        mdmRoleApi.getBusinessUnitsIncludeProj().then(response => {
          this.dataright = response.data.result;
          this.dataright.forEach(m => {
            this.defaultDataRight.push(m.id);
          });
        }),
        //加载功能权限树
        mdmRoleApi.getSystemAppFunctions().then(response => {
          this.functionright = response.data.result;
          this.functionright.forEach(m => {
            this.defaultFunctionRight.push(m.id);
          });
          console.log(this.defaultFunctionRight);
        })
      ]).then(res => {
        this.formLoading = false;
      });
    },
    //编辑角色
    handleEdit(row) {
      this.hackAddRole = false; //销毁组件
      this.$nextTick(() => {
        this.hackAddRole = true; //重建组件
      });
      this.formLoading = true;
      this.form = row;
      this.addoredit = "编辑";
      this.userNameQuery = "";
      this.activeName = "first";
      this.btnSaveRoleLoading = false;

      Promise.all([
        //加载数据权限树
        mdmRoleApi.getBusinessUnitsIncludeProj().then(response => {
          this.dataright = response.data.result;
          this.dataright.forEach(m => {
            this.defaultDataRight.push(m.id);
          });
        }),
        //加载功能权限树
        mdmRoleApi.getSystemAppFunctions().then(response => {
          this.functionright = response.data.result;
          this.functionright.forEach(m => {
            this.defaultFunctionRight.push(m.id);
          });
        }),
        //获取角色权限，默认给组件渲染勾选状态
        mdmRoleApi.getRole(row.id).then(response => {
          if (response.data) {
            var roleInfo = response.data.result;
            this.userRealData = roleInfo.users;
            this.userData = this.userRealData;
            this.$refs.functionRightTree.setCheckedKeys(roleInfo.actions);
            this.$refs.dataRightTree.setCheckedKeys(roleInfo.projects.map(item=> item.id));
          }
        })
      ]).then(res => {
        this.formLoading = false;
      });
    },
    //删除角色
    handleRemove(row) {
      var roleId = row.id;
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          mdmRoleApi.delRole(roleId).then(response => {
            if (response.data.success == true) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
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
    //引入用户
    handleAddUser() {
      this.hackAddUser = false; //销毁组件
      this.$nextTick(() => {
        this.hackAddUser = true; //重建组件
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //保存角色
    saveRole() {
      this.btnSaveRoleLoading = true;
      var datarightlist = [];
      var functionrightlist = [];
      var selectedDataright = this.$refs.dataRightTree.getCheckedNodes(0);
      var selectedFunctionright = this.$refs.functionRightTree.getCheckedNodes(
        0
      );
      //获取选中的数据权限idlist
      selectedDataright.forEach(el => {
        datarightlist.push({
          buName: el.buName,
          id: el.id,
          isCompany: el.isCompany,
          orderCode: el.orderCode,
          orderHierarchyCode: el.orderHierarchyCode,
          parentGuid: el.parentGuid
        });
      });
      //获取选中的功能权限idlist
      selectedFunctionright.forEach(el => {
        functionrightlist.push(el.id);
      });

      //组装提交服务端的数据
      var roleData = {
        roleId: this.form.id ? this.form.id : newGuid(),
        roleName: this.form.roleName,
        roleDescription: this.form.roleDescription,
        actions: functionrightlist,
        projects: datarightlist,
        users: this.userRealData
      };

      //提交服务端
      mdmRoleApi.saveRole(roleData).then(response => {
        if (response.data.success == true) {
          this.$message({
            type: "success",
            message: this.addoredit + "角色成功!"
          });
          this.btnSaveRoleLoading = false;
          this.hackAddRole = false;
        } else {
          this.$message({
            type: "error",
            message: this.addoredit + "角色失败!"
          });
          this.btnSaveRoleLoading = false;
        }
        this.getList();
      }).catch(error=>{
        this.btnSaveRoleLoading = false;
      });
    },
    //添加用户确认取消回调函数
    handleUpdate(val) {
      val.forEach(m => {
        var isAdd = true;
        this.userRealData.forEach(y => {
          if (y.userId == m.userId) {
            isAdd = false;
          }
        });
        if (isAdd) this.userRealData.push(m);
      });
      this.userData = this.userRealData;
      this.hackAddUser = false; //销毁组件
    },
    //移除用户
    handleRemoveUser(row) {
      var index = this.searchIndex(this.userRealData, row);
      this.userRealData.splice(index, 1);
      this.userNameQuery = "";
      this.userData = this.userRealData;
    },
    //用户搜索
    handleUserFilter() {
      this.userData = this.userRealData;
      if (this.userNameQuery) {
        this.userData = this.userData.filter(row => {
          return (
            row.userCode.indexOf(this.userNameQuery) > -1 ||
            row.userName.indexOf(this.userNameQuery) > -1
          );
        });
      }
    },
    //查找对象在数据中的真实索引号
    searchIndex(arr, dst) {
      var i = arr.length;
      while ((i -= 1)) {
        if (arr[i].userId == dst.userId) {
          return i;
        }
      }
      return false;
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
