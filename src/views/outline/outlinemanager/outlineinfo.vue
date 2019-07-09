<template>
  <!-- <vue-content-loading v-if="pageLoading" :width="300" :height="100">
      <circle cx="30" cy="30" r="30" />
      <rect x="75" y="13" rx="4" ry="4" width="100" height="15" />
      <rect x="75" y="37" rx="4" ry="4" width="50" height="10" />
    </vue-content-loading> -->
  <div
    v-loading="pageLoading"
    class="app-container outline"
  >
  <div v-if="mpiVersionInfo.id">
    <!-- <el-alert
      style="margin-bottom:10px"
      :title="`项目主数据版本：${this.mpiVersionInfo.mdmVersionName}`"
      type="warning"
      description="当前项目主数据不是最新版本"
      show-icon>
    </el-alert> -->
    <div
      v-show="this.mpiVersionInfo.verTip"
      role="alert"
      class="el-alert el-alert--warning is-light"
      style="margin-bottom: 10px;"
    ><i class="el-alert__icon el-icon-warning is-big"></i>
      <div class="el-alert__content">
        <!-- <span class="el-alert__title is-bold">项目主数据版本：{{this.mpiVersionInfo.mdmVersionName}}</span> -->
        <!---->
        <p class="el-alert__description">当前项目主数据不是最新版本!点击<el-button type="text" @click="handReCreate()">获取最新项目数据</el-button>重新创建实施纲要！或者点击<el-button type="text" @click="this.mpiVersionInfo.verTip=false">关闭提示</el-button>隐藏该消息</p>
        <i class="el-alert__closebtn el-icon-close" @click="this.mpiVersionInfo.verTip=false"></i>
      </div>
    </div>

    <div
      v-show="this.mpiVersionInfo.editTip"
      role="alert"
      class="el-alert el-alert--warning is-light"
      style="margin-bottom: 10px;"
    ><i class="el-alert__icon el-icon-warning is-big"></i>
      <div class="el-alert__content">
        <!-- <span class="el-alert__title is-bold">项目主数据版本：{{this.mpiVersionInfo.mdmVersionName}}</span> -->
        <!---->
        <p class="el-alert__description">当前项目主数据存在修订中的版本,是否修订完成后再维护实施纲要？点击<el-button type="text" @click="this.mpiVersionInfo.editTip=false">关闭提示</el-button>隐藏该消息，继续填写！</p>
        <i class="el-alert__closebtn el-icon-close" @click="this.mpiVersionInfo.verTip=false"></i>
      </div>
    </div>
    <el-row>
    <el-col :span = "24">
    <el-tabs
      :value="activeName"
      @tab-click="handleClick"
      @before-leave="tabBeforeLeave"
    >
      <template v-for="step in outline_stepInfo.steps">
        <el-tab-pane
          v-if="step.stepNum > 1"
          :key="step.stepNum"
          :name="step.stepNum | getPanName"
        >
        <span slot="label">{{step.stepName}}
          <el-tooltip v-if="step.stepNum===outline_stepInfo.currentStep.step" effect="light" content="当前步骤" placement="top"><svg-icon icon-class="curr" style="color:#1afa29" /></el-tooltip>
          <el-tooltip v-if="step.stepName==='货值'" effect="light" content="有变化" placement="top"><i class="el-icon-s-flag" style="color:red"></i></el-tooltip>
        </span>
        </el-tab-pane>
      </template>
    </el-tabs>
    </el-col>
    </el-row>
    <outline-step
      :step="step"
      :childrenStep="childrenStep"
      :id="id"
    ></outline-step>

    <el-dialog title="新增实施纲要信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="项目分期名称" label-width="180px">
          <el-input v-model="form.businessDataName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实施纲要版本名称" label-width="180px">
          <el-input v-model="form.version" class="input-with-select">
            <el-tooltip slot="prepend" :content="form.editonName" effect="light">
              <el-select style="min-width:150px" v-model="form.editonName" >
                <el-option label="启动版" value="1"></el-option>
                <el-option label="在建版" value="2"></el-option>
                <el-option label="拿地版" value="3"></el-option>
              </el-select>
            </el-tooltip>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import OutlineStep from "./outlinestep";
import { VueContentLoading } from "vue-content-loading";
import { getMpiOutLineStep } from "@/api/outLineManager";


