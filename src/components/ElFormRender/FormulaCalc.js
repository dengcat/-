
import CompareHelper from './CompareHelper.js'
import * as math from 'mathjs'

// const FormulaCalc = function() {
  const PKNAME = 'BusinessDataGUID'
  let _item2Formula
  let _formulaDataMng

  // eslint-disable-next-line one-var
  const _businessObjectFormula2ItemFormula = function(formulaList) {
      // eslint-disable-next-line one-var
      var item2Formula = {},
        formulaAll

      formulaList.forEach((formula) => {
        // 只处理数值公式
        if (formula.type != null && formula.type !== 'SUM' && formula.type !== 'AutoSum') return

        var businessObjectId = formula.type ? formula.childBusinessObjectId : formula.resultBusinessObjectId
        businessObjectId = businessObjectId.toLowerCase()
        formulaAll = item2Formula[businessObjectId]
        if (!formulaAll) {
          formulaAll = {}
          item2Formula[businessObjectId] = formulaAll
        }
        formula.fullData.forEach((item) => {
          if (formulaAll[item]) { formulaAll[item].push(formula) } else { formulaAll[item] = [formula] }
        })
      })
      return item2Formula
    },
    _toNumber = function(val) {
      if (!val) {
        return 0
      }
      if ((typeof val) === 'number') {
        return val
      }
      val = val.replace(/,/g, '')
      val = parseFloat(val)
      if (isNaN(val)) {
        return 0
      }
      return val
    },
    _getDependFormulas = function(businessObjectId, type, propertyName) {
      // / <summary>
      // / 获取指定业务对象的依赖公式
      // / </summary>
      // / <param name="businessObjectId">源业务对象id</param>
      // / <param name="type">获取类别(0.只取本业务对象内部四则运算公式,1.只取受本业务对象影响的其它业务对象的汇总公式,2.取所有依赖公式)</param>
      // / <param name="propertyName">属性名称,可省略</param>
      if (!_item2Formula) {
        return
      }

      var formulaAll = _item2Formula[businessObjectId.toLowerCase()]
      if (!formulaAll) {
        return
      }
      var formulas
      if (propertyName) {
        formulas = formulaAll[propertyName]
        if (!formulas) {
          return
        }
      } else {
        formulas = []
        Object.keys(formulaAll).forEach((items) => {
          formulaAll[items].forEach((item) => {
            formulas.push(item)
          })
        })
        if (formulas.length === 0) {
          return
        }
      }

      var singleFormulas
      switch (type) {
        case 0:
          singleFormulas = formulas.filter((item) => {
            return !item.type
          })
          break
        case 1:
          singleFormulas = formulas.filter((item) => {
            return !!item.type
          })
          break
        default:
          return formulas
      }

      if (singleFormulas.length == 0) {
        return
      }
      return singleFormulas
    }

  window.aggFormulaCalc = {
    Sum: function(data) {
      var result = 0
      for (var i = 0; i < data.length; i++) {
        result += data[i]
      }
      return result
    }
  }

  export const FormulaInternalCalc = function(isSingleCalc) {
    // eslint-disable-next-line one-var
    var _calcResult = {},
      _updateValues, _updateDataId, _mayAgg
    var _businessObjectMultDatas = {}

    const _updateResultValue = function(resultDataId, formula, result, bManual) {
      // eslint-disable-next-line one-var
      var id = resultDataId.toLowerCase(),
        info = _calcResult[id]
      if (!info) {
        info = {
          businessObjectId: formula.resultBusinessObjectId,
          resultGroupId: formula.resultGroupId,
          resultGroupType: formula.resultGroupType,
          propertyValues: {},
          normManual: {}
        }
        _calcResult[id] = info
      }
      info.propertyValues[formula.resultPropertyName] = result
      info.normManual[formula.resultPropertyName] = bManual
    }
    const _getSingleData = function(businessObjectId, businessDataId, resultGroupType, propertyFullName, propertyName, gridRow) {
      // eslint-disable-next-line one-var
      var value, data, id = businessDataId.toLowerCase()
      if (_updateValues && _updateDataId && _updateDataId == id) {
        value = _updateValues[propertyFullName]
      }
      if (value === undefined) {
        data = _calcResult[id]
        if (data) {
          if (data.normManual && data.normManual[propertyName]) {
            var mode = _formulaDataMng.getPropertyMode(propertyName)
            if (mode == 3) {
              value = data.propertyValues[propertyName]
            } else {
              value == undefined
            }
          } else {
            value = data.propertyValues[propertyName]
          }
        }
      }
      if (value == undefined && gridRow) {
        value = gridRow[propertyName]
      }
      if (value === undefined) {
        value = _formulaDataMng.getBusinessDataPropertyValue(businessObjectId, businessDataId, resultGroupType, propertyName, propertyFullName)
      }
      return _toNumber(value)
    }
    const _getMultData = function(businessObjectId, sumDataGroupId, propertyName, filterRule) {
      // 缓存用的key
      var key = businessObjectId
      if (sumDataGroupId) {
        key = key + '_' + sumDataGroupId
      }

      // eslint-disable-next-line one-var
      var propertyValueList = _businessObjectMultDatas[key],
        datas = []
      if (!propertyValueList) {
        propertyValueList = _formulaDataMng.getAllBusinessDataPropertyValue(businessObjectId, sumDataGroupId)
        _businessObjectMultDatas[key] = propertyValueList
      }
      // 进行条件过滤
      if (filterRule) {
        // 取表单的数据
        var formData = _formulaDataMng.getFormData
        propertyValueList = _filter(filterRule, propertyValueList, formData)
      }

      propertyValueList.forEach((propertyValue) => {
        // eslint-disable-next-line one-var
        var value, rowData, rowBusinessDataId = propertyValue[PKNAME]
        if (rowBusinessDataId) {
          if (typeof (rowBusinessDataId) !== 'string') {
            rowBusinessDataId = rowBusinessDataId.toString()
          } else {
            rowBusinessDataId = rowBusinessDataId.toLowerCase()
          }
        }

        if (_updateValues && _updateDataId && rowBusinessDataId == _updateDataId) {
          value = _updateValues['propertyName']
        }
        if (value === undefined) {
          rowData = _calcResult[rowBusinessDataId]
          if (rowData) {
            value = rowData.propertyValues[propertyName]
          }
        }
        if (value === undefined) {
          value = propertyValue[propertyName]
        }
        datas.push(_toNumber(value))
      })
      return datas
    }
    const _filter = function(rule, propertyValueList, formData) {
      if (!rule) {
        return propertyValueList
      }
      formData = formData || {}
      var lst = []
      propertyValueList.forEach((propertyValue) => {
        var bResult = _filterData(rule, propertyValue, formData)
        if (bResult) {
          lst.push(propertyValue)
        }
      })

      return lst
    }
    const _filterData = function(rule, propertyValue, formData) {
      if (rule == null) {
        return true
      }
      if (!rule.condition) {
        var tempArr = rule.id.split('.')
        var fieldName = tempArr[tempArr.length - 1]

        var fieldValue = propertyValue[fieldName]
        if (fieldValue === undefined) {
          fieldValue = formData[fieldName]
        }

        return CompareHelper.compare(rule.operator, fieldValue, rule.value, rule.type)
      } else if (rule.condition == 'AND') {
        var r = true
        rule.rules.find((childRule) => {
          r = r && _filterData(childRule, propertyValue, formData)
          if (r == false) {
            return true
          }
        })
        return r
      } else if (rule.condition == 'OR') {
        var r = false
        rule.rules.find((childRule) => {
          r = r || _filterData(childRule, propertyValue, formData)
          if (r == true) {
            return true
          }
        })
        return r
      }

      return true
    }
    const _calcFormula = function(formula, updateDataId, gridRow) {
      if (!formula.formulaCalcFn) {
        if (formula.type) {
          // 聚合运算
          formula.formulaCalcFn = new Function('data', 'return aggFormulaCalc.' + formula.formulaScript)
        } else {
          formula.formulaCalcFn = new Function('data', 'return ' + formula.formulaScript)
        }
      }
      // 准备数据
      var data, resultDataId
      // 允许手工录入
      var bManual = false
      if (formula.type) {
        data = _getMultData(formula.childBusinessObjectId, formula.sumDataGroupId, formula.data[0], formula.filterRule)
        // 没有汇总数据且允许手工录入时
        if (data.length == 0 && formula.manual == 1) {
          bManual = true
        }
        resultDataId = _formulaDataMng.getMainBusinessDataId
      } else {
        data = []
        var index = 0
        formula.data.forEach((propertyName) => {
          var propertyFullName = formula.fullData[index]
          data.push(_getSingleData(formula.resultBusinessObjectId, updateDataId, formula.resultGroupType, propertyFullName, propertyName, gridRow))
          index++
        })
        resultDataId = updateDataId
      }

      var decResult = _toNumber(math.round(formula.formulaCalcFn(data), formula.resultDec))

      // 如果结果是NaN或者是 无穷大,那么就返回0
      if (math.isNaN(decResult) || (isFinite(decResult) === false)) {
        decResult = 0
      }
      _updateResultValue(resultDataId, formula, decResult, bManual)

      var formulas = _getDependFormulas(formula.resultBusinessObjectId, isSingleCalc ? 0 : 2, formula.resultPropertyFullName)
      if (formulas) {
        formulas.forEach((item) => {
          _calcFormula(item, resultDataId, gridRow)
        })
      }
    }

    this.calc = function(mayAgg, formulas, updateDataId, updateValues, gridRow) {
      _mayAgg = mayAgg
      _updateDataId = updateDataId ? updateDataId.toLowerCase() : null
      _updateValues = updateValues
      formulas.forEach((formula) => {
        _calcFormula(formula, updateDataId, gridRow)
      })
    }
    this.getResult = function() {
      var item, result
      for (item in _calcResult) {
        result = _calcResult[item]
        break
      }
      return result
    }
  }

  var FormulaCalc = {
    init: function(formulaList, formulaDataMng) {
      // / <summary>
      // / 初始化公式
      // / </summary>
      // / <param name="formulaList" type="Array">公式</param>
      // / <param name="formulaDataMng" type="Object">
      // / {
      // /     getMainBusinessDataId: function()=>String,
      // /     getAllBusinessDataPropertyValue: function(businessObjectId)=>[{"BusinessDataGuid":"","属性1":1...}...],
      // /     getBusinessDataPropertyValue: function(businessObjectId, businessDataId, propertyName)=>Number,
      // /     resultDataUpdate: function(resultObjectPropertyValues)
      // / }
      // / </param>
      if (formulaList) {
        _item2Formula = _businessObjectFormula2ItemFormula(formulaList)
        _formulaDataMng = formulaDataMng
      }
    },
    updateSingleData: function(businessObjectId, businessDataId, propertyName, propertyValue, groupType) {
      // / <summary>
      // / 更新当前单个记录的数据
      // / </summary>
      // / <param name="propertyName" type="String">属性名称</param>
      // / <param name="propertyValue" type="type">属性值</param>
      var formulas = _getDependFormulas(businessObjectId, 0, propertyName)
      if (!formulas) {
        return
      }
      var updateValues = {}
      updateValues[propertyName] = _toNumber(propertyValue)

      if (groupType == 0) {
        // eslint-disable-next-line one-var
        var rptGroupFormulas = [],
          unRptGroupFormulas = []
        formulas.forEach((f) => {
          if (f.resultGroupType == 1) {
            rptGroupFormulas.push(f)
          } else {
            unRptGroupFormulas.push(f)
          }
        })
        if (rptGroupFormulas.length > 0) {
          // 不可重复分组的变更计算到可重复分组
          this.updateMultiData(businessDataId, rptGroupFormulas, updateValues)
        }
        if (unRptGroupFormulas.length > 0) {
          var formulaInternalCalc = new FormulaInternalCalc(true)
          formulaInternalCalc.calc(false, unRptGroupFormulas, businessDataId, updateValues)
          _formulaDataMng.resultDataUpdate(formulaInternalCalc.getResult())
        }
      } else {
        // eslint-disable-next-line no-redeclare
        var formulaInternalCalc = new FormulaInternalCalc(true)
        formulaInternalCalc.calc(false, formulas, businessDataId, updateValues)
        _formulaDataMng.resultDataUpdate(formulaInternalCalc.getResult())
      }
    },
    updateMultiData: function(businessDataId, formulas, updateValues) {
      var formulaInternalCalc = new FormulaInternalCalc(true)
      formulas.forEach((formula) => {
        var rows = _formulaDataMng.getRptGroupGridRows(formula.resultGroupId)
        var arrFormula = []
        arrFormula.push(formula)
        if (rows) {
          rows.forEach((row) => {
            formulaInternalCalc.calc(false, arrFormula, businessDataId, updateValues, row)
            _formulaDataMng.resultDataUpdate(formulaInternalCalc.getResult(), row)
          })
        }
      })
    },
    updateDependData: function(businessObjectId) {
      // / <summary>
      // / 更新受当前行数据变化而变化的其它业务对象数据
      // / </summary>
      // / <param name="businessObjectId" type="type">月舞对象id</param>
      // / <param name="normName" type="type">发生变更的指标名称</param>
      var formulas = _getDependFormulas(businessObjectId, 1)
      if (!formulas) {
        return
      }

      var formulaInternalCalc = new FormulaInternalCalc(false)
      formulaInternalCalc.calc(true, formulas)

      _formulaDataMng.resultDataUpdate(formulaInternalCalc.getResult())
    }
  }
// }
export default FormulaCalc
