<template>
<div class="projectIndicators">
  <el-card class="editCard ">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">经营层面</span>
    </div>
    <template>
      <div class="formitemdiv">
        <form-item label="项目目标销售额" type="number" :disabled="true" unit="万元" :value="mpiCoreBusinessTargetInfo.targetSales"></form-item>
        <form-item label="项目可售均价" type="number" :disabled="true" unit="元" v-model="mpiCoreBusinessTargetInfo.salesAvg"></form-item>
        <el-divider content-position="left">开发成本</el-divider>
        <form-item label="开发成本" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.developmentCost"></form-item>
        <form-item label="土地出让金" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.landPremium"></form-item>
        <form-item label="其他土地成本" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.otherLandCost"></form-item>
        <form-item label="目标成本（2-7项）" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.targetCost"></form-item>
        <el-divider content-position="left">期间费用</el-divider>
        <form-item label="期间费用" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.periodCost"></form-item>
        <form-item label="营销费用" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.marketingCost"></form-item>
        <form-item label="管理费用" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.manageMentCost"></form-item>
        <form-item label="财务费用" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.financeCost"></form-item>
        <form-item label="营销费效比" unit="%" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.marketingRatio"></form-item>
        <form-item label="管理费效比" unit="%" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.manageMentRatio"></form-item>
        <el-divider content-position="left">税金</el-divider>
        <form-item label="税      金" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.taxes"></form-item>
        <form-item type="none"></form-item>
        <form-item label="增值税" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.vatax"></form-item>
        <form-item label="其他税金" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.otherTaxes"></form-item>
        <form-item label="土地增值税" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.landVatax"></form-item>
        <form-item label="增值税附加" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.addVatax"></form-item>
        <form-item label="企业所得税" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.corporateIncomeTax"></form-item>
        <form-item label="总税负" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.totalTaxBurden"></form-item>
        <form-item label="股东借款利息" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.shareholderInterest"></form-item>
        <form-item label="整盘溢价" unit="万元" type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.premium"></form-item>
        <!-- </div>
        <div class="formitemdiv twoitem"> -->
        <el-divider content-position="left">考核指标</el-divider>
        <form-item label="项目净利润" type="number" unit="万元" :disabled="true" :value="mpiCoreBusinessTargetInfo.netProfit"></form-item>
        <form-item label="税后净利润（扣除溢价）" unit="万元" :disabled="true" type="number" :value="mpiCoreBusinessTargetInfo.afterProfitNoYj"></form-item>
        <form-item label="税后净利润（扣除溢价+利息）" unit="万元" :disabled="true" type="number" :value="mpiCoreBusinessTargetInfo.afterProfitNoYjLx"></form-item>
        <form-item label="项目净利润率（含税）" unit="%" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.netProfitRatio"></form-item>
        <form-item label="税后净利润率（扣除溢价）" unit="%" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.afterProfitNoYjRatio"></form-item>
        <form-item label="税后净利润率（扣除溢价+利息）" unit="%" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.afterProfitNoYjLxRatio"></form-item>
        <form-item label="项目净利润率（不含税）" unit="%" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.netProfitNoTaxRatio"></form-item>
        <form-item label="内部收益率" type="number" unit="%" :disabled="true" v-model="mpiCoreBusinessTargetInfo.profitRatio"></form-item>
        <form-item label="项目累计经营性现金流回正周期" unit="季" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.cashFlowPeriod"></form-item>
        <form-item label="资金峰值" unit="万元"  type="number" :disabled="true" :value="mpiCoreBusinessTargetInfo.capitalPeak"></form-item>
        <form-item label="净资产收益率"  unit="%"  type="number" :disabled="true" v-model="mpiCoreBusinessTargetInfo.netAssetsRatio"></form-item>
        <form-item label="项目经营性（含融资）现金流回正周期" unit="季" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.financingPeriod"></form-item>
        </div>
    </template>
  </el-card>

 <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">股东层面</span>
    </div>
    <template>
      <div class="formitemdiv">
        <form-item label="我方股比" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.stockRatio"></form-item>
        <form-item label="交易对价" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.tradePrice"></form-item>
        <form-item label="我方对应股比的有票成本" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.stockRatioCost"></form-item>
        <form-item label="我方对应股比溢价" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.stockRatioYj"></form-item>
        <form-item label="股东自有资金利息" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.shareholderLx"></form-item>
        <form-item label="项目公司分红利润（力高）" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.shareOut"></form-item>
        <form-item label="力高净利润" type="number" :disabled="true" v-model="mpiCoreBusinessTargetInfo.lgNetProfit"></form-item>
        <form-item label="力高净利润率" type="number" :disabled="true" v-model="mpiCoreBusinessTargetInfo.lgNetProfitRatio"></form-item>
        <form-item label="股东层面内部收益率（不含融资）" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.shareholderSy"></form-item>
        <form-item label="股东层面资金峰值（含融资）" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.shareholderFz"></form-item>
        <form-item label="股东累计经营性（含融资）现金流回正周期" :disabled="true" type="number" v-model="mpiCoreBusinessTargetInfo.shareholderXjlhzzq"></form-item>
      </div>
    </template>
  </el-card>

   <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">项目收入</span>
    </div>
    <template>
      <el-table
        :data="mpiCoreBusinessIncomeInfo"
        border
        fit
        style="width: 100%"
        row-key="id"
        :highlight-current-row="true"
      >
        <el-table-column
          prop="productName"
          label="产品名称"
        >
        </el-table-column>
        <el-table-column
          prop="salesArea"
          label="可售面积（㎡）（或车位个数）"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.salesArea | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="unitPrice"
          label="单价（元）"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.unitPrice | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="salesPriceNoTax"
          label="不含税销售金额（万元）"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.salesPriceNoTax | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="salesPrice"
          label="含税销售金额（万元）"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.salesPrice | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注说明"
        >
        </el-table-column>
       
      </el-table>
    </template>
  </el-card>

   <el-card class="editCard">
    <div
      slot="header"
      class="clearfix"
    >
      <i
        class="el-icon-news"
        style="color:RGB(255,204,102)"
      ></i>
      <span style="margin-left:10px;">项目成本</span>
    </div>
    <template>
      <el-table
        :data="mpiCoreBusinessCostInfo"
        border
        fit
        style="width: 100%"
        :isTree="true"
        row-key="id"
        :isTreeExpandAll="true"
        :highlight-current-row="true"
      >
        <el-table-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="costName"
          label="成本科目"
          treeKey="costName"
          :expandAll="true"
        ></el-table-column>
        <el-table-column
          prop="salesPirce"
          label="可售单方(元/㎡)"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.salesPirce | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="buildPrice"
          label=" 建面单方(元/㎡) "
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.buildPrice | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="priceNoTax"
          label="不含税金额（万元）"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.priceNoTax | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="含税金额（万元）"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.price | numberFormat}}
        </template>
        </el-table-column>
        <el-table-column
          prop="salesRatio"
          label="占销售收入比例"
          width="180"
          header-align="center"
          align="right"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          {{scope.row.salesRatio | numberFormat}}
        </template>
        </el-table-column>
       
      </el-table>
    </template>
  </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin_commom from "@/utils/mixin_commom";
