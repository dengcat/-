<template>
  <div class="app-container outline">
    <div class="formitemdiv">
      <div style="width:100%" class="tip">
        <p>请严格按图示顺序填写。</p>
      </div>
      <div
        v-for="i in Math.ceil(steps.length/rowColNum)"
        :key="i"
        style="width:100%;"
        :class="(i%2===0)? 'flex-direction-row-reverse':'flex-direction-row' "
      >
        <div
          v-for="s in rowColNum"
          :key="s"
          :class="(s%rowColNum===0)? 'flex-direction-column':'flex-direction-row' "
        >
          <div v-if="((i-1)*rowColNum+s)<=steps.length && (i%2!==0 || s===rowColNum)">
            <el-button
              @click="handleClick(steps[(i-1)*rowColNum+s-1])"
              size="medium"
              round
              :type="steps[(i-1)*rowColNum+s-1].stepState | typeFilter"
              style="width:140px;height:50px"
            >
              {{steps[(i-1)*rowColNum+s-1].stepName}}
              <svg-icon
                v-if="steps[(i-1)*rowColNum+s-1].stepState==='进行中'"
                icon-class="editting"
                class="el-icon--right"
              />
              <svg-icon
                v-else-if="steps[(i-1)*rowColNum+s-1].stepState==='已完成'"
                icon-class="end"
                class="el-icon--right"
              />
            </el-button>
          </div>
          <div
            style="color:#606266"
            v-if="i%2!==0 && s!=rowColNum && ((i-1)*rowColNum+s)<steps.length"
          >
            <svg-icon icon-class="a_r" style="width:100px;height:50px"/>
          </div>
          <div
            v-if="s===rowColNum && ((i-1)*rowColNum+s)<=steps.length"
            style="width:140px;height:50px;margin-top:10px;margin-bottom:10px;color:#606266"
          >
            <svg-icon icon-class="a_d" style="width:140px;height:50px;color:"/>
          </div>
          <div
            style="color:#606266"
            v-if="i%2===0 && s!=rowColNum && ((i-1)*rowColNum+s)<steps.length"
          >
            <svg-icon icon-class="a_l" style="width:100px;height:50px"/>
          </div>

          <div v-if="((i-1)*rowColNum+s)<=steps.length && (i%2===0 && s!==rowColNum)">
            <el-button
              @click="handleClick(steps[(i-1)*rowColNum+s-1])"
              size="medium"
              round
              :type="steps[(i-1)*rowColNum+s-1].stepState | typeFilter"
              style="width:140px;height:50px"
            >
              {{steps[(i-1)*rowColNum+s-1].stepName}}
              <svg-icon
                v-if="steps[(i-1)*rowColNum+s-1].stepState==='进行中'"
                icon-class="editting"
                class="el-icon--right"
              />
              <svg-icon
                v-else-if="steps[(i-1)*rowColNum+s-1].stepState==='已完成'"
                icon-class="end"
                class="el-icon--right"
              />
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { getMpiOutLineStep } from "@/api/outLineManager";
export default {
  name: "Outline",
  data() {
    const id = this.$route.query.id;
    return {
      rowColNum: 5,
      id
    };
  },
  created() {
     if (this.id) {
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
     }
     else{
this.$store.state.outline_stepInfo.steps =[
      {
        stepNum: 1, // 步骤序号
        stepName: '版本选择', // 步骤名称
        stepState: '进行中', // 已完成，进行中，未开始
      },
      {
        stepNum: 2, // 步骤序号
        stepName: '项目基本信息', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
      },
      {
        stepNum: 3, // 步骤序号
        stepName: '项目规划指标', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
      },
      {
        stepNum: 4, // 步骤序号
        stepName: '开发计划', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
      },
      {
        stepNum: 5, // 步骤序号
        stepName: '货值', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
        children: [
          {
            stepNum: 1, // 步骤序号
            stepName: '供货计划表-楼栋', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 2, // 步骤序号
            stepName: '供货计划表-标段', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 3, // 步骤序号
            stepName: '总货值表（测算）', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
        ]
      },
      {
        stepNum: 6, // 步骤序号
        stepName: '销售计划', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
      },
      {
        stepNum: 7, // 步骤序号
        stepName: '开发成本', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
        children: [
          {
            stepNum: 1, // 步骤序号
            stepName: '目标成本', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 2, // 步骤序号
            stepName: '成本支付计划', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 3, // 步骤序号
            stepName: '成本税金支付', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 4, // 步骤序号
            stepName: '成本分摊', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
        ]
      },
      {
        stepNum: 8, // 步骤序号
        stepName: '费用', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
        children: [
          {
            stepNum: 1, // 步骤序号
            stepName: '管理费用', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 2, // 步骤序号
            stepName: '管理费用税金', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 3, // 步骤序号
            stepName: '营销费用', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 4, // 步骤序号
            stepName: '营销费用税金', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
        ]
      },
      {
        stepNum: 9, // 步骤序号
        stepName: '融资', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
      },
      {
        stepNum: 10, // 步骤序号
        stepName: '税金', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
      },
      {
        stepNum: 11, // 步骤序号
        stepName: '现金流', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
        children: [
          {
            stepNum: 1, // 步骤序号
            stepName: '项目现金流', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 2, // 步骤序号
            stepName: '股东层面现金流', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          }
        ]
      },
      {
        stepNum: 12, // 步骤序号
        stepName: '核心经营指标', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
        children: [
          {
            stepNum: 1, // 步骤序号
            stepName: '项目指标', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          },
          {
            stepNum: 2, // 步骤序号
            stepName: '业态指标', // 步骤名称
            stepState: '未开始', // 已完成，进行中，未开始
          }
        ]
      },
      {
        stepNum: 13, // 步骤序号
        stepName: '进入审批环节', // 步骤名称
        stepState: '未开始', // 已完成，进行中，未开始
      }
    ]

     }

  },
  methods: {
    // 点击步骤按钮
    handleClick(step) {
      // 各步骤逻辑处理
      switch (step.stepNum) {
        case 1:
          this.$router.push("/outline/projectselect");
          break;
        default:
          if (step.stepState === "未开始") {
            this.$message({
              type: "success",
              message: "请先完成前面内容!"
            });
          } else {
            if (this.id) {
              this.$router.push(`/outline/outlineinfo/${this.id}?step=${step.stepNum}`);
            }
          }
          break;
      }
    }
  },
  computed: {
    steps() {
      return this.$store.state.outline_stepInfo.steps;
    },
    currentStep() {
      return this.$store.state.outline_stepInfo.currentStep;
    }
  },
  filters: {
    typeFilter: function(val) {
      let result = "success";
      if (val === "进行中") {
        result = "primary";
      } else if (val === "未开始") {
        result = "info";
      }
      return result;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.outline {
  font-size: 16px;
  overflow-x: auto;
  padding-top: 50px;
  background: white;
  .el-button--info {
    background-color: rgb(201, 201, 201);
    border-color: unset;
  }
  .bg-success {
    background-color: #67c23a;
  }
  .bg-blue {
    background-color: #409eff;
  }
  .formitemdiv {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    // justify-content:center;
    margin: auto auto;
    width: 1100px;
    font-size: 14px;
  }
  .code_width {
    width: 80px;
  }
  .search_width {
    width: 265px;
  }
  .flex-direction-column {
    display: flex;
    flex-direction: column;
  }
  .flex-direction-row {
    display: flex;
    flex-direction: row;
    // justify-content:space-between;
  }
  .flex-direction-row-reverse {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 0px 0px 50px 0px;
    color: gray;
  }
}
</style>

