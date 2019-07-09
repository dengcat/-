import { getMpiBasicInfo, createMpiVersion, saveMpiVersion, changeYearDimension, checkBusinessDataIsNew } from '@/api/outLineManager'

const outline_info = {
  state: {
    // 版本
    mpiVersionInfo: {
      id: undefined, // 实施纲要ID
      projectId: '', // 项目ID
      projectName: '', // 项目名称
      stagesId: '', // 分期ID
      stagesName: '', // 分期名称
      versionName: '', // 版本名称
      mdmVersionId: '', // 主数据版本ID
      mdmVersionName: '', // 主数据版本名称
      approveState: '', // 实施纲要状态
      // stagesValue: undefined, // 分期信息
      // buildingValue: undefined, // 楼栋信息
      buGuid: undefined,
      buName: undefined,
      verTip: false,
      editTip: false,
      year: undefined
    },
    // 基本信息
    mpiProjectInfo: {},
    // 项目规划指标-基本信息
    mpiBasicPlanInfo: {},
    // 开发计划-项目开发计划
    mpiDevPlanInfo: [],
    // 基本信息-产品信息
    mpiProductInfo: [],
    // 项目规划指标-产品规划指标
    mpiProductPlanInfo: [],
    // 基本信息-标段信息
    mpiSectionInfo: [],
    // 项目规划指标-标段规划指标
    mpiSectionPlanInfo: [],
    // 货值-供货计划表-楼栋
    mpiSupplyBuildInfo: undefined,
    // 货值-供货计划表-标段
    mpiSupplySectionInfo: undefined,
    // 货值-总货值表(测算)-总货值计算表
    mpiSaleTotalCalInfo: undefined,
    // 货值-总货值表(测算)-项目利润测算
    mpiSaleTotalProCalInfo: undefined,
    // 销售计划_回款计划
    mpiReturnPlanInfo: undefined,
    // 销售计划_销售结转
    mpiSaleCarryOverInfo: undefined,
    // 销售计划_销售计划
    mpiSalePlanInfo: undefined,
    // 开发成本-目标成本Dto
    mpiTargetCostInfo: undefined, // 目标成本
    // 开发成本-成本税金支付 作废
    // mpiCostPayTaxesInfo: undefined,
    // 开发成本-成本分摊
    mpiCostAllocationInfo: undefined,
    // 开发成本-成本支付计划(包含成本税金支付)
    mpiCostPayPlanInfo: undefined,
    // 费用-管理费用（包含管理费用税金支付）
    mpiManageMentCostInfo: undefined,
    // 作废
    // mpiManageMentCostTaxesInfo: undefined,
    // 费用-营销费用（包含营销费用税金支付）
    mpiMarketingCostInfo: undefined,
    // 融资-融资余额表
    mpiFinancingBalanceInfo: undefined,
    // 融资-融资费用测算表
    mpiFinancingCalcInfo: undefined,
    // 融资-融资计划表
    mpiFinancingPlanInfo: undefined,
    // 税金-税金计算表
    mpiTaxesCalcInfo: undefined,
    // 税金-土地增值税清算表
    mpiLandValueTaxCalcInfo: undefined,
    // 现金流-项目现金流-现金流计算表
    mpiCashFlowCalcInfo: undefined,
    // 现金流-项目现金流-资金峰值
    mpiCapitalPeakInfo: undefined,
  // 现金流-项目现金流-评价指标、现金流-股东层面现金流-评价指标
    mpiEvaluatingInfo: undefined,
    // 现金流-股东层面现金流-股东层面交易模式
    mpiShareholderTradingModelInfo: undefined,
    // 现金流-股东层面现金流-股东层面交易模式
    mpiShareholderCashFlowCalcInfo: undefined,
    // mpiShareholderEvaluatingInfo: undefined,
    // 核心经营指标-项目指标-项目收入
    mpiCoreBusinessIncomeInfo: undefined,
    // 核心经营指标-项目指标-项目成本
    mpiCoreBusinessCostInfo: undefined,
    // 核心经营指标-业态指标-业态利润
    mpiYtTargetProfitInfo: undefined,
    // 核心经营指标-项目指标(经营层面、股东层面)
    mpiCoreBusinessTargetInfo: undefined,
    // 税率设置
    rate: [{ id: 0, label: 0 }, { id: 0.01, label: 0.01 }, { id: 0.03, label: 0.03 }, { id: 0.05, label: 0.05 }, { id: 0.1, label: 0.1 }, { id: 2.5, label: 2.5 }, { id: 5, label: 5 }, { id: 3, label: 3 }, { id: 6, label: 6 }, { id: 9, label: 9 }, { id: 10, label: 10 }, { id: 11, label: 11 }, { id: 12, label: 12 }, { id: 13, label: 13 }, { id: 16, label: 16 }, { id: 17, label: 17 }, { id: 25, label: 25 }],
    // 动态表格配置
    mpiTableSettingInfo: [],
    // 是否自动计算
    mpiTableManualInfo: [],
    eidtModule: ['mpiProjectInfo',
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
    'mpiTableSettingInfo'], // 修改的模块
    effectInfo: [], // 当前步骤填写对其他字段的影响
    CalcRules: [
      {
        key: 'cerSourceDate',
        module: '开发计划',
        title: '预售证时间',
        text: '数据来自开发计划中的楼栋预售证时间'
      }
    ], // 计算规则
    isNewBusinessData: true
},
  mutations: {
    SET_outlineInfo: (state, payload) => {
      // state = { ...state, ...payload }
      state = Object.assign(state, payload)
    }
  },
  actions: {
    // 查询实施纲要所有信息
    SelectOutlineInfo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getMpiBasicInfo(payload).then(response => {
          const outlineInfo = response.data
          console.log('outlineInfo', outlineInfo)
          commit('SET_outlineInfo', outlineInfo)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增实施纲要
    CreateOutlineInfo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        createMpiVersion(payload).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
        }
      )
    },
    // 保存实施纲要
    SaveOutlineInfo({ state, rootState }) {
      const saveData = {
        outline_info: state,
        outline_stepInfo: rootState.outline_stepInfo
      }
      console.log('提交的数据', saveData)
      return new Promise((resolve, reject) => {
        saveMpiVersion(saveData).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
        }
      )
    },
    // 更改vuex中的实施新型
    SetOutlineInfo({ commit }, payload) {
      commit('SET_outlineInfo', payload)
    },
    // 修改表格设置
    ChangeYearDimension({ commit }, payload) {
      return new Promise((resolve, reject) => {
        changeYearDimension(payload).then(response => {
          const outlineInfo = response.data.result
          commit('SET_outlineInfo', outlineInfo)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 修改表格设置
    CheckBusinessDataIsNew({ commit }, payload) {
      return new Promise((resolve, reject) => {
        checkBusinessDataIsNew(payload.stagesId, payload.projectVersion).then(response => {
          const obj = response.data.result
          commit('SET_outlineInfo', obj)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    ChangeAutoCalc({ commit, state }, payload) {
      const setting = state.mpiTableManualInfo.find(item => {
        return item.typeName === payload.type
      })
      if (setting) {
        setting.isManual = payload.val
      }
    }
  }
}

export default outline_info