export default {
  name: "OutlineInfo",
  components: { OutlineStep, VueContentLoading },
  data() {
    return {
      pageLoading: true,
      id: this.$route.params.id,
      step: this.$route.query.step ? parseInt(this.$route.query.step) : 2,
      childrenStep: this.$route.query.childrenstep
        ? parseInt(this.$route.query.childrenstep)
        : 1,
      dialogFormVisible:false,
      form:{
        businessDataName: undefined,
        version: undefined,
        editonName: undefined
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    const step = parseInt(to.query.step);
    this.id = this.$route.params.id;
    this.step = step;
    this.childrenStep = parseInt(to.query.childrenstep)
      ? parseInt(to.query.childrenstep)
      : 1;
    to.meta.title = `${this.mpiVersionInfo.stagesName}(${
      this.mpiVersionInfo.version
    })`;
    next();
  },
  created() {
    this.pageLoading = true;
    // 首次进详情页面，从后台获取数据
    if (!this.mpiVersionInfo.id || this.mpiVersionInfo.id!==this.id) {
      this.SelectOutlineInfo(this.id).then(response => {
        // this.$route.meta.title=`${this.mpiVersionInfo.stagesName}`
        this.pageLoading = false;
        this.$route.meta.title = `${this.mpiVersionInfo.stagesName}(${
          this.mpiVersionInfo.version
        })`;
        var isNew= this.CheckBusinessDataIsNew({stagesId:this.mpiVersionInfo.stagesId,projectVersion:this.mpiVersionInfo.projectVersion});
        this.mpiVersionInfo.verTip=!isNew;
        this.mpiVersionInfo.editTip=!isNew;
      });

      getMpiOutLineStep(this.id).then(response => {
          this.$store.state.outline_stepInfo.steps = response.data.result;
          const currentStep = {step:1, childrenStep:1}
          response.data.result.forEach(element => {
            if(element.stepState === '进行中'){
              currentStep.step = element.stepNum
              if(element.children && element.children.length > 0){
                element.children.forEach(childitem=>{
                  if(childitem.stepState=== '进行中'){
                    currentStep.childrenStep = childitem.stepNum
                  }
                  else{
                    currentStep.childrenStep = 1                    
                  }
                })
              }
            }
          });
          this.$store.state.outline_stepInfo.currentStep = currentStep
        });
    } else {
      this.pageLoading = false;
    }
  },
  filters: {
    getPanName(stepNum) {
      return `${stepNum}`;
    }
  },
  computed: {
    currStep() {
      const step = this.outline_stepInfo.steps.find(
        item => item.stepNum === this.step
      );
      if (step) {
        return step;
      } else {
        return {};
      }
    },
    activeName() {
      return `${this.currStep.stepNum}`;
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiVersionInfo: state => state.outline_info.mpiVersionInfo
    })
  },
  methods: {
    ...mapActions(["outline_stepInfo_UpdateStepInfo", "SelectOutlineInfo","CheckBusinessDataIsNew"]),
    handleClick(tab, event) {
      this.$router.push(
        `/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${
          tab.name
        }&childrenstep=1`
      );
    },
    tabBeforeLeave() {
      return false;
    },
    handReCreate(){
      // 获取该分期的最新主数据版本
      this.form.businessDataName = this.mpiVersionInfo.businessDataName
      this.form.version='',
      this.form.editonName=''
      this.dialogFormVisible = true
    },
    handleConfirm(){
      // 更新当前实施纲要的项目主数据为最新版本，重新生成数据
      this.pageLoading = true
      // todo
      this.pageLoading = false
      this.dialogFormVisible = false
    }
  }
};
</script>

<style scoped>
.circle {
    width: 20px;
    height: 20px;
    border-radius:50%;
    font-size:14px;
    color:rgba(252, 251, 250, 0);
    line-height: 20px;
    text-align: center;
    background: rgb(206, 46, 25);
  }
</style>

<style lang="scss">
.outline {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background-color: #f0f2f5;
  .el-input--mini .el-input__inner {
    //height: 23px;
    //line-height: 23px;
    margin: 0px 0px;
  }
  .el-table--mini td,
  .el-table--mini th {
    padding: 3px 0;
  }
  // .el-input--mini .el-input__icon {
  //   line-height: 23px;
  // }
  .el-input.is-disabled .el-input__inner {
    //background-color: #F5F7FA;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: unset;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
  .editform {
    .el-input.is-disabled .el-input__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
    }
    .el-textarea.is-disabled .el-textarea__inner {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
    }
  }
  .el-tabs--top {
    background-color: white;
    padding: 1px 10px;
  }
}
</style>
