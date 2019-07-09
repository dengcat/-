<template>
<div>
  <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">股东层面交易模式</span>
      <span style="float:right;height:21px;padding:0px"><AutoCalc v-if="tableManual" type="股东层面交易模式" @reCalc="calcShareholderTradingModelInfo()" :value="tableManual.isManual"></AutoCalc></span>
    </div>
    <template>
      <div v-if="mpiShareholderTradingModelInfo" class="formitemdiv cashflowShareholder">
        <form-item label="整盘作价金额" unit="万元" @change="calcShareholderTradingModelInfo()" type="number" v-model="mpiShareholderTradingModelInfo.zpzjje"></form-item>
        <form-item label="原始有票成本金额" unit="万元" @change="calcShareholderTradingModelInfo()"  type="number" v-model="mpiShareholderTradingModelInfo.ysypcbje"></form-item>
        <form-item label="整盘溢价金额" unit="万元" @change="calcShareholderTradingModelInfo()"  :disabled="tableManual && tableManual.isManual ? false : true" type="number" v-model="mpiShareholderTradingModelInfo.zpyjje"></form-item>
        <form-item label="整盘作价楼面地价" unit="元/平米" @change="calcShareholderTradingModelInfo()"  type="number" v-model="mpiShareholderTradingModelInfo.zpzjlmdj"></form-item>
        <form-item label="原始有票成本楼面地价" unit="元/平米" @change="calcShareholderTradingModelInfo()"  type="number" v-model="mpiShareholderTradingModelInfo.ysypcblmdj"></form-item>
        <form-item label="整盘溢价楼面地价" unit="元/平米" @change="calcShareholderTradingModelInfo()"  type="number" v-model="mpiShareholderTradingModelInfo.zpyjlmdj"></form-item>
        <form-item label="我方股比" unit="%" @change="calcShareholderTradingModelInfo()"  type="number" v-model="mpiShareholderTradingModelInfo.wfgb"></form-item>
        <form-item label="交易对价" @change="calcShareholderTradingModelInfo()"  type="number" v-model="mpiShareholderTradingModelInfo.jydj"></form-item>
        <form-item label="我方对应股比的有票成本" @change="calcShareholderTradingModelInfo()"  type="number" v-model="mpiShareholderTradingModelInfo.wfgbypcb"></form-item>
        <form-item label="我方对应股比溢价" unit="万元" :disabled="tableManual && tableManual.isManual ? false : true" type="number" v-model="mpiShareholderTradingModelInfo.wfdygbyj"></form-item>
        <form-item label="股东自有资金利息" unit="万元" :disabled="tableManual && tableManual.isManual ? false : true" type="number" v-model="mpiShareholderTradingModelInfo.gdzyzjlx"></form-item>
        <form-item label="项目公司分红利润（力高）" :disabled="tableManual && tableManual.isManual ? false : true" type="number" v-model="mpiShareholderTradingModelInfo.xmgsfhlr"></form-item>
        <form-item label="力高净利润" unit="万元" :disabled="tableManual && tableManual.isManual ? false : true" type="number" v-model="mpiShareholderTradingModelInfo.lgjlr"></form-item>
        <form-item label="力高销售净利润率" unit="%" :disabled="tableManual && tableManual.isManual ? false : true" type="number" v-model="mpiShareholderTradingModelInfo.lgxsjlrl"></form-item>
      </div>
    </template>
  </el-card>
  <ShareholderCashFlowCalcInfo></ShareholderCashFlowCalcInfo>
   <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">评价指标</span>
    </div>
    <template>
      <div v-if="mpiEvaluatingInfo" class="formitemdiv cashflowShareholder">
        <form-item label="股东层面内部收益率（不含融资）（IRR）" type="number" v-model="mpiEvaluatingInfo.gdcmnbsyl"></form-item>
        <form-item label="股东资金峰值（含融资）" type="number" v-model="mpiEvaluatingInfo.gdzjfz"></form-item>
        <form-item label="股东累计经营性（含融资）现金流转正时间" type="DatePicker" v-model="mpiEvaluatingInfo.gdljxjlzsj"></form-item>
        <form-item label="净利润（扣除股东自有资金利息）" type="number" v-model="mpiEvaluatingInfo.gdJlr"></form-item>
        <form-item label="销售净利润率" type="number" v-model="mpiEvaluatingInfo.gdXsjlrl"></form-item>
      </div>
    </template>
  </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import DynamicsColumn from "./DynamicsColumn";
import FormItem from "./FormItem";
import ShareholderCashFlowCalcInfo from "./ShareholderCashFlowCalcInfo"
import mixin_calc from './mixin_calc'
import AutoCalc from './AutoCalc'

export default {
  name: "CashflowShareholder",
  components: { EditGridItem,DynamicsColumn, FormItem, ShareholderCashFlowCalcInfo, AutoCalc },
  mixins: [mixin_commom, mixin_calc],
  data() {
    return {
      year: 4,
      wd: "季度",
      data: [
      ],
      showRate:false,
      columnConfigs: [
        { label: "供货面积(平米)", prop: "ghmj" },
        { label: "供货金额(万元)", prop: "ghje" }
      ]
    };
  },
  computed: {
    tableManual() {
      const setting = this.mpiTableManualInfo.find(item => {
        return item.typeName === '股东层面交易模式';
      });
      return setting;
    },
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiShareholderTradingModelInfo: state => state.outline_info.mpiShareholderTradingModelInfo,
      mpiShareholderEvaluatingInfo: state => state.outline_info.mpiShareholderEvaluatingInfo,
      mpiEvaluatingInfo: state => state.outline_info.mpiEvaluatingInfo,
      mpiTableManualInfo: state => state.outline_info.mpiTableManualInfo
    }),
    wdArr() {
      if (this.wd === '年度') {
        return []
      } else if (this.wd === '季度') {
        return ['一季度', '二季度', '三季度', '四季度']
      } else {
        return [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ]
      }
    },
  },
  watch: {
  },
  methods: {
    ...mapActions(['SetOutlineInfo']),
    handleChange() {
      // const dynamicsData = {}
      // this.$set(dynamicsData)

      // this.data = Object.assign({},this.data,)
    },
    calcShareholderTradingModelInfo(){
      const mpiShareholderTradingModelInfo = this.calcGdcmjyms()
      this.SetOutlineInfo({mpiShareholderTradingModelInfo})
      const mpiShareholderCashFlowCalcInfo = this.calcGdcmxjl()
      this.SetOutlineInfo({mpiShareholderCashFlowCalcInfo})
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.formitemdiv {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  // justify-content:center;
  margin-left: 20px;
  margin-right: 20px;
}
.formitem {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 2px 20px;
  width: calc(50% - 40px);
}

.formitem_div {
  line-height: 28px;
  flex: 0 0 240px;
  font-size: small;
}
.formitemoneline {
  align-items: flex-start;
  margin: 2px 20px;
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
.error_span {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  left: 0;
}
.el-card {
  overflow: unset;
}
.date_width {
  width: 245px;
}
</style>

<style lang="scss">
.cashflowShareholder{
  .formitem_div{
    line-height: 28px;
    flex: 0 0 280px;
    font-size: small;
  }
}
</style>
