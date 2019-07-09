/**
 * 处理联动计算
 */
import { mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import { treeToArrayNoParent } from '@/utils'
import numeral from 'numeral'

export default {
  methods: {
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
      zzsJxs.forEach(datasitem => {
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
        if (datasitem.taxes) {
          zzsJxsSum = zzsJxsSum + datasitem.taxes
        }
      })
      zzsJxs.sumTaxes = zzsJxsSum
      // 增值税－预缴
      let zzsYjSum = 0
      zzsYj.datas.forEach(datasitem => {
        let salePlanInfo = 0
        let returnPlanInfo = 0

        const salePlanInfoData = this.mpiSalePlanInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        if (salePlanInfoData) {
          salePlanInfo = salePlanInfoData
        }
        const returnPlanInfoData = this.mpiReturnPlanInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        if (returnPlanInfoData) {
          returnPlanInfo = returnPlanInfoData
        }
        if (datasitem.taxesExplain) {
          datasitem.taxes = numeral(salePlanInfo - returnPlanInfo).divide(1.1).multiply(datasitem.taxesExplain).value()
        }
        if (datasitem.taxes) {
          zzsYjSum = zzsYjSum + datasitem.taxes
        }
      })
      zzsYjSum.sumTaxes = zzsJxsSum
      // 增值税合计
      let zzsSum = 0
      zzsHj.datas.forEach((datasitem, index) => {
        const zzsyj = zzsYj.datas[index].taxes ? zzsYj.datas[index].taxes : 0
        const zzsbj = zzsBj.datas[index].taxes ? zzsBj.datas[index].taxes : 0
        datasitem.taxes = zzsyj + zzsbj
        if (datasitem.taxes) {
          zzsSum = zzsSum + datasitem.taxes
        }
      })
      zzsHj.sumTaxes = zzsSum
      // 增值税附加
      let zzsFjSum = 0
      zzsFj.datas.forEach((datasitem, index) => {
        const zzshj = zzsHj.datas[index].taxes ? zzsHj.datas[index].taxes : 0
        const sl = datasitem.taxesExplain ? datasitem.taxesExplain : 0
        datasitem.taxes = zzshj * sl / 100
        if (datasitem.taxes) {
          zzsFjSum = zzsFjSum + datasitem.taxes
        }
      })
      zzsFjSum.sumTaxes = zzsFjSum
    },

    calcTdzzs(arrTaxesCalcInfo) {
      const calcRule = [
        { index: 7, type: '+', value: 0 },
        { index: 8, type: '+', value: 0 },
        { index: 9, type: '+', value: 0 },
      ]
      this.calcOperations(10, calcRule, arrTaxesCalcInfo)
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
      xsbdc.datas.array.forEach((datasitem, index) => {
        const returnPlanInfoData = this.mpiReturnPlanInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
        if (returnPlanInfoData && datasitem.taxesExplain) {
          datasitem.taxes = numeral(returnPlanInfoData).divide(1.1).multiply(datasitem.taxesExplain).value()
        }
        if (datasitem.taxes) {
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
        if (datasitem.taxes) {
          sum = sum + datasitem.taxes
        }
      })
      yhshj.sumTaxes = sum
    },
    // 计算所得税
    calcSds(arrTaxesCalcInfo) {
      const sdsXj = arrTaxesCalcInfo[20]
      const sdsYj = arrTaxesCalcInfo[21]
      const sdsQj = arrTaxesCalcInfo[22]

      const sds23 = arrTaxesCalcInfo[23] // 营业收入
      const sds24 = arrTaxesCalcInfo[24] // 营业成本
      const sds25 = arrTaxesCalcInfo[25] // 税金及附加
      const sds26 = arrTaxesCalcInfo[26] // 销售费用
      const sds27 = arrTaxesCalcInfo[27] // 管理费用
      const sds28 = arrTaxesCalcInfo[28] // 财务费用
      const sds29 = arrTaxesCalcInfo[29] // 营业利润
      const sds30 = arrTaxesCalcInfo[30] // 纳税调整增加额
      const sds31 = arrTaxesCalcInfo[31] // 销售未完工产品的收入
      const sds32 = arrTaxesCalcInfo[32] // 销售未完工产品预毛利额
      const sds33 = arrTaxesCalcInfo[33] // 实际发生的增值税附加、土地增值税
      const sds34 = arrTaxesCalcInfo[34] // 纳税调整减少额
      const sds35 = arrTaxesCalcInfo[35] // 销售未完工产品转完工产品确认的销售收入
      const sds36 = arrTaxesCalcInfo[36] // 转回的销售未完工产品预计毛利额
      const sds37 = arrTaxesCalcInfo[37] // 转回实际发生的增值税附加、土地增值税
      const sds38 = arrTaxesCalcInfo[38] // 纳税调整后所得
      const sds39 = arrTaxesCalcInfo[39] // 弥补以前年度亏损（以负数体现）
      const sds40 = arrTaxesCalcInfo[40] // 应纳税所得额
      const sds41 = arrTaxesCalcInfo[41] // 应纳税所得额25%
      const sds42 = arrTaxesCalcInfo[42] // 应纳所得税额
      const sds43 = arrTaxesCalcInfo[43] // 减：本年累计实际已缴纳的所得税额
      const sds44 = arrTaxesCalcInfo[44] // 六、本年应补（退）所得税额
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
      this.calcOperations(29, calcRule, arrTaxesCalcInfo)
      // let sum = 0
      // // 营业利润
      // sds29.datas.forEach((datasitem, index) => {
      //   const sds23Taxes = sds23.datas[index].taxes ? sds23.datas[index].taxes : 0
      //   const sds24Taxes = sds24.datas[index].taxes ? sds24.datas[index].taxes : 0
      //   const sds25Taxes = sds25.datas[index].taxes ? sds25.datas[index].taxes : 0
      //   const sds26Taxes = sds26.datas[index].taxes ? sds26.datas[index].taxes : 0
      //   const sds27Taxes = sds27.datas[index].taxes ? sds27.datas[index].taxes : 0
      //   const sds28Taxes = sds28.datas[index].taxes ? sds28.datas[index].taxes : 0
      //   datasitem.taxes = sds23Taxes - sds24Taxes - sds25Taxes - sds26Taxes - sds27Taxes - sds28Taxes
      //   if (datasitem.taxes) {
      //     sum = sum + datasitem.taxes
      //   }
      // })
      // sds29.sumTaxes = sum

      // 销售未完工产品预毛利额
      calcRule = [
        { index: 31, type: '+', value: 0 },
        { index: 32, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcOperations(33, calcRule, arrTaxesCalcInfo)
      // 销售未完工产品预毛利额
      // sum = 0
      // sds32.forEach((datasitem, index) => {
      //   const sds31Taxes = sds31.datas[index].taxes ? sds31.datas[index].taxes : 0
      //   // const sds33Taxes = sds24.datas[index].taxes ? sds33.datas[index].taxes : 0
      //   // datasitem.taxes = sds32Taxes - sds33Taxes
      //   // if (datasitem.taxes) {
      //   //   sum = sum + datasitem.taxes
      //   // }
      // })
      // sds32.sumTaxes = sum

      // 纳税调整增加额
      calcRule = [
        { index: 33, type: '+', value: 0 },
        { index: 34, type: '-', value: 0 },
      ]
      this.calcOperations(30, calcRule, arrTaxesCalcInfo)
      // sum = 0
      // sds30.forEach((datasitem, index) => {
      //   const sds32Taxes = sds32.datas[index].taxes ? sds32.datas[index].taxes : 0
      //   const sds33Taxes = sds33.datas[index].taxes ? sds33.datas[index].taxes : 0
      //   datasitem.taxes = sds32Taxes - sds33Taxes
      //   if (datasitem.taxes) {
      //     sum = sum + datasitem.taxes
      //   }
      // })
      // sds30.sumTaxes = sum

      // 销售未完工产品预毛利额
      calcRule = [
        { index: 36, type: '+', value: 0 },
        { index: 37, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcOperations(38, calcRule, arrTaxesCalcInfo)
      // sum = 0
      // sds36.forEach((datasitem, index) => {
      //   const sds35Taxes = sds35.datas[index].taxes ? sds35.datas[index].taxes : 0
      //   // const sds33Taxes = sds24.datas[index].taxes ? sds33.datas[index].taxes : 0
      //   // datasitem.taxes = sds32Taxes - sds33Taxes
      //   // if (datasitem.taxes) {
      //   //   sum = sum + datasitem.taxes
      //   // }
      // })
      // sds36.sumTaxes = sum

      // 纳税调整减少额
      calcRule = [
        { index: 38, type: '+', value: 0 },
        { index: 39, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcOperations(35, calcRule, arrTaxesCalcInfo)
      // sum = 0
      // sds34.forEach((datasitem, index) => {
      //   const sds36Taxes = sds36.datas[index].taxes ? sds36.datas[index].taxes : 0
      //   const sds37Taxes = sds37.datas[index].taxes ? sds37.datas[index].taxes : 0
      //   datasitem.taxes = sds36Taxes - sds37Taxes
      //   if (datasitem.taxes) {
      //     sum = sum + datasitem.taxes
      //   }
      // })
      // sds34.sumTaxes = sum
      // 转回的销售未完工产品预计毛利额
      calcRule = [
        { index: 38, type: '+', value: 0 },
        { index: 39, type: '*', value: 0 },
        { index: null, type: '/', value: 100 },
      ]
      this.calcOperations(35, calcRule, arrTaxesCalcInfo)
      // 所得税小计
      calcRule = [
        { index: 21, type: '+', value: 0 },
        { index: 22, type: '+', value: 0 },
      ]
      this.calcOperations(20, calcRule, arrTaxesCalcInfo)
      // sum = 0
      // sdsXj.datas.forEach((datasitem, index) => {
      //   // const xsbdcTaxes = xsbdc.datas[index].taxes ? xsbdc.datas[index].taxes : 0
      //   const sdsYjTaxes = sdsYj.datas[index].taxes ? sdsYj.datas[index].taxes : 0
      //   const sdsQjTaxes = sdsQj.datas[index].taxes ? sdsQj.datas[index].taxes : 0
      //   datasitem.taxes = sdsYjTaxes + sdsQjTaxes
      //   if (datasitem.taxes) {
      //     sum = sum + datasitem.taxes
      //   }
      // })
      // sdsXj.sumTaxes = sum
    },
    calcRow(result, calcRule, calcData) {
      let sum = 0
      let calcValue = 0
      calcData.datas.forEach((datasitem, index) => {
        calcRule.forEach(ruleitem => {
          if (ruleitem.index) {
            ruleitem.vaule = calcData[ruleitem.index][index].taxes ? calcData[ruleitem.index][index].taxes : 0
          }
          calcValue = this.calcOperations(calcValue, ruleitem.type, ruleitem.value)
        })
        datasitem.taxes = calcValue
        if (datasitem.taxes) {
          sum = sum + datasitem.taxes
        }
      })
      calcData.sumTaxes = sum
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
        if (index > 1) {
          item.datas.forEach(datasitem => {
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, result[`${datasitem.year}_${datasitem.quarterOrMonth}`] && datasitem.contractPrice ? (result[`${datasitem.year}_${datasitem.quarterOrMonth}`] + datasitem.contractPrice) : datasitem.contractPrice)
          })
        }
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
