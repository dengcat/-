/**
 * 处理联动计算
 */
import { mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import { treeToArrayNoParent } from '@/utils'
import numeral from 'numeral'
import { addSeconds } from 'date-fns'

export default {
  methods: {
    // #region 税金
    // 税金计算
    calcTax() {
      // 克隆一个税金
      const taxesCalcInfo = cloneDeep(this.mpiTaxesCalcInfo)
      const arrTaxesCalcInfo = treeToArrayNoParent(taxesCalcInfo)
      // 计算增值税
      this.calcZzs(arrTaxesCalcInfo)
      // 计算土地增值税
      this.calcTdzzs(arrTaxesCalcInfo)
      // 计算印花税
      this.calcYhs(arrTaxesCalcInfo)
      // 计算所得税
      this.calcSds(arrTaxesCalcInfo)
      return taxesCalcInfo
    },
    calcZzs(arrTaxesCalcInfo) {
      const zzsFjXj = arrTaxesCalcInfo[0] // 增值税及附加小计
      const zzsJxs = arrTaxesCalcInfo[1] // 增值税-进项税
      const zzsYj = arrTaxesCalcInfo[2] // 增值税预缴
      const zzsBj = arrTaxesCalcInfo[3] // 增值税补缴
      const zzsHj = arrTaxesCalcInfo[4] // 增值税合计
      const zzsFj = arrTaxesCalcInfo[5] // 增值税附加
      // 增值税预缴
      let zzsJxsSum = 0
      zzsJxs.datas.forEach(datasitem => {
        let costPayPlanTaxes = 0
        let manageMentCostTaxes = 0
        let marketingCostTaxes = 0
        const costPayPlanData = this.mpiCostPayPlanInfo[0].datas.find(item => {
          return item.year === datasitem.year && item.quarterOrMonth === datasitem.quarterOrMonth
        })
        if (costPayPlanData && costPayPlanData.payTaxes) {
          costPayPlanTaxes = costPayPlanData.payTaxes
        }
        const manageMentCostData = this.mpiManageMentCostInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        if (manageMentCostData) {
          manageMentCostTaxes = manageMentCostData
        }
        const marketingCostData = this.mpiMarketingCostInfo[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        if (marketingCostData) {
          marketingCostTaxes = marketingCostData
        }
        datasitem.taxes = costPayPlanTaxes + manageMentCostTaxes + marketingCostTaxes
        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          zzsJxsSum = zzsJxsSum + datasitem.taxes
        }
      })
      zzsJxs.sumTaxes = zzsJxsSum
      // 增值税－预缴
      let zzsYjSum = 0
      zzsYj.datas.forEach(datasitem => {
        // let salePlanInfo = 0
        let returnPlanInfo = 0

        // const salePlanInfoData = this.mpiSalePlanInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        // if (salePlanInfoData) {
        //   salePlanInfo = salePlanInfoData
        // }
        const returnPlanInfoData = this.mpiReturnPlanInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        if (returnPlanInfoData) {
          returnPlanInfo = returnPlanInfoData
        }
        if (datasitem.rate) {
          datasitem.taxes = numeral(returnPlanInfo).divide(1.1).multiply(datasitem.rate).value()
        }
        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          zzsYjSum = zzsYjSum + datasitem.taxes
        }
      })
      zzsYj.sumTaxes = zzsYjSum
      // 增值税合计
      let zzsSum = 0
      zzsHj.datas.forEach((datasitem, index) => {
        const zzsyj = zzsYj.datas[index].taxes ? zzsYj.datas[index].taxes : 0
        const zzsbj = zzsBj.datas[index].taxes ? zzsBj.datas[index].taxes : 0
        datasitem.taxes = zzsyj + zzsbj
        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          zzsSum = zzsSum + datasitem.taxes
        }
      })
      zzsHj.sumTaxes = zzsSum
      // 增值税附加
      let zzsFjSum = 0
      zzsFj.datas.forEach((datasitem, index) => {
        const zzshj = zzsHj.datas[index].taxes ? zzsHj.datas[index].taxes : 0
        const sl = datasitem.rate ? datasitem.rate : 0
        datasitem.taxes = zzshj * sl / 100
        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          zzsFjSum = zzsFjSum + datasitem.taxes
        }
      })
      zzsFj.sumTaxes = zzsFjSum
    },

    calcTdzzs(arrTaxesCalcInfo) {
      const calcRule = [
        { index: 7, type: '+', value: 0 },
        { index: 8, type: '+', value: 0 },
        { index: 9, type: '+', value: 0 },
      ]
      this.calcRow(10, calcRule, arrTaxesCalcInfo)
      // const tdzzsXj = arrTaxesCalcInfo[6] // 小计
      // const tdzzsPtbz = arrTaxesCalcInfo[7] // 土地增值税（普通住宅）
      // const tdzzsFptbz = arrTaxesCalcInfo[8] // 土地增值税（非普通住宅）
      // const tdzzsFzz = arrTaxesCalcInfo[9] // 土地增值税（非住宅）
      // const tdzzsYj = arrTaxesCalcInfo[10] // 土地增值税-预缴
      // const tdzzsBj = arrTaxesCalcInfo[11] // 土地增值税-补缴
      // // 土地增值税-预缴
      // let sum = 0
      // tdzzsYj.datas.forEach((datasitem, index) => {
      //   const tdzzsPtbzTaxes = tdzzsPtbz.datas[index].taxes ? tdzzsPtbz.datas[index].taxes : 0
      //   const tdzzsFptbzTaxes = tdzzsFptbz.datas[index].taxes ? tdzzsFptbz.datas[index].taxes : 0
      //   const tdzzsFzzTaxes = tdzzsFzz.datas[index].taxes ? tdzzsFzz.datas[index].taxes : 0

      //   datasitem.taxes = tdzzsPtbzTaxes + tdzzsFptbzTaxes + tdzzsFzzTaxes
      //   if (datasitem.taxes) {
      //     sum = sum + datasitem.taxes
      //   }
      // })
      // tdzzsYj.sumTaxes = sum
    },
    // 计算印花税
    calcYhs(arrTaxesCalcInfo) {
      const yhshj = arrTaxesCalcInfo[15]
      const xsbdc = arrTaxesCalcInfo[16]
      const jzazht = arrTaxesCalcInfo[17]
      const jkht = arrTaxesCalcInfo[18]
      const qt = arrTaxesCalcInfo[19]
      let sum = 0
      // 销售不动产
      xsbdc.datas.forEach((datasitem, index) => {
        const returnPlanInfoData = this.mpiReturnPlanInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        if (returnPlanInfoData && datasitem.rate) {
          datasitem.taxes = numeral(returnPlanInfoData).divide(1.1).multiply(datasitem.rate).value()
        }
        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem.taxes
        }
      })
      xsbdc.sumTaxes = sum
      // 印花税合计
      sum = 0
      yhshj.datas.forEach((datasitem, index) => {
        const jzazhtTaxes = jzazht.datas[index].taxes ? jzazht.datas[index].taxes : 0
        const jkhtTaxes = jkht.datas[index].taxes ? jkht.datas[index].taxes : 0
        const qtTaxes = qt.datas[index].taxes ? qt.datas[index].taxes : 0
        datasitem.taxes = jzazhtTaxes + jkhtTaxes + qtTaxes
        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem.taxes
        }
      })
      yhshj.sumTaxes = sum
    },
    // 计算所得税
    calcSds(arrTaxesCalcInfo) {
      // const sdsXj = arrTaxesCalcInfo[20]
      // const sdsYj = arrTaxesCalcInfo[21]
      // const sdsQj = arrTaxesCalcInfo[22]

      // const sds23 = arrTaxesCalcInfo[23] // 营业收入
      // const sds24 = arrTaxesCalcInfo[24] // 营业成本
      // const sds25 = arrTaxesCalcInfo[25] // 税金及附加
      // const sds26 = arrTaxesCalcInfo[26] // 销售费用
      // const sds27 = arrTaxesCalcInfo[27] // 管理费用
      // const sds28 = arrTaxesCalcInfo[28] // 财务费用
      // const sds29 = arrTaxesCalcInfo[29] // 营业利润
      // const sds30 = arrTaxesCalcInfo[30] // 纳税调整增加额
      // const sds31 = arrTaxesCalcInfo[31] // 销售未完工产品的收入
      // const sds32 = arrTaxesCalcInfo[32] // 销售未完工产品预毛利额
      // const sds33 = arrTaxesCalcInfo[33] // 实际发生的增值税附加、土地增值税
      // const sds34 = arrTaxesCalcInfo[34] // 纳税调整减少额
      // const sds35 = arrTaxesCalcInfo[35] // 销售未完工产品转完工产品确认的销售收入
      // const sds36 = arrTaxesCalcInfo[36] // 转回的销售未完工产品预计毛利额
      // const sds37 = arrTaxesCalcInfo[37] // 转回实际发生的增值税附加、土地增值税
      // const sds38 = arrTaxesCalcInfo[38] // 纳税调整后所得
      // const sds39 = arrTaxesCalcInfo[39] // 弥补以前年度亏损（以负数体现）
      // const sds40 = arrTaxesCalcInfo[40] // 应纳税所得额
      // const sds41 = arrTaxesCalcInfo[41] // 应纳税所得额25%
      // const sds42 = arrTaxesCalcInfo[42] // 应纳所得税额
      // const sds43 = arrTaxesCalcInfo[43] // 减：本年累计实际已缴纳的所得税额
      // const sds44 = arrTaxesCalcInfo[44] // 六、本年应补（退）所得税额
      let calcRule = []
      // 营业利润
      calcRule = [
        { index: 23, type: '+', value: 0 },
        { index: 24, type: '-', value: 0 },
        { index: 25, type: '-', value: 0 },
        { index: 26, type: '-', value: 0 },
        { index: 27, type: '-', value: 0 },
        { index: 28, type: '-', value: 0 },
      ]
      this.calcRow(29, calcRule, arrTaxesCalcInfo)
      // 销售未完工产品预毛利额
      calcRule = [
        { index: 31, type: '+', value: 0 },
        { index: 32, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcRow(33, calcRule, arrTaxesCalcInfo)

      // 纳税调整增加额
      calcRule = [
        { index: 33, type: '+', value: 0 },
        { index: 34, type: '-', value: 0 },
      ]
      this.calcRow(30, calcRule, arrTaxesCalcInfo)
      // 销售未完工产品预毛利额
      calcRule = [
        { index: 36, type: '+', value: 0 },
        { index: 37, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcRow(38, calcRule, arrTaxesCalcInfo)

      // 转回的销售未完工产品预计毛利额
      calcRule = [
        { index: 36, type: '+', value: 0 },
        { index: 37, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcRow(38, calcRule, arrTaxesCalcInfo)
      // 纳税调整减少额
      calcRule = [
        { index: 38, type: '+', value: 0 },
        { index: 39, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcRow(35, calcRule, arrTaxesCalcInfo)
      // 纳税调整减少额
      calcRule = [
        { index: 38, type: '+', value: 0 },
        { index: 39, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcRow(35, calcRule, arrTaxesCalcInfo)
      // 纳税调整后所得
      calcRule = [
        { index: 29, type: '+', value: 0 },
        { index: 30, type: '+', value: 0 },
        { index: 35, type: '-', value: 0 },
      ]
      this.calcRow(40, calcRule, arrTaxesCalcInfo)
      // 应纳税所得额
      calcRule = [
        { index: 40, type: '+', value: 0 },
        { index: 41, type: '+', value: 0 },
      ]
      this.calcRow(42, calcRule, arrTaxesCalcInfo)
      // 应纳所得税额
      calcRule = [
        { index: 42, type: '+', value: 0 },
        { index: null, type: '*', value: 0.25 },
      ]
      this.calcRow(44, calcRule, arrTaxesCalcInfo)
      // 本年应补（退）所得税额
      calcRule = [
        { index: 44, type: '+', value: 0 },
        { index: 45, type: '-', value: 0 },
      ]
      this.calcRow(46, calcRule, arrTaxesCalcInfo)

      // 所得税小计
      calcRule = [
        { index: 21, type: '+', value: 0 },
        { index: 22, type: '+', value: 0 },
      ]
      this.calcRow(20, calcRule, arrTaxesCalcInfo)
    },
    // #endregion
    // #region 项目现金流
    calcXmxjl() {
      const cashFlowCalc = cloneDeep(this.mpiCashFlowCalcInfo)
      const arrCashFlowCalc = treeToArrayNoParent(cashFlowCalc)
      let xjlcSum = 0 // 现金流出合计
      // 开发成本、管理费用、营销费用、财务费用
      this.calcRowOther(arrCashFlowCalc[1], this.mpiCostPayPlanTotal, cashFlow, sumCashFlow)
      let sum = 0
      arrCashFlowCalc[1].datas.forEach(datasitem => {
        datasitem.cashFlow = this.mpiCostPayPlanTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? this.mpiCostPayPlanTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
        if (datasitem.cashFlow && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem.cashFlow
        }
      })
      arrCashFlowCalc[1].datas.forEach(item => {
        item.sumCashFlow = sum
      })
      arrCashFlowCalc[1].sumCashFlow = sum
      xjlcSum = xjlcSum + sum
      // 管理费用
      sum = 0
      arrCashFlowCalc[2].datas.forEach(datasitem => {
        datasitem.cashFlow = this.mpiManageMentCostInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? this.mpiManageMentCostInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
        if (datasitem.cashFlow && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem.cashFlow
        }
      })
      arrCashFlowCalc[2].datas.forEach(item => {
        item.sumCashFlow = sum
      })
      arrCashFlowCalc[2].sumCashFlow = sum
      xjlcSum = xjlcSum + sum
      // 营销费用
      sum = 0
      arrCashFlowCalc[3].datas.forEach(datasitem => {
        datasitem.cashFlow = this.mpiMarketingCostInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? this.mpiMarketingCostInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
        if (datasitem.cashFlow && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem.cashFlow
        }
      })
      arrCashFlowCalc[3].datas.forEach(item => {
        item.sumCashFlow = sum
      })
      arrCashFlowCalc[3].sumCashFlow = sum
      xjlcSum = xjlcSum + sum
      // 财务费用
      sum = 0
      arrCashFlowCalc[4].datas.forEach(datasitem => {
        datasitem.cashFlow = this.mpiFinancingCalcInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? this.mpiFinancingCalcInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
        if (datasitem.cashFlow && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem.cashFlow
        }
      })
      arrCashFlowCalc[4].datas.forEach(item => {
        item.sumCashFlow = sum
      })
      arrCashFlowCalc[4].sumCashFlow = sum
      xjlcSum = xjlcSum + sum
      // 税金
      sum = 0
      arrCashFlowCalc[5].datas.forEach(datasitem => {
        datasitem.cashFlow = this.mpiTaxesCalcInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? this.mpiFinancingCalcInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
      })
      arrCashFlowCalc[5].datas.forEach(item => {
        item.sumCashFlow = sum
      })
      arrCashFlowCalc[5].sumCashFlow = sum
      xjlcSum = xjlcSum + sum
      // 现金流出
      arrCashFlowCalc[0].datas.forEach((item, index) => {
        const cashFlow1 = arrCashFlowCalc[1].datas[index].cashFlow ? arrCashFlowCalc[1].datas[index].cashFlow : 0
        const cashFlow2 = arrCashFlowCalc[2].datas[index].cashFlow ? arrCashFlowCalc[2].datas[index].cashFlow : 0
        const cashFlow3 = arrCashFlowCalc[3].datas[index].cashFlow ? arrCashFlowCalc[3].datas[index].cashFlow : 0
        const cashFlow4 = arrCashFlowCalc[4].datas[index].cashFlow ? arrCashFlowCalc[4].datas[index].cashFlow : 0
        const cashFlow5 = arrCashFlowCalc[5].datas[index].cashFlow ? arrCashFlowCalc[5].datas[index].cashFlow : 0

        item.sumCashFlow = cashFlow1 + cashFlow2 + cashFlow3 + cashFlow4 + cashFlow5
      })
      arrCashFlowCalc[0].sumCashFlow = xjlcSum
      // 销售回款
      sum = 0
      arrCashFlowCalc[7].datas.forEach(datasitem => {
        datasitem.cashFlow = this.mpiReturnPlanInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? this.mpiFinancingCalcInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
      })
      arrCashFlowCalc[7].datas.forEach(item => {
        item.sumCashFlow = sum
      })
      arrCashFlowCalc[7].sumCashFlow = sum
      // 现金流入
      arrCashFlowCalc[6].datas.forEach((datasitem, index) => {
        const cashFlow7 = arrCashFlowCalc[7].datas[index].cashFlow ? arrCashFlowCalc[7].datas[index].cashFlow : 0
        const cashFlow8 = arrCashFlowCalc[8].datas[index].cashFlow ? arrCashFlowCalc[8].datas[index].cashFlow : 0
        datasitem.cashFlow = cashFlow7 + cashFlow8
      })
      arrCashFlowCalc[6].sumCashFlow = arrCashFlowCalc[7].sumCashFlow + arrCashFlowCalc[8].sumCashFlow
      arrCashFlowCalc[6].datas.forEach(item => {
        item.sumCashFlow = sum
      })
    },
    // 等于其他结果集
    calcRowOther(row, object, key, sumKey) {
      let sum = 0
      row.datas.forEach(datasitem => {
        datasitem[key] = object[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? object[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
        if (datasitem[key] && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem[key]
        }
      })
      row.datas.forEach(item => {
        item[sumKey] = sum
      })
      row[sumKey] = sum
    },
    // 计算结果集
    // #endregion

    calcRow(result, calcRule, calcData, key, sumKey) {
      if (!key) {
        key = 'taxes'
      }
      if (!sumKey) {
        sumKey = 'sumTaxes'
      }
      let sum = 0
      calcData[result].datas.forEach((datasitem, index) => {
        let calcValue = 0
        calcRule.forEach(ruleitem => {
          if (ruleitem.index) {
            ruleitem.value = calcData[ruleitem.index].datas[index][key] ? calcData[ruleitem.index].datas[index][key] : 0
          }
          calcValue = this.calcOperations(calcValue, ruleitem.type, ruleitem.value)
        })
        datasitem[key] = calcValue
        if (datasitem[key] && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem[key]
        }
      })
      calcData[result][sumKey] = sum
      calcData[result].datas.forEach(item => {
        item[sumKey] = sum
      })
    },
    calcOperations(defaultValue, type, value) {
      if (!type) {
        type = '+'
      }
      let result = defaultValue
      switch (type) {
        case '+':
          result = defaultValue + value
        break
        case '-':
          result = defaultValue - value
        break
        case '*':
          result = defaultValue * value
        break
        case '/':
          result = defaultValue / value
        break
      }
      return result
    }
  },
  computed: {
    arrData: function() {
      return treeToArrayNoParent(this.showData)
    },
    // 管理费用的合计
    mpiManageMentCostInfoTotal: function() {
      const result = {}
      this.mpiManageMentCostInfo.forEach((item, index) => {
        if (index > 2) {
          item.datas.forEach(datasitem => {
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.costTaxes ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.costTaxes) : datasitem.costTaxes)
          })
        }
      })
      return result
    },
    // 市场费用的合计
    mpiMarketingCostInfoTotal: function() {
      const result = {}
      this.mpiMarketingCostInfo.forEach((item, index) => {
        if (index > 1) {
          item.datas.forEach(datasitem => {
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.costTaxes ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.costTaxes) : datasitem.costTaxes)
          })
        }
      })
      return result
    },
    // 销售计划
    mpiSalePlanInfoTotal: function() {
      const result = {}
      this.mpiSalePlanInfo.forEach((item, index) => {
        if (index > 1) {
          item.datas.forEach(datasitem => {
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.contractPrice ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.contractPrice) : datasitem.contractPrice)
          })
        }
      })
      return result
    },
    // 回款计划
    mpiReturnPlanInfoTotal: function() {
      const result = {}
      this.mpiReturnPlanInfo.forEach((item, index) => {
        item.datas.forEach(datasitem => {
          this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.contractPrice ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.contractPrice) : datasitem.contractPrice)
        })
      })
      return result
    },
    // 开发成本
    mpiCostPayPlanTotal: function() {
      const result = {}
      this.mpiCostPayPlanInfo[1].datas.forEach(datasitem => {
        this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.targetCost ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.targetCost) : datasitem.targetCost)
      })
      return result
    },
    // 财务测算
    mpiFinancingCalcInfoTotal: function() {
      const result = {}
      this.mpiFinancingCalcInfo.forEach((item, index) => {
        item.datas.forEach(datasitem => {
          this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.cost ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.cost) : datasitem.cost)
        })
      })
      return result
    },
    // 税金
    mpiTaxesCalcInfoTotal: function() {
      const result = {}
      this.mpiTaxesCalcInfo.forEach((item, index) => {
        item.datas.forEach(datasitem => {
          this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.taxes ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.taxes) : datasitem.taxes)
        })
      })
      return result
    },
    ...mapState(
      {
        mpiDevPlanInfo: state => state.outline_info.mpiDevPlanInfo,
        mpiSalePlanInfo: state => state.outline_info.mpiSalePlanInfo,
        mpiReturnPlanInfo: state => state.outline_info.mpiReturnPlanInfo,
        mpiCostPayPlanInfo: state => state.outline_info.mpiCostPayPlanInfo,
        mpiManageMentCostInfo: state => state.outline_info.mpiManageMentCostInfo,
        mpiMarketingCostInfo: state => state.outline_info.mpiMarketingCostInfo,
        mpiTaxesCalcInfo: state => state.outline_info.mpiTaxesCalcInfo,
      }
    ),
  }

}
