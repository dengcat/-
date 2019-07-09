
const outline_stepInfo = {
  state: {
    steps: [
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
    ],
    currentStep: {
      step: 1,
      childrenStep: undefined
    }
  },
  mutations: {
    outline_stepInfo_Update: (state, payload) => {
      state = Object.assign(state, payload)
    }
  },
  actions: {
    outline_stepInfo_UpdateStepInfo({ commit, state }, payload) {
      const currentStep = {
        step: 1,
        childrenStep: 1
      }
      // payload {step:1,childrenStep:2}
      // 更新步骤完成状态
      // 克隆一个step对象
      const tempStep = Object.assign({}, state)
      tempStep.steps.forEach(element => {
        if (element.stepNum === payload.step) {
          if (payload.childrenStep && element.children) {
            element.children.forEach(childrenItem => {
              // 更新当前子级为已完成
              if (childrenItem.stepNum === payload.childrenStep) {
                childrenItem.stepState = '已完成'
              }
              // 更新为进行中
              if (childrenItem.stepNum === (payload.childrenStep + 1)) {
                childrenItem.stepState = '进行中'
                element.stepState = '进行中'
                currentStep.step = payload.step
                currentStep.childrenStep = payload.childrenStep + 1
              }
              if (childrenItem.stepNum > (payload.childrenStep + 1)) {
                childrenItem.stepState = '未开始'
              }
            })
            // 查找所有子级状态，如果全部完成则更新父级为已完成
            const isWwc = element.children.some(item => {
              return item.stepState !== '已完成'
            })
            if (!isWwc) {
              element.stepState = '已完成'
            }
          } else {
            element.stepState = '已完成'
          }
          // 下一级为进行中
          if (element.stepState === '已完成') {
            currentStep.step = payload.step + 1
            currentStep.childrenStep = 1
          }
        }
      })

      tempStep.steps.forEach(element => {
        // 当前步骤后续步骤都为未开始
        if (element.stepNum > currentStep.step) {
          element.stepState = '未开始'
          if (element.children && element.children.length > 0) {
            element.children.forEach(wwcitem => {
              wwcitem.stepState = '未开始'
            })
          }
        }
        if (element.stepNum === currentStep.step) {
          element.stepState = '进行中'
          if (element.children && element.children.length > 0) {
            element.children.forEach(item => {
              if (item.stepNum > currentStep.childrenStep) {
                item.stepState = '未开始'
              }
            })
          }
        }
      })

      tempStep.currentStep = currentStep
      commit('outline_stepInfo_Update', tempStep)
    },

  }
}

export default outline_stepInfo