import EditGridItem from "./EditGridItem";
import DynamicsColumn from "./DynamicsColumn";
import FormItem from "./FormItem";
import numeral from 'numeral'


const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

export default {
  name: "ProjectIndicators",
  components: { EditGridItem,DynamicsColumn,FormItem },
  mixins: [mixin_commom],
  data() {
    return {
      year: 4,
      wd: "季度",
      currentYear:currentYear,
      data: [
      ],
    };
  },
  computed: {
    ...mapState({
      outline_stepInfo: state => state.outline_stepInfo,
      mpiCoreBusinessIncomeInfo: state => state.outline_info.mpiCoreBusinessIncomeInfo,
      mpiCoreBusinessCostInfo: state => state.outline_info.mpiCoreBusinessCostInfo,
      mpiCoreBusinessTargetInfo: state => state.outline_info.mpiCoreBusinessTargetInfo,
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
  filters: {
    dateFormat(val, type) {
      if (!type) {
        type = "YYYY-MM-DD";
      }
      if (val) {
        return moment(val).format(type);
      } else {
        return "";
      }
    },
    numberFormat(val) {
      if (val !== undefined && val !== null) {
        return accounting.formatNumber(val, 2);
      } else {
        return val;
      }
    },
    wy(val){
      if(val){
        return numeral(val).divide(10000).value()
      }
      else{
        return val
      }
    }
  },
  watch: {
  },
  methods: {
    handleChange() {
      // const dynamicsData = {}
      // this.$set(dynamicsData)

      // this.data = Object.assign({},this.data,)
    }
  }
};
</script>

<style lang="scss">

.projectIndicators{
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

  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 16px 0;
  }
  .el-divider__text {
      position: absolute;
      background-color: #FFF;
      padding: 0 20px;
      color: #66b1ff;
      font-size: 12px;
  }
  // .formitem_div {
  //   line-height: 28px;
  //   flex: 0 0 140px;
  //   font-size: small;
  // }
}

</style>

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
  flex: 0 0 120px;
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