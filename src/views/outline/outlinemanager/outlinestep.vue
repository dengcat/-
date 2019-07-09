<template>
  <div style="height:100%;padding:0;width：100％" v-loading="pageLoading">
    <!-- <router-link to="/outline/test">1111</router-link> -->
    <!-- 基本信息 -->
    <div style="margin-bottom:50px">
    <div v-if="currStep.stepName==='项目基本信息'">
      <basic-info :id="id" :mode="edit"></basic-info>
    </div>
    <div v-else-if="currStep.stepName==='项目规划指标'">
      <plan-info :id="id" :mode="edit"></plan-info>
    </div>
    <div v-else-if="currStep.stepName==='开发计划'">
      <development-plan :id="id" :mode="edit"></development-plan>
    </div>
    <div v-else-if="currStep.stepName==='货值'">
      <goods-value :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></goods-value>
    </div>
    <div v-else-if="currStep.stepName==='销售计划'">
      <sales-plan :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></sales-plan>
    </div>
    <div v-else-if="currStep.stepName==='开发成本'">
      <development-cost :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></development-cost>
    </div>
    <div v-else-if="currStep.stepName==='费用'">
      <expense :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></expense>
    </div>

    <div v-else-if="currStep.stepName==='融资'">
      <Finance :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></Finance>
    </div>
    <div v-else-if="currStep.stepName==='税金'">
      <Taxes :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></Taxes>
    </div>

    <div v-else-if="currStep.stepName==='现金流'">
      <Cashflow :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></Cashflow>
    </div>
    <div v-else-if="currStep.stepName==='核心经营指标'">
      <Business-Indicators :id="id" :mode="edit" :step="currStep" :childrenStep="childrenStep"></Business-Indicators>
    </div>
    <div v-else>
    </div>
    </div>
    <el-card style="width:100%;right：0;height:60px;margin-top:20px;margin-right:100px;text-align: center;position: fixed;left:0; bottom:0px;z-index:1000">
      <el-button v-if="currStep.stepNum>2" @click="handlePrev()">返回上一步</el-button>
      <el-button v-if="currStep.stepNum<13" type="primary" :loading="saveLoading" @click="handleNext()">保存并下一步</el-button>
    </el-card>
    <!-- 编辑填写页面 -->
    <el-dialog
      :close-on-click-modal="false"
      title="数据影响"
      :visible.sync="dialogVisible"
      width="900px">
      <el-table
        :data="modiArr"
        style="width: 100%">
        <el-table-column
          prop="module"
          label="模块"
          width="180">
        </el-table-column>
        <el-table-column
          prop="data"
          label="指标"
          width="180">
        </el-table-column>
        <el-table-column
          prop="oldValue"
          label="原数据">
          <template slot-scope="scope">
            {{scope.row.oldValue }}
          </template>
        </el-table-column>
        <el-table-column
          label="新数据">
          <template slot-scope="scope">
            {{scope.row.newValue }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="handleSave()">确定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BasicInfo from "./components/BasicInfo";
import PlanInfo from "./components/PlanInfo";
import DevelopmentPlan from "./components/DevelopmentPlan";
import GoodsValue from "./components/GoodsValue";
import SalesPlan from "./components/SalesPlan";
import DevelopmentCost from "./components/DevelopmentCost";
import Expense from "./components/Expense";
import Taxes from "./components/Taxes";
import Cashflow from "./components/Cashflow";
import Finance from "./components/Finance";
import BusinessIndicators from "./components/BusinessIndicators";
import { deepClone,treeToArrayNoParent } from "@/utils";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import mixin_calc from './components/mixin_calc'
import { startOfDay } from 'date-fns';

export default {
  name:'OutlineStep',
  props:['step','childrenStep','id'],
  mixins: [mixin_calc],
  components:{ BasicInfo,PlanInfo,DevelopmentPlan,GoodsValue,SalesPlan,DevelopmentCost,Expense,Taxes,Cashflow,BusinessIndicators,Finance },
  data(){
    return {
      pageLoading:false,
      edit:0,
      modiArr:[],
      dialogVisible:false,
      saveData: undefined,
      saveLoading:false
    }
  },
  computed: {
    ...mapState(
      {
        outline_stepInfo:state=> state.outline_stepInfo,
        mpiVersionInfo:state=> state.outline_info.mpiVersionInfo,
        mpiProjectInfo: state => state.outline_info.mpiProjectInfo,
        mpiProductInfo: state => state.outline_info.mpiProductInfo,
        mpiSectionInfo: state => state.outline_info.mpiSectionInfo,
        mpiDevPlanInfo: state => state.outline_info.mpiDevPlanInfo,
        mpiSupplyBuildInfo: state => state.outline_info.mpiSupplyBuildInfo,
        mpiCostPayTaxesInfo: state => state.outline_info.mpiCostPayTaxesInfo,
        mpiCostPayPlanInfo: state => state.outline_info.mpiCostPayPlanInfo,
        eidtModule: state => state.outline_info.eidtModule,
      }
    ),
    currStep(){
      return this.outline_stepInfo.steps.find(item => item.stepNum === this.step)
    },
    currChildrenStep(){
      if(this.currStep.children && this.currStep.children.length > 0){
        return this.currStep.children.find(item=>item.stepNum === this.childrenStep)
      }
      else{
        return undefined
      }
    },
    prevStep(){
      let prevStep = {
        step: this.step,
        childrenStep: this.step
      }
      const currStep = this.outline_stepInfo.steps.find(item => item.stepNum === this.step)
      if(this.childrenStep && currStep.children && currStep.children.length > 0 && (this.childrenStep -1) > 0){
        prevStep = {
          step: this.step,
          childrenStep:  this.childrenStep -1 
        }
      }
      else{
        const tempPreStep = this.outline_stepInfo.steps.find(item => item.stepNum === (this.step -1))
        if(tempPreStep && tempPreStep.children && tempPreStep.children.length > 0){
          prevStep = {
            step: this.step-1 ,
            childrenStep:  tempPreStep.children.length
          }
        }
        else{
          prevStep = {
            step: this.step-1 ,
            childrenStep:  undefined
          }
        }
      }
      return prevStep
    },
    nextStep(){
      let nextStep = {
        step: this.step,
        childrenStep: this.childrenStep
      }
      const currStep = this.outline_stepInfo.steps.find(item => item.stepNum === this.step)
      if(this.childrenStep && currStep.children && currStep.children.length > 0 && this.childrenStep < currStep.children.length){
        nextStep = {
          step: this.step,
          childrenStep:  this.childrenStep + 1 
        }
      }
      else{
        const tempNextStep = this.outline_stepInfo.steps.find(item => item.stepNum === (this.step + 1))
        if(tempNextStep && tempNextStep.children && tempNextStep.children.length > 0){
          nextStep = {
            step: this.step+1 ,
            childrenStep: 1
          }
        }
        else{
          nextStep = {
            step: this.step + 1 ,
            childrenStep:  undefined
          }
        }
      }
      return nextStep
    }
  },
  updated(){
  },
  methods:{
    ...mapActions(['outline_stepInfo_UpdateStepInfo','SaveOutlineInfo','SetOutlineInfo']),
    handlePrev(){
      if(this.prevStep){
        this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${this.prevStep.step}${this.prevStep.childrenStep?`&childrenstep=${this.prevStep.childrenStep}`:''}`)
      }
      else{
        // 提示错误
        this.$message({
          message: '找不到上一步',
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    handleNext(){
      if((this.outline_stepInfo.currentStep.step < this.step) || (this.outline_stepInfo.currentStep.step === this.step && this.outline_stepInfo.currentStep.childrenStep < this.childrenStep)){
        this.$message({
          message: '请先保存前面进行中步骤信息',
          type: "error",
          duration: 5 * 1000
        });
        return
      }
      this.saveLoading = true
      // 更新步骤信息
      this.outline_stepInfo_UpdateStepInfo({step: this.step, childrenStep: this.childrenStep})
      // 试算影响点
      this.calcRules()
      // 弹出页面确认
      // 更新影响点
      
      
    },
    Save(){
      if(this.saveData){
        this.SetOutlineInfo(this.saveData)
      }
      // this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${this.nextStep.step}${this.nextStep.childrenStep?`&childrenstep=${this.nextStep.childrenStep}`:''}`)
      // 保存
      this.SaveOutlineInfo().then(
        (response)=>{
          this.$notify({
            title: '保存成功',
            message: this.currChildrenStep? `${this.currStep.stepName}-${this.currChildrenStep.stepName} 保存成功！`: `${this.currStep.stepName}保存成功！`,
            type: 'success'
          });
          if(this.nextStep){
            this.saveLoading = false
            this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${this.nextStep.step}${this.nextStep.childrenStep?`&childrenstep=${this.nextStep.childrenStep}`:''}`)
          }
          else{
            this.saveLoading = false
            // 提示错误
            this.$notify({
              title: '找不到下一步',
              type: "error",
            });
          }
        }
      ).catch(
        (error)=>{
          this.saveLoading = false
          // 提示错误
          this.$notify({
            title:'出现错误',
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
          this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${this.nextStep.step}${this.nextStep.childrenStep?`&childrenstep=${this.nextStep.childrenStep}`:''}`)
        }
      )
    },

    handleClick(tab, event){
      // event.stopPropagation()
      this.$router.push(`/outline/outlineinfo/${this.mpiVersionInfo.id}?step=${tab.name}`)
    },
    tabBeforeLeave(){
      return false
    },
    calcRules(){
      let eidtModule = ['mpiProjectInfo',
          'mpiBasicPlanInfo',
          'mpiDevPlanInfo',
          'mpiProductInfo',
          'mpiProductPlanInfo',
          'mpiSectionInfo',
          'mpiSectionPlanInfo',
          'mpiSupplyBuildInfo',
          'mpiSupplySectionInfo',
          'mpiSaleTotalCalInfo',
          'mpiSaleTotalProCalInfo',
          'mpiReturnPlanInfo',
          'mpiSaleCarryOverInfo',
          'mpiSalePlanInfo',
          'mpiTargetCostInfo',
          'mpiCostAllocationInfo',
          'mpiCostPayPlanInfo',
          'mpiManageMentCostInfo',
          'mpiMarketingCostInfo',
          'mpiMarketingCostTaxesInfo',
          'mpiFinancingBalanceInfo',
          'mpiFinancingCalcInfo',
          'mpiFinancingPlanInfo',
          'mpiTaxesCalcInfo',
          'mpiLandValueTaxCalcInfo',
          'mpiCashFlowCalcInfo',
          'mpiCapitalPeakInfo',
          'mpiEvaluatingInfo',
          'mpiShareholderTradingModelInfo',
          'mpiShareholderCashFlowCalcInfo',
          'mpiCoreBusinessIncomeInfo',
          'mpiCoreBusinessCostInfo',
          'mpiYtTargetProfitInfo',
          'mpiCoreBusinessTargetInfo',
          'mpiTableSettingInfo']
      switch(this.step){
        case 2:
        case 3:
          eidtModule = []
          this.SetOutlineInfo({eidtModule})
          break
        case 4:
          // this.eidtModule = ['mpiDevPlanInfo','mpiSupplyBuildInfo','mpiSupplySectionInfo']
          eidtModule = ['mpiDevPlanInfo','mpiSupplyBuildInfo','mpiSupplySectionInfo']
          this.SetOutlineInfo({eidtModule})
          // 开发计划
          // 计算：预售证时间（货值-（供货计划表-楼栋））
          if(this.mpiSupplyBuildInfo){
            // 货值楼栋
            const calcMpiSupplyBuildInfo = cloneDeep(this.mpiSupplyBuildInfo)
            // 转换成数组
            const arrMpiDevPlanInfo =treeToArrayNoParent(this.mpiDevPlanInfo)
            const arrCalcMpiSupplyBuildInfo =treeToArrayNoParent(calcMpiSupplyBuildInfo)
            // 更新供货计划表-楼栋预售证时间，并且添加到影响点结果集中
            arrMpiDevPlanInfo.forEach(element => {
              const calcRow = arrCalcMpiSupplyBuildInfo.find(item => item.sectionName===element.sectionName  && item.bldName ===element.bldName)
              if(moment(calcRow.cerSourceDate).format('YYYY-MM-DD')!==moment(element.cerSourceDate).format('YYYY-MM-DD')){
                const oldInfo =cloneDeep(calcRow)
                calcRow.cerSourceDate = cloneDeep(element.cerSourceDate)
                calcRow.datas.forEach(item=>{
                  item.cerSourceDate = calcRow.cerSourceDate
                })
                const newInfo = cloneDeep(calcRow)
                // 有改变 赋值 并记录改变内容
                this.modiArr.push({
                  key:'cerSourceDate',
                  module: '货值-（供货计划表-楼栋）',
                  oldInfo,
                  newInfo,
                  data: `${calcRow.sectionName}-${calcRow.bldName? calcRow.bldName : ''}-预售证时间`,
                  oldValue: oldInfo.cerSourceDate? moment(oldInfo.cerSourceDate).format('YYYY-MM-DD'): null,
                  newValue: moment(newInfo.cerSourceDate).format('YYYY-MM-DD')
                })
              }
              // 楼栋
            });
            this.saveData = {mpiSupplyBuildInfo: calcMpiSupplyBuildInfo}         
          }
        break
        case 5:
          eidtModule = ['mpiSupplyBuildInfo','mpiSupplySectionInfo','mpiSaleTotalCalInfo','mpiTableSettingInfo']
          this.SetOutlineInfo({eidtModule})
          break
        case 6:
          // eidtModule = ['mpiSupplyBuildInfo','mpiSupplySectionInfo','mpiSaleTotalCalInfo']
          this.SetOutlineInfo({eidtModule})
          
        break
        default:
          this.SetOutlineInfo({eidtModule})

      }
      if(this.step>=5){
        const mpiCostAllocationInfo = this.calcCbft()
        this.SetOutlineInfo({mpiCostAllocationInfo})
        const mpiSupplySectionInfo = this.calcHzbd()
        this.SetOutlineInfo({mpiSupplySectionInfo})
        const mpiTaxesCalcInfo = this.calcTax()
        this.SetOutlineInfo({mpiTaxesCalcInfo})
        const mpiLandValueTaxCalcInfo = this.calcTdzzsqs()
        this.SetOutlineInfo({mpiLandValueTaxCalcInfo})
        const mpiCashFlowCalcInfo = this.calcXmxjl()
        this.SetOutlineInfo({mpiCashFlowCalcInfo})
        const mpiCapitalPeakInfo = this.calcZjfz()
        this.SetOutlineInfo({mpiCapitalPeakInfo})
        const mpiShareholderCashFlowCalcInfo = this.calcGdcmxjl()
        this.SetOutlineInfo({mpiShareholderCashFlowCalcInfo})
        const mpiCoreBusinessIncomeInfo = this.calcXmsr()
        this.SetOutlineInfo({mpiCoreBusinessIncomeInfo})     
        const mpiCoreBusinessCostInfo = this.calcXmcb()
        this.SetOutlineInfo({mpiCoreBusinessCostInfo})   
        const mpiCoreBusinessTargetInfo = this.calcJycm()
        this.SetOutlineInfo({mpiCoreBusinessTargetInfo})   
        const mpiYtTargetProfitInfo = this.calcYtlr()
        this.SetOutlineInfo({mpiYtTargetProfitInfo}) 
        const mpiEvaluatingInfo = this.calcPjzb()
        this.SetOutlineInfo({mpiEvaluatingInfo}) 

            

        // if(this.saveData){
        //   this.saveData = Object.assign(this.saveData,{mpiTaxesCalcInfo,mpiCashFlowCalcInfo,mpiCapitalPeakInfo,mpiShareholderCashFlowCalcInfo,mpiCoreBusinessTargetInfo,mpiCoreBusinessCostInfo,mpiYtTargetProfitInfo,mpiCoreBusinessIncomeInfo})
        // }
        // else{
        //    this.saveData = {mpiTaxesCalcInfo,mpiCashFlowCalcInfo,mpiCapitalPeakInfo,mpiShareholderCashFlowCalcInfo,mpiCoreBusinessTargetInfo,mpiCoreBusinessCostInfo,mpiYtTargetProfitInfo,mpiCoreBusinessIncomeInfo}
        // }
      }
      if(this.modiArr && this.modiArr.length > 0){
        this.dialogVisible = true
      }
      else{
        this.Save()
      }
    },
    handleCancel(){
      this.modiArr=[]
      this.dialogVisible = false
      
    },
    handleSave(){
      this.modiArr=[]
      this.dialogVisible = false
      this.Save()
    }
  },
  filters:{
    valueFormat(val,type){
      if(!type){
        type = 'YYYY-MM-DD'
      }
      if(val){
       return moment(val).format(type)
      }
      else{
        return val
      }
    }
  },
}
</script>

