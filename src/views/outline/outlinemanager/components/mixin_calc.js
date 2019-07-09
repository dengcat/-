/**
 * 处理联动计算
 */
import { mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import { treeToArrayNoParent } from '@/utils'
import numeral from 'numeral'
import { myNumeral, IRRCalc } from './util'

export default {
  methods: {
    // #region 成本分摊
    calcCbft() {
      const mpiCostAllocationInfo = cloneDeep(this.mpiCostAllocationInfo)
      const arrMpiCostAllocationInfo = treeToArrayNoParent(mpiCostAllocationInfo)
      const arrMpiSectionPlanInfo = treeToArrayNoParent(this.mpiSectionPlanInfo)
      arrMpiCostAllocationInfo.forEach(item => {
        // 合计成本 标段总建筑面积/总建筑面积*目标成本
        const dtcb = myNumeral(item.dynamicCost).value()
        let totalCost = 0
        let totalSalePrice = 0

        // 住宅、公建可售面积
        let zzSale = 0
        let gjSale = 0
        let kzSale = 0
        let zsdf = 0
        arrMpiSectionPlanInfo.forEach(secitem => {
          if (secitem.sectionName === item.sectionName && secitem.parentProductType === '住宅') {
            zzSale = myNumeral(zzSale).add(secitem.saleArea).value()
          }
          if (secitem.sectionName === item.sectionName && secitem.parentProductType === '商业') {
            gjSale = myNumeral(gjSale).add(secitem.saleArea).value()
          }
          if (secitem.sectionName === item.sectionName) {
            kzSale = myNumeral(kzSale).add(secitem.landArea).value()
          }
        })
        zsdf = myNumeral(zzSale).add(gjSale).add(kzSale).value()

        item.datas.forEach(datasitem => {
          if (item.costName !== '主体土建及安装工程' && item.costName !== '装修工程') {
            const cprow = arrMpiSectionPlanInfo.find(cpitem => cpitem.sectionName === item.sectionName && cpitem.productGuid === datasitem.productGuid)
            if (cprow) {
              // 可售面积
              const cpSaleArea = myNumeral(cprow.saleArea).value()
              // 可租面积
              const cpLandArea = myNumeral(cprow.landArea).value()
              // 地上可售面积
              const upperSaleArea = myNumeral(this.mpiBasicPlanInfo.upperSaleArea).value()
              // 可租面积
              const totalLandArea = myNumeral(this.mpiBasicPlanInfo.totalLandArea).value()
              const total = myNumeral(upperSaleArea).add(totalLandArea).value()
              datasitem.productTypeCost = total ? myNumeral(cpSaleArea).add(cpLandArea).divide(total).multiply(dtcb).value() : 0
              datasitem.productTypeSalePrice = myNumeral(datasitem.productTypeCost).divide(cpSaleArea).multiply(10000).value()
            }
          }
          totalCost = myNumeral(totalCost).add(myNumeral(datasitem.productTypeCost).value()).value()
        })

        if (item.costName === '土地费') {
          const bdrow = this.mpiSectionPlanInfo.find(planitem => item.sectionName === planitem.sectionName)
          const bdjsydmj = myNumeral(bdrow.buildTerraArea).value()
          const zjsydmj = myNumeral(this.mpiBasicPlanInfo.totalBldArea).value()
          totalCost = zjsydmj ? myNumeral(bdjsydmj).divide(zjsydmj).multiply(dtcb).value() : 0
        }
        // 可售单方 合计-可租售单方（财务）元/平米：该标段的合计成本/该标段下（住宅可售面积小计+公建可售面积小计+可租面积合计）*10000；
        totalSalePrice = zsdf ? myNumeral(totalCost).divide(zsdf).multiply(10000).value() : 0
        item.totalCost = totalCost
        item.totalSalePrice = totalSalePrice
        item.datas.forEach(ditem => {
          ditem.totalCost = totalCost
          ditem.totalSalePrice = totalSalePrice
        })
      })
      const jzazgcfrows = arrMpiCostAllocationInfo.filter(item => item.costName === '建筑安装工程费')
      jzazgcfrows.forEach(item => {
        // 住宅、公建可售面积
        let zzSale = 0
        let gjSale = 0
        let kzSale = 0
        let zsdf = 0
        arrMpiSectionPlanInfo.forEach(secitem => {
          if (secitem.sectionName === item.sectionName && secitem.parentProductType === '住宅') {
            zzSale = myNumeral(zzSale).add(myNumeral(secitem.saleArea).value()).value()
          }
          if (secitem.sectionName === item.sectionName && secitem.parentProductType === '商业') {
            gjSale = myNumeral(gjSale).add(myNumeral(secitem.saleArea).value()).value()
          }
          if (secitem.sectionName === item.sectionName) {
            kzSale = myNumeral(kzSale).add(myNumeral(secitem.landArea).value()).value()
          }
        })
        zsdf = myNumeral(zzSale).add(gjSale).add(kzSale).value()

        let totalCost = 0
        let totalSalePrice = 0
        arrMpiCostAllocationInfo.forEach(citem => {
          if (citem.sectionName === item.sectionName && (citem.costName === '地基处理费' || citem.costName === '主体土建及安装工程' || citem.costName === '装修工程')) {
            totalCost = myNumeral(totalCost).add(myNumeral(citem.totalCost).value()).value()
          }
        })
        totalSalePrice = zsdf ? myNumeral(totalCost).divide(zsdf).multiply(10000).value() : 0
        item.totalCost = totalCost
        item.totalSalePrice = totalSalePrice
        item.datas.forEach((datasitem, index) => {
          datasitem.totalCost = totalCost
          datasitem.totalSalePrice = totalSalePrice
          let saleArea = 0
          let productTypeCost = 0
          let productTypeSalePrice = 0
          // // 可售面积
          const cp = arrMpiSectionPlanInfo.find(item => item.sectionName === datasitem.sectionName && item.productGuid === datasitem.productGuid)
          if (cp) {
            saleArea = cp.saleArea
          }
          arrMpiCostAllocationInfo.forEach(allitem => {
            if (allitem.sectionName === item.sectionName && (allitem.costName === '地基处理费' || allitem.costName === '主体土建及安装工程' || allitem.costName === '装修工程')) {
              productTypeCost = myNumeral(productTypeCost).add(myNumeral(allitem.datas[index].productTypeCost).value()).value()
            }
          })
          productTypeSalePrice = saleArea ? myNumeral(productTypeCost).divide(saleArea).value() : 0
          datasitem.productTypeSalePrice = productTypeSalePrice
          datasitem.productTypeCost = productTypeCost
        })
      })
      return mpiCostAllocationInfo
    },
    // #endregion
    // #region 货值标段
    calcHzbd() {
      // const arr = [-17243, -1751, -157, -4112, -7555, 710, 11484, 13311, 10318, 8993, 5740, 7299, 1743, 139, -3472, 785, -10952, -964, -111, -2, -4, 3826]
      // console.log('IRR', Math.pow(myNumeral(1).add(myNumeral(IRRCalc(arr)).divide(100).value()).value(), 4) - 1)
      const mpiSupplySectionInfo = cloneDeep(this.mpiSupplySectionInfo)
      const arrMpiSupplySectionInfo = treeToArrayNoParent(mpiSupplySectionInfo)
      try {
        arrMpiSupplySectionInfo.forEach(item => {
          if (!item.productGuid) {
            // 标段
            const hzldbd = this.hzld.find(hzlditem => {
              return hzlditem.sectionName === item.sectionName
            })
            item.datas.forEach((datasitem, index) => {
              datasitem.ghmjValue = hzldbd.datas[index].ghmjValue
              datasitem.ghjeValue = hzldbd.datas[index].ghjeValue
              datasitem.totalArea = hzldbd.totalArea
              datasitem.totalPrice = hzldbd.totalPrice
              datasitem.totalAvgPrice = hzldbd.totalAvgPrice
            })
            item.totalArea = hzldbd.totalArea
            item.totalPrice = hzldbd.totalPrice
            item.totalAvgPrice = hzldbd.totalAvgPrice
          } else {
            // 产品
            const hzldcps = this.hzld.filter(hzlditem => {
              return hzlditem.sectionName === item.sectionName && hzlditem.productGuid === item.productGuid
            })
            const result = {}
            hzldcps.forEach((item, index) => {
              item.datas.forEach(datasitem => {
                const ghmjValue = myNumeral(result[`ghmjValue_${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.ghmjValue).value()).value()
                const ghjeValue = myNumeral(result[`ghjeValue_${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.ghjeValue).value()).value()
                this.$set(result, `ghmjValue_${datasitem.year}_${datasitem.quarterOrMonth}`, ghmjValue)
                this.$set(result, `ghjeValue_${datasitem.year}_${datasitem.quarterOrMonth}`, ghjeValue)
              })
            })
            let totalArea = 0
            let totalPrice = 0
            item.datas.forEach(datasitem => {
              if (result[`ghmjValue_${datasitem.year}_${datasitem.quarterOrMonth}`]) {
                datasitem.ghmjValue = result[`ghmjValue_${datasitem.year}_${datasitem.quarterOrMonth}`]
                totalArea = myNumeral(result[`ghmjValue_${datasitem.year}_${datasitem.quarterOrMonth}`]).add(totalArea).value()
              } else {
                datasitem.ghmjValue = 0
              }

              if (result[`ghjeValue_${datasitem.year}_${datasitem.quarterOrMonth}`]) {
                datasitem.ghjeValue = result[`ghjeValue_${datasitem.year}_${datasitem.quarterOrMonth}`]
                totalPrice = myNumeral(result[`ghjeValue_${datasitem.year}_${datasitem.quarterOrMonth}`]).add(totalPrice).value()
              } else {
                datasitem.ghjeValue = 0
              }
            })
            item.datas.forEach(datasitem => {
              datasitem.totalArea = totalArea
              datasitem.totalPrice = totalPrice
              datasitem.totalAvgPrice = totalArea ? myNumeral(totalPrice).divide(totalArea).value() : 0
            })
            item.totalArea = totalArea
            item.totalPrice = totalPrice
            item.totalAvgPrice = totalArea ? myNumeral(totalPrice).divide(totalArea).value() : 0
          }
        })

        return mpiSupplySectionInfo
      } catch (ex) {
        console.log('mpiSupplySectionInfo', ex)
        return mpiSupplySectionInfo
      }
    },
    // #endregion
    // #region 税金
    // 税金计算
    calcTax() {
      // 克隆一个税金
      const taxesCalcInfo = cloneDeep(this.mpiTaxesCalcInfo)
      const arrTaxesCalcInfo = treeToArrayNoParent(taxesCalcInfo)
      try {
      // // 计算增值税
      // this.calcZzs(arrTaxesCalcInfo)
      // // 计算土地增值税
      // this.calcTdzzs(arrTaxesCalcInfo)
      // // 计算印花税
      // this.calcYhs(arrTaxesCalcInfo)
      // // 计算所得税
      // this.calcSds(arrTaxesCalcInfo)
      } catch (ex) {
        return taxesCalcInfo
      }
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
        const marketingCostData = this.mpiMarketingCostInfoTotal[`${datasitem.year}_${datasitem.quarterOrMonth}`]
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
          datasitem.taxes = numeral(returnPlanInfo).divide(1.1).multiply(datasitem.rate).divide(100).value()
        }

        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          zzsYjSum = zzsYjSum + datasitem.taxes
        }
      })
      // 计算小计
      this.calcTotal(zzsYj, 'taxes', 'sumTaxes')

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
      zzsHj.datas.forEach(item => {
        item.sumTaxes = zzsSum
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

      //  增值税及附加小计
      let calcRule = [
        { index: 4, type: '+', value: 0 },
        { index: 5, type: '+', value: 0 },
      ]
      this.calcRow(0, calcRule, arrTaxesCalcInfo)

      //  土地增值税小计
      calcRule = [
        { index: 10, type: '+', value: 0 },
        { index: 11, type: '+', value: 0 },
      ]
      this.calcRow(6, calcRule, arrTaxesCalcInfo)
    },

    calcTdzzs(arrTaxesCalcInfo) {
      const calcRule = [
        { index: 7, type: '+', value: 0 },
        { index: 8, type: '+', value: 0 },
        { index: 9, type: '+', value: 0 },
      ]
      this.calcRow(10, calcRule, arrTaxesCalcInfo)
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
          datasitem.taxes = numeral(returnPlanInfoData).divide(1.1).multiply(datasitem.rate).divide(100).value()
        } else {
          datasitem.taxes = 0
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
        const xsbdcTaxes = xsbdc.datas[index].taxes ? xsbdc.datas[index].taxes : 0
        datasitem.taxes = jzazhtTaxes + jkhtTaxes + qtTaxes + xsbdcTaxes
        if (datasitem.taxes && datasitem.year.indexOf('小计') < 0) {
          sum = sum + datasitem.taxes
        }
      })
      yhshj.datas.forEach(item => {
        item.sumTaxes = sum
      })
      yhshj.sumTaxes = sum
    },
    // 计算所得税
    calcSds(arrTaxesCalcInfo) {
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
        { index: 39, type: '-', value: 0 },
      ]
      this.calcRow(35, calcRule, arrTaxesCalcInfo)
      // // 纳税调整减少额
      // calcRule = [
      //   { index: 38, type: '+', value: 0 },
      //   { index: 39, type: '*', value: 0 },
      //   { index: null, type: '/', value: 100 },
      // ]
      // this.calcRow(35, calcRule, arrTaxesCalcInfo)
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
      // 企业所得税汇算清缴：本年应补（退）所得税额，当该值为负数时，默认为0；
      // this.calcRow(22, calcRule, arrTaxesCalcInfo)

      // 所得税小计
      calcRule = [
        { index: 21, type: '+', value: 0 },
        { index: 22, type: '+', value: 0 },
      ]
      this.calcRow(20, calcRule, arrTaxesCalcInfo)
    },
    // #endregion
    // #region 土地增值税清算表
    calcTdzzsqs() {
      const landValueTaxCalcInfo = cloneDeep(this.mpiLandValueTaxCalcInfo)
      try {
        // 期间费用（销售、管理费用）：对应合计、普通住宅、普通标准以上住宅、非住宅类的总开发成本*5%；
        landValueTaxCalcInfo[3].sumTax = this.calcOperations(landValueTaxCalcInfo[2].sumTax, '*', '0.05').value()
        landValueTaxCalcInfo[3].ordinaryHouse = this.calcOperations(landValueTaxCalcInfo[2].ordinaryHouse, '*', '0.05').value()
        landValueTaxCalcInfo[3].house = this.calcOperations(landValueTaxCalcInfo[2].house, '*', '0.05').value()
        landValueTaxCalcInfo[3].unHouse = this.calcOperations(landValueTaxCalcInfo[2].unHouse, '*', '0.05').value()
        // 利息支出
        landValueTaxCalcInfo[4].sumTax = myNumeral(landValueTaxCalcInfo[2].sumTax).multiply(0.05).value()
        landValueTaxCalcInfo[4].ordinaryHouse = myNumeral(landValueTaxCalcInfo[4].sumTax).divide(myNumeral(landValueTaxCalcInfo[0].sumTax).value()).multiply(myNumeral(landValueTaxCalcInfo[0].ordinaryHouse).value()).value()
        landValueTaxCalcInfo[4].house = myNumeral(landValueTaxCalcInfo[4].sumTax).divide(myNumeral(landValueTaxCalcInfo[0].sumTax).value()).multiply(myNumeral(landValueTaxCalcInfo[0].house).value()).value()
        landValueTaxCalcInfo[4].unHouse = myNumeral(landValueTaxCalcInfo[4].sumTax).divide(myNumeral(landValueTaxCalcInfo[0].sumTax).value()).multiply(myNumeral(landValueTaxCalcInfo[0].unHouse).value()).value()

        // 6、转让房地产有关的税金：
        // （1）合计：税金计算表中增值税附件合计值；
        // （2）普通住宅、普通标准以上住宅、非住宅类：对应住宅类型的销售额/销售额合计*转让房地产有关的税金合计；
        landValueTaxCalcInfo[5].sumTax = myNumeral(this.mpiTaxesCalcInfo[4].sumTaxes).value()
        landValueTaxCalcInfo[5].ordinaryHouse = myNumeral(landValueTaxCalcInfo[1].ordinaryHouse).divide(myNumeral(landValueTaxCalcInfo[1].sumTax).value()).multiply(myNumeral(landValueTaxCalcInfo[5].sumTax).value()).value()
        landValueTaxCalcInfo[5].house = myNumeral(landValueTaxCalcInfo[1].house).divide(myNumeral(landValueTaxCalcInfo[1].sumTax).value()).multiply(myNumeral(landValueTaxCalcInfo[5].sumTax).value()).value()
        landValueTaxCalcInfo[5].unHouse = myNumeral(landValueTaxCalcInfo[1].unHouse).divide(myNumeral(landValueTaxCalcInfo[1].sumTax).value()).multiply(myNumeral(landValueTaxCalcInfo[5].sumTax).value()).value()
        //  7、总开发成本加计20%扣除：
        // （1）合计：总开发成本（不含资本化利息）*20%；
        // （2）普通住宅、普通标准以上住宅、非住宅类：对应普通住宅、普通标准以上住宅、非住宅类的总开发成本*20%；
        landValueTaxCalcInfo[6].sumTax = myNumeral(landValueTaxCalcInfo[2].sumTax).multiply(0.2).value()
        landValueTaxCalcInfo[6].ordinaryHouse = myNumeral(landValueTaxCalcInfo[2].ordinaryHouse).multiply(0.2).value()
        landValueTaxCalcInfo[6].house = myNumeral(landValueTaxCalcInfo[2].house).multiply(0.2).value()
        landValueTaxCalcInfo[6].unHouse = myNumeral(landValueTaxCalcInfo[2].unHouse).multiply(0.2).value()

        //  8、可扣除项目总和：
        // （1）合计：对应的合计总开发成本（不含资本化利息）+期间费用（销售、管理费用）+利息支出+转让房地产有关的税金+总开发成本加计20%扣除；
        // （2）普通住宅、普通标准以上住宅、非住宅类：对应类型总开发成本+期间费用+利息支出+转让房地产有关的税金+总开发成本加计20%扣除之和；
        landValueTaxCalcInfo[7].sumTax = myNumeral(landValueTaxCalcInfo[2].sumTax).add(landValueTaxCalcInfo[3].sumTax).add(landValueTaxCalcInfo[4].sumTax).add(landValueTaxCalcInfo[5].sumTax).add(landValueTaxCalcInfo[6].sumTax).value()
        landValueTaxCalcInfo[7].ordinaryHouse = myNumeral(landValueTaxCalcInfo[2].ordinaryHouse).add(landValueTaxCalcInfo[3].ordinaryHouse).add(landValueTaxCalcInfo[4].ordinaryHouse).add(landValueTaxCalcInfo[5].ordinaryHouse).add(landValueTaxCalcInfo[6].ordinaryHouse).value()
        landValueTaxCalcInfo[7].house = myNumeral(landValueTaxCalcInfo[2].house).add(landValueTaxCalcInfo[3].house).add(landValueTaxCalcInfo[4].house).add(landValueTaxCalcInfo[5].house).add(landValueTaxCalcInfo[6].house).value()
        landValueTaxCalcInfo[7].unHouse = myNumeral(landValueTaxCalcInfo[2].unHouse).add(landValueTaxCalcInfo[3].unHouse).add(landValueTaxCalcInfo[4].unHouse).add(landValueTaxCalcInfo[5].unHouse).add(landValueTaxCalcInfo[6].unHouse).value()
      //   9、增值额：
      // （1）合计：销售额（不含增值税）合计-可扣除项目总和合计；
      // （2）普通住宅、普通标准以上住宅、非住宅类：
        landValueTaxCalcInfo[8].sumTax = myNumeral(landValueTaxCalcInfo[1].sumTax).subtract(landValueTaxCalcInfo[7].sumTax).value()
        landValueTaxCalcInfo[8].ordinaryHouse = myNumeral(landValueTaxCalcInfo[1].ordinaryHouse).subtract(landValueTaxCalcInfo[7].ordinaryHouse).value()
        landValueTaxCalcInfo[8].house = myNumeral(landValueTaxCalcInfo[1].house).subtract(landValueTaxCalcInfo[7].house).value()
        landValueTaxCalcInfo[8].unHouse = myNumeral(landValueTaxCalcInfo[1].unHouse).subtract(landValueTaxCalcInfo[7].unHouse).value()
        // 10、增值率：
        // （1）合计：增值额合计/可扣除项目总和合计；
        // （2）普通住宅、普通标准以上住宅、非住宅类：对应普通住宅、普通标准以上住宅、非住宅类的增值额/可扣除项目总和；
        landValueTaxCalcInfo[9].sumTax = landValueTaxCalcInfo[7].sumTax === 0 ? 0 : myNumeral(landValueTaxCalcInfo[8].sumTax).divide(landValueTaxCalcInfo[7].sumTax).multiply(100).value()
        landValueTaxCalcInfo[9].ordinaryHouse = landValueTaxCalcInfo[7].ordinaryHouse === 0 ? 0 : myNumeral(landValueTaxCalcInfo[8].ordinaryHouse).divide(landValueTaxCalcInfo[7].ordinaryHouse).multiply(100).value()
        landValueTaxCalcInfo[9].house = landValueTaxCalcInfo[7].house === 0 ? 0 : myNumeral(landValueTaxCalcInfo[8].house).divide(landValueTaxCalcInfo[7].house).multiply(100).value()
        landValueTaxCalcInfo[9].unHouse = landValueTaxCalcInfo[7].unHouse === 0 ? 0 : myNumeral(landValueTaxCalcInfo[8].unHouse).divide(landValueTaxCalcInfo[7].unHouse).multiply(100).value()
      //   11、税率：
      // （1）对应的普通住宅：当增值率≤20%，则税率对应为0，当20%＜增值率≤50%，则税率对应为30%，当50%＜增值率≤100%，则税率对应为40%，当100%＜增值率≤200%，则税率对应为50%，当增值率＞200%，则税率对应为60%；
      // （2）对应的普通标准以上住宅、非住宅类：当增值率≤0%，则税率对应为0，当0%＜增值率≤50%，则税率对应为30%，当50%＜增值率≤100%，则税率对应为40%，当100%＜增值率≤200%，则税率对应为50%，当增值率＞200%，则税率对应为60%；
      landValueTaxCalcInfo[10].ordinaryHouse = this.ptzzsl(landValueTaxCalcInfo[9].ordinaryHouse, 'pt')
      landValueTaxCalcInfo[10].house = this.ptzzsl(landValueTaxCalcInfo[9].house, 'fpt')
      landValueTaxCalcInfo[10].unHouse = this.ptzzsl(landValueTaxCalcInfo[9].unHouse, 'fpt')

      // 12、速算扣除系数：
      // （1）对应的普通住宅：当增值率≤50%，则速算扣除系数对应为0，当50%＜增值率≤100%，则速算扣除系数对应为5%，当100%＜增值率≤200%，则速算扣除系数对应为15%，当增值率＞200%，则速算扣除系数对应为35%；
      // （2）对应的普通标准以上住宅、非住宅类：当增值率≤50%，则速算扣除系数对应为0，当50%＜增值率≤100%，则速算扣除系数对应为5%，当100%＜增值率≤200%，则速算扣除系数对应为15%，当增值率＞200%，则速算扣除系数对应为35%；
      landValueTaxCalcInfo[11].ordinaryHouse = this.ptzzxs(landValueTaxCalcInfo[9].ordinaryHouse, 'pt')
      landValueTaxCalcInfo[11].house = this.ptzzxs(landValueTaxCalcInfo[9].house, 'fpt')
      landValueTaxCalcInfo[11].unHouse = this.ptzzxs(landValueTaxCalcInfo[9].unHouse, 'fpt')
      //   13、可扣除金额：
      // （1）合计：普通住宅+普通标准以上住宅+非住宅类的可扣除金额；
      // （2）普通住宅、普通标准以上住宅、非住宅类的速算扣除系数*可扣除项目总和；
      landValueTaxCalcInfo[12].ordinaryHouse = myNumeral(landValueTaxCalcInfo[11].ordinaryHouse).multiply(landValueTaxCalcInfo[7].ordinaryHouse).divide(100).value()
      landValueTaxCalcInfo[12].house = myNumeral(landValueTaxCalcInfo[11].house).multiply(landValueTaxCalcInfo[7].house).divide(100).value()
      landValueTaxCalcInfo[12].unHouse = myNumeral(landValueTaxCalcInfo[11].unHouse).multiply(landValueTaxCalcInfo[7].unHouse).divide(100).value()
      landValueTaxCalcInfo[12].sumTax = myNumeral(landValueTaxCalcInfo[12].ordinaryHouse).add(landValueTaxCalcInfo[12].house).add(landValueTaxCalcInfo[12].unHouse).value()
      // 14、应付土地增值税额：
      // （1）合计：普通住宅+普通标准以上住宅+非住宅类的应付土地增值税额之和；
      // （2）普通住宅、普通标准以上住宅、非住宅类：增值额*税率-可扣除金额；
      landValueTaxCalcInfo[13].ordinaryHouse = myNumeral(landValueTaxCalcInfo[8].ordinaryHouse).multiply(landValueTaxCalcInfo[10].ordinaryHouse).divide(100).subtract(landValueTaxCalcInfo[12].ordinaryHouse).value()
      landValueTaxCalcInfo[13].house = myNumeral(landValueTaxCalcInfo[8].house).multiply(landValueTaxCalcInfo[10].house).divide(100).subtract(landValueTaxCalcInfo[12].house).value()
      landValueTaxCalcInfo[13].unHouse = myNumeral(landValueTaxCalcInfo[8].unHouse).multiply(landValueTaxCalcInfo[10].unHouse).divide(100).subtract(landValueTaxCalcInfo[12].unHouse).value()
      landValueTaxCalcInfo[13].sumTax = myNumeral(landValueTaxCalcInfo[13].ordinaryHouse).add(landValueTaxCalcInfo[13].house).add(landValueTaxCalcInfo[13].unHouse).value()
    } catch (ex) {
        return landValueTaxCalcInfo
      }
        return landValueTaxCalcInfo
    },
    ptzzsl(val, type) {
      if (type === 'pt') {
        if (val <= 20) {
          return 0
        } else if (val > 20 && val < 50) {
          return 30
        } else if (val > 50 && val <= 100) {
          return 40
        } else if (val > 100 && val <= 200) {
          return 50
        } else if (val > 200) {
          return 60
        }
      } else {
        if (val <= 0) {
          return 0
        } else if (val > 0 && val <= 50) {
          return 30
        } else if (val > 50 && val <= 100) {
          return 40
        } else if (val > 100 && val <= 200) {
          return 50
        } else if (val > 200) {
          return 60
        }
      }
    },
    ptzzxs(val, type) {
      if (type === 'pt') {
        if (val <= 50) {
          return 0
        } else if (val > 50 && val <= 100) {
          return 5
        } else if (val > 100 && val <= 200) {
          return 15
        } else if (val > 200) {
          return 35
        }
      } else {
        if (val <= 50) {
          return 0
        } else if (val > 50 && val <= 100) {
          return 5
        } else if (val > 100 && val <= 200) {
          return 15
        } else if (val > 200) {
          return 35
        }
      }
    },
    // #endregion
    // #region 项目现金流
    calcXmxjl() {
      const cashFlowCalc = cloneDeep(this.mpiCashFlowCalcInfo)
      const arrCashFlowCalc = treeToArrayNoParent(cashFlowCalc)
      try {
      // 开发成本、管理费用、营销费用、财务费用
      this.calcRowOther(arrCashFlowCalc[1], this.mpiCostPayPlanTotal, 'cashFlow', 'sumCashFlow')
      // 管理费用
      this.calcRowOther(arrCashFlowCalc[2], this.mpiManageMentCostInfoValueTotal, 'cashFlow', 'sumCashFlow')
      // 营销费用
      this.calcRowOther(arrCashFlowCalc[3], this.mpiMarketingCostInfoValueTotal, 'cashFlow', 'sumCashFlow')
      // 财务费用
      this.calcRowOther(arrCashFlowCalc[4], this.mpiFinancingCalcInfoTotal, 'cashFlow', 'sumCashFlow')
      // 税金
      this.calcRowOther(arrCashFlowCalc[5], this.mpiTaxesCalcInfoTotal, 'cashFlow', 'sumCashFlow')
      // 现金流出
      let calcRule = [
        { index: 1, type: '+', value: 0 },
        { index: 2, type: '+', value: 0 },
        { index: 3, type: '+', value: 0 },
        { index: 4, type: '+', value: 0 },
        { index: 5, type: '+', value: 0 },
      ]
      this.calcRow(0, calcRule, arrCashFlowCalc, 'cashFlow', 'sumCashFlow')
      // 销售回款
      this.calcRowOther(arrCashFlowCalc[7], this.mpiReturnPlanInfoTotal, 'cashFlow', 'sumCashFlow')
      // 现金流入
      calcRule = [
        { index: 7, type: '+', value: 0 },
        { index: 8, type: '+', value: 0 },
      ]
      this.calcRow(6, calcRule, arrCashFlowCalc, 'cashFlow', 'sumCashFlow')
      // 经营性现金流
      calcRule = [
        { index: 6, type: '+', value: 0 },
        { index: 0, type: '-', value: 0 },
      ]
      this.calcRow(9, calcRule, arrCashFlowCalc, 'cashFlow', 'sumCashFlow')
      // 融资贷款收入
      this.calcRowOther(arrCashFlowCalc[11], this.mpiFinancingBalanceInfoTkTotal, 'cashFlow', 'sumCashFlow')
      // 融资贷款支出
      this.calcRowOther(arrCashFlowCalc[12], this.mpiFinancingBalanceInfoHkTotal, 'cashFlow', 'sumCashFlow')
      // 融资经营性现金流
      calcRule = [
        { index: 9, type: '+', value: 0 },
        { index: 11, type: '+', value: 0 },
        { index: 12, type: '-', value: 0 },
      ]
      this.calcRow(13, calcRule, arrCashFlowCalc, 'cashFlow', 'sumCashFlow')
      // 融资经营性现金流（扣除溢价）
      calcRule = [
        { index: 13, type: '+', value: 0 },
        { index: 15, type: '-', value: 0 },
      ]
      this.calcRow(16, calcRule, arrCashFlowCalc, 'cashFlow', 'sumCashFlow')

      // 累计经营性现金流：本年度或季度的累计经营性现金流=上一年度或季度累计经营性现金流+本年度或季度经营性现金流；该年度前累计已发生：取对应的经营性现金流数值；
      this.calcLj(arrCashFlowCalc[10], arrCashFlowCalc[9], 'cashFlow', 'sumCashFlow')
      // 累计现金流（含融资）：本年度或季度的累计现金流=上一年度或季度累计现金流（含融资）+本年度或季度的融资经营性现金流；该年度前累计已发生：取对应的融资经营性现金流数值
      this.calcLj(arrCashFlowCalc[14], arrCashFlowCalc[13], 'cashFlow', 'sumCashFlow')
      // 18）累计现金流（含溢价）：上一年或季度累计现金流（含溢价）+本年度或季度的融资经营性现金流，该年度前累计已发生：取对应的累计现金流（含溢价）数值；
      this.calcLj(arrCashFlowCalc[17], arrCashFlowCalc[16], 'cashFlow', 'sumCashFlow')
      // 股东借款利息（年利率按20%计算）
      // arrCashFlowCalc[18].sumCashFlow =
    } catch (ex) {
      return cashFlowCalc
    }
    return cashFlowCalc
    },
    // 计算累计
    calcLj(row, datarow, key, sumKey) {
      row.datas.forEach((item, index) => {
        if (index === 0) {
          item[key] = datarow.datas[index][key]
        } else {
          if (row.datas[index].year.indexOf('小计') < 0 && row.datas[index - 1].year.indexOf('小计') >= 0) {
            item[key] = myNumeral(datarow.datas[index][key]).value()
          } else {
            item[key] = myNumeral(datarow.datas[index][key]).add(myNumeral(row.datas[index - 1][key]).value()).value()
          }
        }
      })
      row[sumKey] = datarow[sumKey]
      row.datas.forEach(item => {
        item[sumKey] = datarow[sumKey]
      })
    },
    // 等于其他结果集
    calcRowOther(row, object, key, sumKey) {
      let sum = 0
      row.datas.forEach(datasitem => {
        datasitem[key] = object[`${datasitem.year}_${datasitem.quarterOrMonth}`] ? object[`${datasitem.year}_${datasitem.quarterOrMonth}`] : 0
        if (datasitem[key] && datasitem.year.indexOf('小计') < 0) {
          sum = myNumeral(datasitem[key]).add(sum).value()
        }
      })
      row.datas.forEach(item => {
        item[sumKey] = sum
      })
      row[sumKey] = sum
    },
    // 计算结果集
    // #endregion
    // #region 资金峰值
    calcZjfz(data) {
      let capitalPeakInfo
      if (data) {
        capitalPeakInfo = cloneDeep(data)
      } else {
        capitalPeakInfo = cloneDeep(this.mpiCapitalPeakInfo)
      }
      const arrCapitalPeakInfo = treeToArrayNoParent(capitalPeakInfo)
      try {
        // 融资贷款收入
      this.calcRowOther(arrCapitalPeakInfo[11], this.mpiCashFlowCalcInfoTotal, 'price', 'sumPrice')
      // 当季净现金流出
      const calcRule = [
        { index: 0, type: '+', value: 0 },
        { index: 1, type: '+', value: 0 },
        { index: 2, type: '+', value: 0 },
        { index: 3, type: '+', value: 0 },
        { index: 4, type: '+', value: 0 },
        { index: 5, type: '+', value: 0 },
        { index: 6, type: '+', value: 0 },
        { index: 7, type: '+', value: 0 },
        { index: 8, type: '+', value: 0 },
        { index: 9, type: '+', value: 0 },
        { index: 10, type: '+', value: 0 },
      ]
      this.calcRow(12, calcRule, arrCapitalPeakInfo, 'price', 'sumPrice')
      } catch (ex) {
        return capitalPeakInfo
      }
      return capitalPeakInfo
    },
    // #endregion
    // #region 股东层面现金流
    calcGdcmxjl() {
      const shareholderCashFlowCalcInfo = cloneDeep(this.mpiShareholderCashFlowCalcInfo)
      const arrShareholderCashFlowCalcInfo = treeToArrayNoParent(shareholderCashFlowCalcInfo)
      try {
        // 对应股比享有的项目公司层面现金流（不含融资）：
        this.calcRowOther(arrShareholderCashFlowCalcInfo[5], this.dygbInfo, 'price', 'sumPrice')
        // 现金流出
        let calcRule = [
          { index: 2, type: '+', value: 0 },
          { index: 3, type: '+', value: 0 },
          { index: 4, type: '+', value: 0 },
          { index: 5, type: '+', value: 0 },
          { index: 0, type: '-', value: 0 },
          { index: 1, type: '-', value: 0 },
        ]
        this.calcRow(6, calcRule, arrShareholderCashFlowCalcInfo, 'price', 'sumPrice')
        // 对应股比享有的项目公司层面现金流（含融资）：
        this.calcRowOther(arrShareholderCashFlowCalcInfo[8], this.dygbrzInfo, 'price', 'sumPrice')
        calcRule = [
          { index: 2, type: '+', value: 0 },
          { index: 3, type: '+', value: 0 },
          { index: 4, type: '+', value: 0 },
          { index: 8, type: '+', value: 0 },
          { index: 0, type: '-', value: 0 },
          { index: 1, type: '-', value: 0 },
        ]
        this.calcRow(9, calcRule, arrShareholderCashFlowCalcInfo, 'price', 'sumPrice')
        this.calcLj(arrShareholderCashFlowCalcInfo[7], arrShareholderCashFlowCalcInfo[6], 'price', 'sumPrice')
        this.calcLj(arrShareholderCashFlowCalcInfo[10], arrShareholderCashFlowCalcInfo[9], 'price', 'sumPrice')
      } catch (ex) {
        return shareholderCashFlowCalcInfo
      }
      return shareholderCashFlowCalcInfo
    },
    // #endregion
    // #region 经营层面
    calcJycm() {
      const mpiCoreBusinessTargetInfo = cloneDeep(this.mpiCoreBusinessTargetInfo)
      try {
        // 项目销售收入含税
      let sumSalesPrice = 0
      let sumSalesPriceNoTax = 0
      let sumSalesArea = 0
      this.mpiCoreBusinessIncomeInfo.forEach(item => {
        if (item.salesPrice) {
          sumSalesPrice = sumSalesPrice + item.salesPrice
        }
        if (item.salesArea) {
          sumSalesArea = sumSalesArea + item.salesArea
        }
        if (item.salesPriceNoTax) {
          sumSalesPriceNoTax = sumSalesPriceNoTax + item.salesPriceNoTax
        }
      })
      // 项目目标销售额：取核心经营指标-项目指标-项目收入中项目销售收入含税销售金额合计值；
      mpiCoreBusinessTargetInfo.targetSales = sumSalesPrice
      // 项目可售均价：取含税销售总额/可售面积（车位个数）*10000计算值，否则则显示0；
      if (sumSalesArea !== 0) {
        mpiCoreBusinessTargetInfo.salesAvg = sumSalesPrice / sumSalesArea * 10000
      }
      // 开发成本：土地出让金+其他土地成本+目标成本之和
      const targetCost = this.getTargetCost()
      mpiCoreBusinessTargetInfo.developmentCost = mpiCoreBusinessTargetInfo.landPremium +
      mpiCoreBusinessTargetInfo.otherLandCost + targetCost
      // 目标成本（2-7项）：取核心经营指标-项目指标-项目成本中前期费用+建筑安装工程费+基础设施费+公共配套设置费+开发间接费+销售设置建设费含税金额之和；
      mpiCoreBusinessTargetInfo.targetCost = targetCost
      // 土地出让金：取成本支付计划中土地出让金的目标成本金额；
      let tdcrj = 0
      let qttdcb = 0
      // let yxfy = 0
      // let cwfy = 0
      // let glfy = 0
      const tjCost = ['土地补偿费', '合作款项', '大市政配套费', '增容费', '土地税费', '拆迁补偿费', '其他土地成本']
      this.arrMpiCostPayPlanInfo.forEach(item => {
        if (item.costName === '土地出让金' && item.targetCost) {
          tdcrj = item.targetCost
        }
        // if (item.costName === '营销费' && item.targetCost) {
        //   yxfy = item.targetCost
        // }
        // if (item.costName === '财务费' && item.targetCost) {
        //   cwfy = item.targetCost
        // }
        // if (item.costName === '管理费' && item.targetCost) {
        //   glfy = item.targetCost
        // }
        if (tjCost.indexOf(item.costName) >= 0 && item.targetCost) {
          qttdcb = qttdcb + item.targetCost
        }
      })
      mpiCoreBusinessTargetInfo.landPremium = tdcrj
      // 其他土地成本：取成本支付计划中土地补偿费+合作款项+大市政配套费+增容费+土地税费+拆迁补偿费+其他土地成本的目标成本金额之和；
      mpiCoreBusinessTargetInfo.otherLandCost = qttdcb
      // 期间费用：取核心经营指标-项目指标-项目成本中营销费用+管理费用+财务费用含税金额之和；
      const qjfy = this.mpiCoreBusinessCostInfo[0].children[1].price
      const yxfy = this.mpiCoreBusinessCostInfo[0].children[1].children[0].price
      const glfy = this.mpiCoreBusinessCostInfo[0].children[1].children[1].price
      const cwfy = this.mpiCoreBusinessCostInfo[0].children[1].children[2].price

      mpiCoreBusinessTargetInfo.periodCost = qjfy
      // 营销费用：取成本支付计划中二级科目营销费用的目标成本；
      mpiCoreBusinessTargetInfo.marketingCost = yxfy
      // 9、管理费用：取成本支付计划中二级科目管理费用的目标成本；
      mpiCoreBusinessTargetInfo.manageMentCost = glfy
      // 10、财务费用：取成本支付计划中二级科目财务费用的目标成本；
      mpiCoreBusinessTargetInfo.financeCost = cwfy
      // 11、营销费效比：营销费用/项目目标销售额*100%；
      if (sumSalesPrice !== 0) {
        mpiCoreBusinessTargetInfo.marketingRatio = yxfy / sumSalesPrice * 100
      }
      // 12、管理费效比：管理费用/项目目标销售额*100%；
      if (sumSalesPrice !== 0) {
        mpiCoreBusinessTargetInfo.manageMentRatio = glfy / sumSalesPrice * 100
      }
      let vatax = 0
      let otherTaxes = 0
      let landVatax = 0
      let zzsfj = 0
      let corporateIncomeTax = 0
      // 14、增值税：取税金表中增值税合计汇总值；
      vatax = this.mpiTaxesCalcInfo[0].children[3].sumTaxes
      mpiCoreBusinessTargetInfo.vatax = vatax
      // 15、其他税金：取税金表中土地使用税+房产税（出租）+房产税（自用）+印花税汇总表之和；
      otherTaxes = (this.mpiTaxesCalcInfo[2].sumTaxes ? this.mpiTaxesCalcInfo[2].sumTaxes : 0) +
      (this.mpiTaxesCalcInfo[3].sumTaxes ? this.mpiTaxesCalcInfo[3].sumTaxes : 0) +
      (this.mpiTaxesCalcInfo[4].sumTaxes ? this.mpiTaxesCalcInfo[4].sumTaxes : 0) +
      (this.mpiTaxesCalcInfo[5].sumTaxes ? this.mpiTaxesCalcInfo[5].sumTaxes : 0)
      mpiCoreBusinessTargetInfo.otherTaxes = otherTaxes
      // 16、土地增值税：取税金表中土地增值税小计汇总值；
      landVatax = this.mpiTaxesCalcInfo[1].sumTaxes ? this.mpiTaxesCalcInfo[1].sumTaxes : 0
      mpiCoreBusinessTargetInfo.landVatax = landVatax
      // 17、增值税附加：取税金表中增值税附加汇总值；
      zzsfj = this.mpiTaxesCalcInfo[0].children[4].sumTaxes ? this.mpiTaxesCalcInfo[0].children[4].sumTaxes : 0
      mpiCoreBusinessTargetInfo.addVatax = zzsfj
      // 18、企业所得税：取税金表中企业所得税小计汇总值；
      corporateIncomeTax = this.mpiTaxesCalcInfo[6].sumTaxes ? this.mpiTaxesCalcInfo[6].sumTaxes : 0
      mpiCoreBusinessTargetInfo.corporateIncomeTax = corporateIncomeTax
      // 13、税金：增值税+其他税金+土地增值税+增值税附加+企业所得税之和；
      mpiCoreBusinessTargetInfo.taxes = vatax + otherTaxes + landVatax + zzsfj + corporateIncomeTax
      // 19、总税负：含税口径：增值税（销项-进项）、增值税附加及其他、土地增值税、企业所得税之和；
      mpiCoreBusinessTargetInfo.totalTaxBurden = vatax + zzsfj + landVatax + corporateIncomeTax
      // 20、股东借款利息：取现金流量表中股东借款利息合计值；
      mpiCoreBusinessTargetInfo.shareholderInterest = this.mpiCashFlowCalcInfo[11].sumCashFlow ? this.mpiCashFlowCalcInfo[11].sumCashFlow : 0
      // 21、整盘溢价：取现金流量表中整盘溢价合计值；
      mpiCoreBusinessTargetInfo.shareholderInterest = this.mpiCashFlowCalcInfo[8].sumCashFlow ? this.mpiCashFlowCalcInfo[8].sumCashFlow : 0
      // 22、项目净利润：项目销售收入含税金额合计值-项目总成本含税金额合计值；
      mpiCoreBusinessTargetInfo.netProfit = sumSalesPrice - (this.mpiCoreBusinessCostInfo[0].price ? this.mpiCoreBusinessCostInfo[0].price : 0)
      // 23、项目净利润率（含税）：项目净利润/项目销售收入含税销售金额合计值*100%；
      mpiCoreBusinessTargetInfo.netProfitRatio = (sumSalesPrice === 0 ? 0 : mpiCoreBusinessTargetInfo.netProfit / sumSalesPrice) * 100
      // 24、项目净利润率（不含税）项目净利润/项目销售收入不含税销售金额合计值*100%；
      mpiCoreBusinessTargetInfo.netProfitNoTaxRatio = (sumSalesPriceNoTax === 0 ? 0 : mpiCoreBusinessTargetInfo.netProfit / sumSalesPriceNoTax) * 100
      // 25、税后净利润（扣除溢价）：项目净利润-整盘溢价；
      mpiCoreBusinessTargetInfo.afterProfitNoYj = mpiCoreBusinessTargetInfo.netProfit - mpiCoreBusinessTargetInfo.shareholderInterest
      // 26、税后净利润率（扣除溢价）：税后净利润（扣除溢价）/项目销售收入含税销售金额合计值*100%；
      mpiCoreBusinessTargetInfo.afterProfitNoYjRatio = (sumSalesPrice === 0 ? 0 : mpiCoreBusinessTargetInfo.afterProfitNoYj / sumSalesPrice) * 100
      // 27、税后净利润（扣除溢价+利息）：税后净利润（扣除溢价）-股东借款利息；
      mpiCoreBusinessTargetInfo.afterProfitNoYjLx = mpiCoreBusinessTargetInfo.afterProfitNoYj - mpiCoreBusinessTargetInfo.shareholderInterest
      // 28、税后净利润率（扣除溢价+利息）：税后净利润（扣除溢价+利息）/项目销售收入含税销售金额合计值*100%；
      mpiCoreBusinessTargetInfo.afterProfitNoYjLxRatio = (sumSalesPrice === 0 ? 0 : mpiCoreBusinessTargetInfo.afterProfitNoYjLx / sumSalesPrice) * 100
      // 29、内部收益率：取现金流量表中内部收益率数值；
      // mpiCoreBusinessTargetInfo.profitRatio =
      // 30、项目累计经营性现金流回正周期：取现金流量表中项目累计经营性现金流回正周期；
      // 31、资金峰值：取现金流量表中资金峰值；
      // 32、项目经营性（含融资）现金流回正周期：取现金流量表中项目累计经营性（含融资）现金流回正周期；
      // todo
      // 1、我方股比：取股东层面现金流表中股比数值；
      mpiCoreBusinessTargetInfo.stockRatio = this.mpiShareholderTradingModelInfo.wfgb
      // 2、交易对价：取股东层面现金流表中交易对价数值；
      mpiCoreBusinessTargetInfo.tradePrice = this.mpiShareholderTradingModelInfo.jydj
      // 3、我方对应股比的有票成本：取股东层面现金流表中我方对应股比的有票成本数值；
      mpiCoreBusinessTargetInfo.stockRatioCost = this.mpiShareholderTradingModelInfo.wfgbypcb
      // 4、我方对应股比溢价：取股东层面现金流表中我方对应股比的有票成本数值；
      mpiCoreBusinessTargetInfo.stockRatioYj = this.mpiShareholderTradingModelInfo.wfdygbyj
      // 5、股东自有资金利息：取股东层面现金流表中股东自有资金利息数值；
      mpiCoreBusinessTargetInfo.shareholderLx = this.mpiShareholderTradingModelInfo.gdzyzjlx
      // 6、项目公司分红利润（力高）：取股东层面现金流表中项目公司分红利润（力高）数值；
      mpiCoreBusinessTargetInfo.shareOut = this.mpiShareholderTradingModelInfo.xmgsfhlr
      // 7、力高净利润：取股东层面现金流表中力高净利润数值；
      mpiCoreBusinessTargetInfo.lgNetProfit = this.mpiShareholderTradingModelInfo.lgjlr
      // 8、力高净利润率：取股东层面现金流表中力高净利润率数值；
      mpiCoreBusinessTargetInfo.lgNetProfitRatio = this.mpiShareholderTradingModelInfo.lgxsjlrl
      // 9、股东层面内部收益率（不含融资）：取股东层面股东层面内部收益率（不含融资）数值；
      mpiCoreBusinessTargetInfo.shareholderSy = this.mpiEvaluatingInfo.gdcmnbsyl
      // 10、股东层面资金峰值（含融资）：取股东层面股东层面资金峰值（含融资）数值；
      mpiCoreBusinessTargetInfo.shareholderFz = this.mpiEvaluatingInfo.gdzjfz
      // 11、股东累计经营性（含融资）现金流回正周期：取股东层面股东累计经营性（含融资）现金流回正周期数值；
      mpiCoreBusinessTargetInfo.shareholderXjlhzzq = this.mpiEvaluatingInfo.gdljxjlzsj
      } catch (ex) {
        return mpiCoreBusinessTargetInfo
      }
      return mpiCoreBusinessTargetInfo
    },
    // 目标成本（2-7项）：取核心经营指标-项目指标-项目成本中前期费用+建筑安装工程费+基础设施费+公共配套设置费+开发间接费+销售设置建设费含税金额之和；
    getTargetCost() {
      let result = 0
      if (this.mpiCoreBusinessCostInfo) {
        const kfcb = this.mpiCoreBusinessCostInfo[0].children[0]
        result = kfcb.children[1].price +
        kfcb.children[2].price +
        kfcb.children[3].price +
        kfcb.children[4].price +
        kfcb.children[5].price +
        kfcb.children[6].price
      }
      return result
    },
    // #endregion
    // #region 项目收入
    calcXmsr() {
      const mpiCoreBusinessIncomeInfo = cloneDeep(this.mpiCoreBusinessIncomeInfo)
      try {
        mpiCoreBusinessIncomeInfo.forEach(item => {
          let salesArea = 0
          let unitPrice = 0
          let salesPriceNoTax = 0
          let salesPrice = 0
          const products = this.ghjhbd.filter(ghjhitem => ghjhitem.productGuid === item.productGuid)
          if (products) {
            products.forEach(product => {
              salesArea = myNumeral(product.totalArea).add(salesArea).value()
              salesPrice = myNumeral(product.totalPrice).add(salesPrice).value()
            })
          }
          unitPrice = salesArea === 0 ? 0 : myNumeral(salesPrice).divide(myNumeral(salesArea).value()).multiply(10000).value()
          salesPriceNoTax = myNumeral(salesPrice).divide(1.09).value()
          item.salesArea = salesArea
          item.unitPrice = unitPrice
          item.salesPriceNoTax = salesPriceNoTax
          item.salesPrice = salesPrice
        })
      return mpiCoreBusinessIncomeInfo
      } catch (ex) {
        return mpiCoreBusinessIncomeInfo
      }
    },

    // #endregion
    // #region 计算项目成本  todo
    calcXmcb() {
      const mpiCoreBusinessCostInfo = cloneDeep(this.mpiCoreBusinessCostInfo)
      const arrMpiCoreBusinessCostInfo = treeToArrayNoParent(mpiCoreBusinessCostInfo)
      try {
      // 2、可售单方：
      // 开发成本（1-7项）：取目标成本中CS01对应开发成本一级科目的可售单方数值，开发成本合计=1-7项数值合计；
      // 可售单方和建面单方
      arrMpiCoreBusinessCostInfo.forEach((item, index) => {
        // 开发成本
        if (index >= 2 && index <= 8) {
          const mbcbrow = this.mbcb.find(mbcbitem => mbcbitem.costName === item.costName)
          const kfcbrow = this.kfcb.find(kfcbitem => kfcbitem.costName === item.costName)
          let salesPirce = 0
          let buildPrice = 0
          let priceNoTax = 0
          let price = 0
          const salesRatio = 0
          if (mbcbrow) {
            salesPirce = mbcbrow.qdSalePrice ? mbcbrow.qdSalePrice : 0
            buildPrice = mbcbrow.qdBuildPrice ? mbcbrow.qdBuildPrice : 0
          }
          if (kfcbrow) {
            price = kfcbrow.targetCost ? kfcbrow.targetCost : 0
            priceNoTax = price - (kfcbrow.taxation ? kfcbrow.taxation : 0)
          }
          item.salesPrice = salesPirce
          item.buildPrice = buildPrice
          item.priceNoTax = priceNoTax
          item.price = price
        } else if (index === 10) {
          // 期间费用  营销费用
          const mbcbrow = this.mbcb.find(mbcbitem => mbcbitem.costName === '营销费')
          const yxfyrow = this.yxfy.find(yxfyitem => yxfyitem.costName === '营销费用')
          let salesPirce = 0
          let buildPrice = 0
          let priceNoTax = 0
          let price = 0
          if (mbcbrow) {
            salesPirce = mbcbrow.qdSalePrice ? mbcbrow.qdSalePrice : 0
            buildPrice = mbcbrow.qdBuildPrice ? mbcbrow.qdBuildPrice : 0
          }
          if (yxfyrow) {
            price = yxfyrow.sumCost ? yxfyrow.sumCost : 0
            priceNoTax = price - (yxfyrow.taxAmount ? yxfyrow.taxAmount : 0)
          }
          item.salesPrice = salesPirce
          item.buildPrice = buildPrice
          item.priceNoTax = priceNoTax
          item.price = price
        } else if (index === 11) {
          // 期间费用  管理费用
          const mbcbrow = this.mbcb.find(mbcbitem => mbcbitem.costName === '管理费')
          const glfyrow = this.glfy.find(glfyitem => glfyitem.costName === '管理费用')
          let salesPirce = 0
          let buildPrice = 0
          let priceNoTax = 0
          let price = 0
          if (mbcbrow) {
            salesPirce = mbcbrow.qdSalePrice ? mbcbrow.qdSalePrice : 0
            buildPrice = mbcbrow.qdBuildPrice ? mbcbrow.qdBuildPrice : 0
          }
          if (glfyrow) {
            price = glfyrow.sumCost ? glfyrow.sumCost : 0
            priceNoTax = price - (glfyrow.taxAmount ? glfyrow.taxAmount : 0)
          }
          item.salesPrice = salesPirce
          item.buildPrice = buildPrice
          item.priceNoTax = priceNoTax
          item.price = price
        } else if (index === 12) {
          // 期间费用  财务费用
          const mbcbrow = this.mbcb.find(mbcbitem => mbcbitem.costName === '财务费')
          let salesPirce = 0
          let buildPrice = 0
          if (mbcbrow) {
            salesPirce = mbcbrow.qdSalePrice ? mbcbrow.qdSalePrice : 0
            buildPrice = mbcbrow.qdBuildPrice ? mbcbrow.qdBuildPrice : 0
          }
          let cwfy = 0
          this.mpiFinancingCalcInfo.forEach(item => {
            if (item.totalCost) {
              cwfy = cwfy + item.totalCost
            }
          })
          item.salesPrice = salesPirce
          item.buildPrice = buildPrice
          item.priceNoTax = cwfy
          item.price = cwfy
        } else if (index >= 14) {
          // 增值税
          const kfcbrow = this.kfcb.find(kfcbitem => kfcbitem.costName === item.costName)
          if (kfcbrow) {
            const sumTaxes = this.mpiTaxesCalcInfo[0].children[3].sumTaxes ? this.mpiTaxesCalcInfo[0].children[3].sumTaxes : 0
            const saleArea = this.mbcb[0].saleArea ? this.mbcb[0].saleArea : 0
            const buildArea = this.mbcb[0].buildArea ? this.mbcb[0].buildArea : 0
            item.salesPrice = saleArea === 0 ? 0 : myNumeral(sumTaxes).divide(saleArea).multiply(10000).value()
            item.buildPrice = buildArea === 0 ? 0 : myNumeral(sumTaxes).divide(buildArea).multiply(10000).value()
          }
          if (index === 14) {
            const taxes = this.mpiTaxesCalcInfo[0].children[3].sumTaxes
            item.priceNoTax = taxes
            item.price = taxes
          } else if (index === 15) {
            const taxes = myNumeral(this.mpiTaxesCalcInfo[0].children[4].sumTaxes).add(myNumeral(this.mpiTaxesCalcInfo[2].sumTaxes).value()).add(myNumeral(this.mpiTaxesCalcInfo[3].sumTaxes).value()).add(myNumeral(this.mpiTaxesCalcInfo[4].sumTaxes).value()).add(myNumeral(this.mpiTaxesCalcInfo[5].sumTaxes).value()).value()
            item.priceNoTax = taxes
            item.price = taxes
          } else if (index === 16) {
            const taxes = this.mpiTaxesCalcInfo[1].sumTaxes
            item.priceNoTax = taxes
            item.price = taxes
          } else if (index === 17) {
            const taxes = this.mpiTaxesCalcInfo[6].sumTaxes
            item.priceNoTax = taxes
            item.price = taxes
          }
        }
      })
      //
      this.calcCbTotal(1, [2, 3, 4, 5, 6, 7, 8], arrMpiCoreBusinessCostInfo)
      this.calcCbTotal(9, [10, 11, 12], arrMpiCoreBusinessCostInfo)
      this.calcCbTotal(13, [14, 15, 16, 17], arrMpiCoreBusinessCostInfo)
      this.calcCbTotal(0, [1, 9, 13], arrMpiCoreBusinessCostInfo)
      // 期间费用：取目标成本中CS01对应营销、管理、财务一级科目的可售单方数值；
      // 税金：取目标成本中CS01对应税金的可售单方数值；
      // 增值税：增值税对应含税金额/可售面积*10000；
      // 增值税附加：增值税附加对应含税金额/可售面积*10000；
      // 土地增值税：土地增值税对应含税金额/可售面积*10000；
      // 企业所得税：企业所得税对应含税金额/可售面积*10000；
      // 3、建面单方：
      // 开发成本（1-7项）：取目标成本中CS01对应一级科目的建面单方数值，开发成本合计=1-7项数值合计；
      // 期间费用：取目标成本中CS01对应营销、管理、财务一级科目的可售单方数值；
      // 税金：取目标成本中CS01对应税金的可售单方数值；
      // 增值税：增值税对应含税金额/建筑面积*10000；
      // 增值税附加：增值税附加对应含税金额/建筑面积*10000；
      // 土地增值税：土地增值税对应含税金额/建筑面积*10000；
      // 企业所得税：企业所得税对应含税金额/建筑面积*10000；
      // 4、不含税金额：
      // 开发成本（1-7项）：对应成本科目的含税金额-成本税金中对应成本科目的进项税数值，开发成本合计=1-7项数值合计；
      // 期间费用：
      // （1）营销费用：对应营销费用科目的含税金额-营销费用税金中营销费用（考核口径）进项税汇总值；
      // （2）管理费用：对应管理费用科目的含税金额-管理费用税金中管理费用（考核口径）进项税汇总值；
      // （3）财务费用：对应财务费用科目的含税金额数值；
      // 税金：增值税附加+土地增值税+企业所得税之和；
      // 增值税附加：增值税附加+土地使用税+房产税（出租）+房产税（自用）+印花税
      // 土地增值税：对应土地增值税科目的含税金额数值；
      // 企业所得税：对应企业所得税科目的含税金额数值；
      // 5、含税金额：
      // 开发成本（1-7项）：取目标成本中CS01对应一级科目的成本（万元）数值，开发成本合计=1-7项数值合计；
      // 期间费用：
      // （1）营销费用：营销费用（含税）中营销费用（考核口径）汇总值；
      // （2）管理费用：管理费用（含税）中管理费用（考核口径）汇总值；
      // （3）财务费用：取融资-融资费用测算表中合计值；
      // 税金：增值税+增值税附加+土地增值税+企业所得税之和；
      // 增值税：取税金表中增值税合计汇总值；
      // 增值税附加：增值税附加+土地使用税+房产税（出租）+房产税（自用）+印花税；
      // 土地增值税：取税金表中土地增值税小计汇总值；
      // 企业所得税：取税金表中企业所得税小计汇总值；
      // 6、占销售收入比例：项目成本中对应科目的含税金额/项目销售收入中含税销售金额*100%；
      return mpiCoreBusinessCostInfo
      } catch (ex) {
        return mpiCoreBusinessCostInfo
      }
    },
    calcCbTotal(sunIndex, indexs, data) {
      let salesPrice = 0
      let buildPrice = 0
      let priceNoTax = 0
      let price = 0
      indexs.forEach(index => {
        salesPrice = myNumeral(data[index].salesPrice).add(salesPrice).value()
        buildPrice = myNumeral(data[index].buildPrice).add(buildPrice).value()
        priceNoTax = myNumeral(data[index].priceNoTax).add(priceNoTax).value()
        price = myNumeral(data[index].price).add(price).value()
      })
      data[sunIndex].salesPrice = salesPrice
      data[sunIndex].buildPrice = buildPrice
      data[sunIndex].priceNoTax = priceNoTax
      data[sunIndex].price = price
    },
    // #endregion
    // #region 业态利润
    calcYtlr() {
      // mpiYtTargetProfitInfo
      // 业态销售收入：

      const mpiYtTargetProfitInfo = cloneDeep(this.mpiYtTargetProfitInfo)
      try {
        mpiYtTargetProfitInfo[0].datas.forEach(item => {
          let productCost = 0
          this.hzbd.forEach(hzbditem => {
            if (item.productGuid !== '00000000-0000-0000-0000-000000000000' && hzbditem.productGuid === item.productGuid && hzbditem.totalPrice) {
              productCost = myNumeral(hzbditem.totalPrice).add(productCost).value()
            } else if (item.productGuid === '00000000-0000-0000-0000-000000000000' && hzbditem.productType && hzbditem.productType.indexOf('车位') >= 0) {
              productCost = myNumeral(hzbditem.totalPrice).add(productCost).value()
            }
          })
          item.productCost = productCost
        })
        // 业态支出成本
        mpiYtTargetProfitInfo[1].children.forEach(item => {
          const cbftrows = this.cbft.filter(cbftitem => {
            return cbftitem.costName === item.costName
          })
          if (cbftrows && cbftrows.length > 0) {
            item.datas.forEach(datasitem => {
              let productCost = 0
              cbftrows.forEach(cbftitem => {
                cbftitem.datas.forEach(cbftdataitem => {
                  if (datasitem.productGuid !== '00000000-0000-0000-0000-000000000000' && cbftdataitem.productGuid === datasitem.productGuid && cbftdataitem.productTypeCost) {
                    productCost = myNumeral(cbftdataitem.productTypeCost).add(productCost).value()
                  } else if (datasitem.productGuid === '00000000-0000-0000-0000-000000000000' && cbftdataitem.productType && cbftdataitem.productType.indexOf('车位') >= 0) {
                    productCost = myNumeral(cbftdataitem.productTypeCost).add(productCost).value()
                  }
                  // if (cbftdataitem.productGuid === datasitem.productGuid && cbftdataitem.productTypeCost) {
                  //   productCost = myNumeral(cbftdataitem.productTypeCost).add(productCost).value()
                  // }
                })
              })
              datasitem.productCost = productCost
            })
          }
        })
        // 合计
        mpiYtTargetProfitInfo[1].datas.forEach((item, index) => {
          let productCost = 0
          mpiYtTargetProfitInfo[1].children.forEach(childitem => {
            productCost = myNumeral(childitem.datas[index].productCost).add(productCost).value()
          })
          item.productCost = productCost
        })
        // 业态利润表中除地库外所有产品名称销售收入之和
        let ytlrtotal = 0
        mpiYtTargetProfitInfo[0].datas.forEach(item => {
          if (['地库', '车位'].indexOf(item.productName) < 0 && item.productCost) {
            ytlrtotal = myNumeral(item.productCost).add(ytlrtotal).value()
          }
        })
        // 期间费用
        // const yxfy = this.mpiCoreBusinessCostInfo[0].children[1].children[0].price ? this.mpiCoreBusinessCostInfo[0].children[1].children[0].price : 0
        // const glfy = this.mpiCoreBusinessCostInfo[0].children[1].children[1].price ? this.mpiCoreBusinessCostInfo[0].children[1].children[1].price : 0
        // const cwfy = this.mpiCoreBusinessCostInfo[0].children[1].children[2].price ? this.mpiCoreBusinessCostInfo[0].children[1].children[2].price : 0
        mpiYtTargetProfitInfo[2].children.forEach((item, index) => {
          // 项目成本中的含税金额
          const fy = this.mpiCoreBusinessCostInfo[0].children[1].children[index].price ? this.mpiCoreBusinessCostInfo[0].children[1].children[index].price : 0
          // // 业态利润表中除地库外所有产品名称销售收入之和
          // let ytlrtotal = 0
          // item.datas.forEach(item => {
          //   if (['地库', '车位'].indexOf(item.productName) < 0 && item.productCost) {
          //     ytlrtotal = ytlrtotal + item.productCost
          //   }
          // })
          item.datas.forEach((datasitem, index) => {
            const xssr = mpiYtTargetProfitInfo[0].datas[index].productCost
            datasitem.productCost = ytlrtotal === 0 ? 0 : myNumeral(xssr).divide(ytlrtotal).multiply(fy).value()
          })
        })
        // 合计
        mpiYtTargetProfitInfo[2].datas.forEach((item, index) => {
          let productCost = 0
          mpiYtTargetProfitInfo[2].children.forEach(childitem => {
            productCost = myNumeral(childitem.datas[index].productCost).add(productCost).value()
          })
          item.productCost = productCost
        })
        // 税金
        // 增值税
        mpiYtTargetProfitInfo[3].children.forEach((item, index) => {
          // 项目成本中的含税金额
          const fy = this.mpiCoreBusinessCostInfo[0].children[2].children[index].price ? this.mpiCoreBusinessCostInfo[0].children[2].children[index].price : 0
          // 业态利润表中除地库外所有产品名称销售收入之和
          // let ytlrtotal = 0
          // mpiYtTargetProfitInfo[0].datas.forEach(item => {
          //   if (['地库', '车位'].indexOf(item.productName) < 0 && item.productCost) {
          //     ytlrtotal = myNumeral(item.productCost).add(ytlrtotal).value()
          //   }
          // })
          item.datas.forEach((datasitem, index) => {
            const xssr = mpiYtTargetProfitInfo[0].datas[index].productCost
            datasitem.productCost = ytlrtotal === 0 ? 0 : myNumeral(xssr).divide(ytlrtotal).multiply(fy).value()
          })
        })
        // 合计
        mpiYtTargetProfitInfo[3].datas.forEach((item, index) => {
          let productCost = 0
          mpiYtTargetProfitInfo[3].children.forEach(childitem => {
            productCost = myNumeral(childitem.datas[index].productCost).add(productCost).value()
          })
          item.productCost = productCost
        })

        // 态税前利润额
        mpiYtTargetProfitInfo[4].datas.forEach((item, index) => {
          item.productCost = myNumeral(mpiYtTargetProfitInfo[0].datas[index].productCost).subtract(mpiYtTargetProfitInfo[1].datas[index].productCost).subtract(mpiYtTargetProfitInfo[2].datas[index].productCost).subtract(mpiYtTargetProfitInfo[3].datas[index].productCost).value()
        })

        // 业态税前利润率
        mpiYtTargetProfitInfo[5].datas.forEach((item, index) => {
          item.productCost = mpiYtTargetProfitInfo[0].datas[index].productCost === 0 ? 0 : myNumeral(mpiYtTargetProfitInfo[4].datas[index].productCost).divide(mpiYtTargetProfitInfo[0].datas[index].productCost).multiply(100).value()
        })
        return mpiYtTargetProfitInfo
      } catch (ex) {
        console.log('业态利润', ex)
        return mpiYtTargetProfitInfo
      }
    },
    // #endregion
    // #region 股东层面交易模式
    calcGdcmjyms() {
      // 3、整盘溢价金额（万元）：整盘作价金额-原始有票成本金额；
      const mpiShareholderTradingModelInfo = cloneDeep(this.mpiShareholderTradingModelInfo)
      const setting = this.mpiTableManualInfo.find(item => {
        return item.typeName === '股东层面交易模式'
      })
      if (!setting || setting.isManual) {
        return mpiShareholderTradingModelInfo
      }
      try {
        mpiShareholderTradingModelInfo.zpyjje = myNumeral(mpiShareholderTradingModelInfo.zpzjje).subtract(myNumeral(mpiShareholderTradingModelInfo.ysypcbje).value()).value()
        // 10、我方对应股比溢价（万元）：交易对价-我方对应股比的有票成本；
        mpiShareholderTradingModelInfo.wfdygbyj = myNumeral(mpiShareholderTradingModelInfo.jydj).subtract(myNumeral(mpiShareholderTradingModelInfo.wfgbypcb).value()).value()
        // 11、股东自有资金利息（万元）：取股东层面现金流计算表中股东自有资金利息合计值；
        mpiShareholderTradingModelInfo.gdzyzjlx = this.mpiShareholderCashFlowCalcInfo[11].sumPrice ? this.mpiShareholderCashFlowCalcInfo[11].sumPrice : 0
        // 12、项目公司分红利润（力高）：我方股比*现金流量表中累计现金流（含融资）合计值；
        mpiShareholderTradingModelInfo.xmgsfhlr = myNumeral(mpiShareholderTradingModelInfo.wfgb).multiply(myNumeral(this.mpiShareholderCashFlowCalcInfo[10].sumPrice).value()).divide(100).value()
        // 13、力高净利润（万元）：项目公司分红利润（力高）-我方对应股比溢价-股东自有资金利息；
        mpiShareholderTradingModelInfo.lgjlr = myNumeral(mpiShareholderTradingModelInfo.xmgsfhlr).subtract(myNumeral(mpiShareholderTradingModelInfo.wfdygbyj).value()).subtract(myNumeral().value(mpiShareholderTradingModelInfo.gdzyzjlx)).value()
        // 14、力高销售净利润率（%）：（（股东层面现金流计算表中累计现金流-股东自有资金利息）/（我方股比*销售计划中所有产品标段合计的项目总可售金额合计值）），如果结果出错，则返回值为0；
        let zksje = 0
        this.mpiSalePlanInfo.forEach(item => {
          if (item.totalPrice) {
            zksje = zksje + item.totalPrice
          }
        })
        mpiShareholderTradingModelInfo.lgxsjlrl = mpiShareholderTradingModelInfo.wfgb === 0 || zksje === 0 ? 0 : (myNumeral(this.mpiShareholderCashFlowCalcInfo[10].sumPrice).subtract(myNumeral(this.mpiShareholderCashFlowCalcInfo[11].sumPrice).value())).divide(myNumeral(mpiShareholderTradingModelInfo.wfgb).divide(100).value()).divide(zksje).multiply(100).value()
        return mpiShareholderTradingModelInfo
      } catch (ex) {
        return mpiShareholderTradingModelInfo
      }
    },
    // #endregion
    // #region 评价指标
    calcPjzb() {
      const mpiEvaluatingInfo = cloneDeep(this.mpiEvaluatingInfo)
      const arrIRR = []
      this.mpiCashFlowCalcInfo[2].datas.forEach(item => {
        if (item.year.indexOf('小计') < 0) {
          if (item.cashFlow) {
            arrIRR.push(item.cashFlow)
          } else {
            arrIRR.push(0)
          }
        }
      })
      mpiEvaluatingInfo.nbsyl = (Math.pow(myNumeral(1).add(myNumeral(IRRCalc(arrIRR)).divide(100).value()).value(), 4) - 1) * 100
      const arrGdIRR = []
      this.mpiShareholderCashFlowCalcInfo[6].datas.forEach(item => {
        if (item.year.indexOf('小计') < 0) {
          if (item.cashFlow) {
            arrGdIRR.push(item.cashFlow)
          } else {
            arrGdIRR.push(0)
          }
        }
      })
      mpiEvaluatingInfo.gdcmnbsyl = (Math.pow(myNumeral(1).add(myNumeral(IRRCalc(arrGdIRR)).divide(100).value()).value(), 4) - 1) * 100

      return mpiEvaluatingInfo
    },
    // #endregion
    // 计算小计与合计
    calcTotal(row, key, sumKey) {
      const xj = row.datas.filter(item => {
        return item.year.indexOf('小计') >= 0
      })
      xj.forEach(item => {
        item[key] = 0
      })
      row.datas.forEach(element => {
        if (element.year.indexOf('小计') < 0) {
          const curxj = xj.find(xjitem => {
            return xjitem.year.replace('小计', '') === element.year
          })
          if (!curxj[key]) {
            curxj[key] = element[key]
          } else {
            curxj[key] = curxj[key] + element[key]
          }
        }
      })

      let sum = 0
      xj.forEach(item => {
        const itemnum = Number(item[key])
        if (item[key] && !isNaN(itemnum)) {
          sum = sum + itemnum
        }
      })
      row[sumKey] = sum
    },
    // 计算指标
    calcZb(calcRule) {
      let calcValue = 0
      calcRule.forEach(ruleitem => {
        calcValue = this.calcOperations(calcValue, ruleitem.type, ruleitem.value).value()
      })
    },
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
          if (ruleitem.index !== undefined && ruleitem.index !== null) {
            ruleitem.value = calcData[ruleitem.index].datas[index][key] ? calcData[ruleitem.index].datas[index][key] : 0
          }
          calcValue = this.calcOperations(calcValue, ruleitem.type, ruleitem.value).value()
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
      if (!defaultValue) {
        defaultValue = 0
      }
      if (!value) {
        value = 0
      }
      if (!numeral.isNumeral(defaultValue)) {
        defaultValue = numeral(defaultValue)
      }
      if (numeral.isNumeral(value)) {
        value = value.value()
      }
      let result = defaultValue
      switch (type) {
        case '+':
          result = defaultValue.add(value)
        break
        case '-':
          result = defaultValue.subtract(value)
        break
        case '*':
          result = defaultValue.multiply(value)
        break
        case '/':
          if (value !== 0) {
            result = defaultValue.divide(value)
          } else {
            result = numeral(0)
          }
        break
      }
      return result
    },
    // myNumeral(val) {
    //   if (!val) {
    //     val = 0
    //   }

    //   if (numeral.isNumeral(val)) {
    //     return val
    //   } else {
    //     return numeral(val)
    //   }
    // }
  },
  computed: {
    arrData: function() {
      return treeToArrayNoParent(this.showData)
    },
    arrMpiCostPayPlanInfo: function() {
      return treeToArrayNoParent(this.mpiCostPayPlanInfo)
    },
    // 管理费用税金的合计
    mpiManageMentCostInfoTotal: function() {
      const result = {}
      this.mpiManageMentCostInfo.forEach((item, index) => {
        if (index > 2) {
          item.datas.forEach(datasitem => {
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.costTaxes).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
          })
        }
      })
      return result
    },
    // 管理费用的合计
    mpiManageMentCostInfoValueTotal: function() {
      const result = {}
      this.mpiManageMentCostInfo.forEach((item, index) => {
        if (index > 2) {
          item.datas.forEach(datasitem => {
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.costValue).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
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
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.costTaxes).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
          })
        }
      })
      return result
    },
    // 市场费用的合计
    mpiMarketingCostInfoValueTotal: function() {
      const result = {}
      this.mpiMarketingCostInfo.forEach((item, index) => {
        if (index > 1) {
          item.datas.forEach(datasitem => {
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.costValue).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
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
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.contractPrice).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
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
          if (datasitem.contractPrice) {
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.contractPrice).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
          }
        })
      })
      return result
    },
    // 开发成本
    mpiCostPayPlanTotal: function() {
      const result = {}
      this.mpiCostPayPlanInfo[0].children[0].datas.forEach(datasitem => {
        const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.payTotal).value()).value()
        this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
      })
      return result
    },
    // 财务测算
    mpiFinancingCalcInfoTotal: function() {
      const result = {}
      this.mpiFinancingCalcInfo.forEach((item, index) => {
        item.datas.forEach(datasitem => {
          const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.cost).value()).value()
          this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
        })
      })
      return result
    },
    // 税金
    mpiTaxesCalcInfoTotal: function() {
      const result = {}
      this.mpiTaxesCalcInfo.forEach((item, index) => {
        item.datas.forEach(datasitem => {
          const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.taxes).value()).value()
          this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
        })
      })
      return result
    },
    // 融资余额表 -提款
    mpiFinancingBalanceInfoTkTotal: function() {
      const result = {}
      this.mpiFinancingBalanceInfo.forEach((item, index) => {
        if (item.financingCategory2 === '提款') {
          item.datas.forEach(datasitem => {
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.balance).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
          })
        }
      })
      return result
    },
    // 融资余额表 -还款
    mpiFinancingBalanceInfoHkTotal: function() {
      const result = {}
      this.mpiFinancingBalanceInfo.forEach((item, index) => {
        if (item.financingCategory2 === '还款') {
          item.datas.forEach(datasitem => {
            const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.balance).value()).value()
            this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
          })
        }
      })
      return result
    },
    // 融资贷款收入
    mpiCashFlowCalcInfoTotal: function() {
      const result = {}
      this.mpiCashFlowCalcInfo[4].datas.forEach(datasitem => {
        const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.cashFlow).value()).value()
        this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
      })
      return result
    },
    // 对应股比享有的项目公司层面现金流不含融资）：
    dygbInfo: function() {
      const result = {}
      this.mpiCashFlowCalcInfo[2].datas.forEach(datasitem => {
        const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.cashFlow).multiply(myNumeral(this.mpiShareholderTradingModelInfo.wfgb).value()).value()).value()
        this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
      })
      // 对应股比
      // const gb= this.mpiShareholderCashFlowCalcInfo
      return result
    },
    // 对应股比享有的项目公司层面现金流（含融资）：
    dygbrzInfo: function() {
      const result = {}
      this.mpiCashFlowCalcInfo[6].datas.forEach(datasitem => {
        const value = myNumeral(result[`${datasitem.year}_${datasitem.quarterOrMonth}`]).add(myNumeral(datasitem.cashFlow).value()).value()
        this.$set(result, `${datasitem.year}_${datasitem.quarterOrMonth}`, value)
      })
      // 对应股比
      // const gb= this.mpiShareholderCashFlowCalcInfo
      return result
    },
    // g供货计划标段
    ghjhbd: function() {
      return treeToArrayNoParent(this.mpiSupplySectionInfo)
    },
     // g供货计划楼栋
     ghjhld: function() {
      return treeToArrayNoParent(this.mpiSupplyBuildInfo)
    },
    // 目标成本
    mbcb: function() {
      return treeToArrayNoParent(this.mpiTargetCostInfo)
    },
    // 开发成本
    kfcb: function() {
      return treeToArrayNoParent(this.mpiCostPayPlanInfo)
    },
    // 营销费用
    yxfy: function() {
      return treeToArrayNoParent(this.mpiMarketingCostInfo)
    },
    // 管理费用
    glfy: function() {
      return treeToArrayNoParent(this.mpiManageMentCostInfo)
    },
    // 货值标段
    hzbd: function() {
      return treeToArrayNoParent(this.mpiSupplySectionInfo)
    },
    hzld: function() {
      return treeToArrayNoParent(this.mpiSupplyBuildInfo)
    },
    // 成本分摊
    cbft: function() {
      return treeToArrayNoParent(this.mpiCostAllocationInfo)
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
        mpiFinancingCalcInfo: state => state.outline_info.mpiFinancingCalcInfo,
        mpiFinancingBalanceInfo: state => state.outline_info.mpiFinancingBalanceInfo,
        mpiShareholderCashFlowCalcInfo: state => state.outline_info.mpiShareholderCashFlowCalcInfo,
        mpiCoreBusinessIncomeInfo: state => state.outline_info.mpiCoreBusinessIncomeInfo,
        mpiCoreBusinessCostInfo: state => state.outline_info.mpiCoreBusinessCostInfo,
        mpiCashFlowCalcInfo: state => state.outline_info.mpiCashFlowCalcInfo,
        mpiCapitalPeakInfo: state => state.outline_info.mpiCapitalPeakInfo,
        mpiCoreBusinessTargetInfo: state => state.outline_info.mpiCoreBusinessTargetInfo,
        mpiSupplySectionInfo: state => state.outline_info.mpiSupplySectionInfo,
        mpiTargetCostInfo: state => state.outline_info.mpiTargetCostInfo,
        mpiYtTargetProfitInfo: state => state.outline_info.mpiYtTargetProfitInfo,
        mpiSectionPlanInfo: state => state.outline_info.mpiSectionPlanInfo,
        mpiCostAllocationInfo: state => state.outline_info.mpiCostAllocationInfo,
        mpiShareholderTradingModelInfo: state => state.outline_info.mpiShareholderTradingModelInfo,
        mpiLandValueTaxCalcInfo: state => state.outline_info.mpiLandValueTaxCalcInfo,
        mpiEvaluatingInfo: state => state.outline_info.mpiEvaluatingInfo,
        mpiSupplyBuildInfo: state => state.outline_info.mpiSupplyBuildInfo,
        mpiBasicPlanInfo: state => state.outline_info.mpiBasicPlanInfo,
        mpiTableManualInfo: state => state.outline_info.mpiTableManualInfo
      }
    ),
  }

}
