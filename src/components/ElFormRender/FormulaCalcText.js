const PKNAME = 'BusinessDataGuid'
let _item2Formula
let _formulaDataMng

// eslint-disable-next-line one-var
var _businessObjectFormula2ItemFormula = function(formulaList) {
  // eslint-disable-next-line one-var
  var item2Formula = {}, formulaAll

  formulaList.forEach((formula) => {
      // 只处理文本公式
      if (formula.type !== 'Concat') return

      var businessObjectId = formula.resultGroupType === 0 ? formula.resultBusinessObjectId : formula.resultGroupId
      businessObjectId = businessObjectId.toLowerCase()
      formulaAll = item2Formula[businessObjectId]
      if (!formulaAll) {
          formulaAll = {}
          item2Formula[businessObjectId] = formulaAll
      }
      formula.data.forEach((item) => {
          if (formulaAll[item]) { formulaAll[item].push(formula) } else { formulaAll[item] = [formula] }
      })

      businessObjectId = formula.parentBusinessObjectId
      businessObjectId = businessObjectId.toLowerCase()
      formulaAll = item2Formula[businessObjectId]
      if (!formulaAll) {
          formulaAll = {}
          item2Formula[businessObjectId] = formulaAll
      }
      formula.parentData.forEach((item) => {
          if (formulaAll[item]) { formulaAll[item].push(formula) } else { formulaAll[item] = [formula] }
      })
  })
  return item2Formula
},
_getDependFormulas = function(businessObjectId, type, propertyName) {
  // / <summary>
  // / 获取指定业务对象的依赖公式
  // / </summary>
  // / <param name="businessObjectId">源业务对象id</param>
  // / <param name="type">获取类别(0.只取本业务对象内部四则运算公式,1.只取受本业务对象影响的其它业务对象的汇总公式,2.取所有依赖公式)</param>
  // / <param name="propertyName">属性名称,可省略</param>
  if (!_item2Formula) { return }

  var formulaAll = _item2Formula[businessObjectId.toLowerCase()]
  if (!formulaAll) { return }
  var formulas
  if (propertyName) {
      formulas = formulaAll[propertyName]
      if (!formulas) { return }
  } else {
      formulas = []
      formulaAll.forEach((items) => {
          items.forEach((item) => {
              formulas.push(item)
          })
      })
      if (formulas.length === 0) { return }
  }

  var singleFormulas
  switch (type) {
      // case 0:
      //    singleFormulas = _.filter(formulas, function (item) {
      //        return !item.type;
      //    });
      //    break;
      // case 1:
      //    singleFormulas = _.filter(formulas, function (item) {
      //        return !!item.type;
      //    });
      //    break;
      default:
          return formulas
  }
}

var FormulaInternalCalc = function(isSingleCalc) {
  // / <summary>
  // /
  // / </summary>
  // eslint-disable-next-line one-var
  var _calcResult = {}, _updateValues, _updateDataId
  var _businessObjectMultDatas = {}

  // eslint-disable-next-line no-undef
  var _updateResultValue = function(resultDataId, formula, result) {
      // eslint-disable-next-line one-var
      var id = resultDataId.toLowerCase(), info = _calcResult[id]
      if (!info) {
          info = { businessObjectId: formula.resultBusinessObjectId, propertyValues: {}, resultGroupId: formula.resultGroupId, resultGroupType: formula.resultGroupType }
          _calcResult[id] = info
      }
      info.propertyValues[formula.resultPropertyName] = result
  }
  var _getSingleData = function(businessObjectId, businessDataId, resultGroupType, propertyName) {
      // eslint-disable-next-line one-var
      var value, data, id = businessDataId.toLowerCase()
      if (_updateValues && _updateDataId && _updateDataId == id) {
          value = _updateValues[propertyName]
      }
      if (value === undefined) {
          data = _calcResult[id]
          if (data) {
              value = data.propertyValues[propertyName]
          }
      }
      if (value === undefined) {
          value = _formulaDataMng.getBusinessDataPropertyValue(businessObjectId, businessDataId, resultGroupType, propertyName)
      }
      if (value === undefined) {
          value = ''
      }
      if (value === null) {
        value = ''
      }
      return value
  }
  var _calcFormula = function(formula, updateDataId) {
      if (!formula.formulaCalcFn) {
          formula.formulaCalcFn = new Function('data', 'parentData', 'return ' + formula.formulaScript)
      }
      // 准备数据
      var data, parentData, resultDataId

      data = []; parentData = []

      // 项目数据更新后，要更新地块及产品构成
      if (formula.parentData && formula.parentData.length > 0 && (formula.resultGroupType !== 0) && updateDataId === _formulaDataMng.getMainBusinessDataId()) {
          resultDataId = '属性数据'

          // data = _getMultData(formula.childBusinessObjectId, formula.data[0]);
          formula.data.forEach((item) => {
              data.push(_getSingleData((formula.resultGroupType === 0 ? formula.resultBusinessObjectId : formula.resultGroupId), resultDataId, formula.resultGroupType, item))
          })
          formula.parentData.forEach((item) => {
              parentData.push(_getSingleData(formula.parentBusinessObjectId, updateDataId, 0, item))
          })
      } else {
          formula.data.forEach((item) => {
              data.push(_getSingleData((formula.resultGroupType === 0 ? formula.resultBusinessObjectId : formula.resultGroupId), updateDataId, formula.resultGroupType, item))
          })
          formula.parentData.forEach((item) => {
              // 可重复分组的上级数据
              if (formula.resultGroupType !== 0) {
                  parentData.push(_getSingleData(formula.parentBusinessObjectId, _formulaDataMng.getMainBusinessDataId(), 0, item))
              // eslint-disable-next-line brace-style
              }
              // 对象的上级对象
              else {
                  parentData.push(_formulaDataMng.getBusinessDataPropertyValueEx(formula.parentBusinessObjectId, updateDataId, item))
              }
          })
          resultDataId = updateDataId
      }

      var decResult = formula.formulaCalcFn(data, parentData)
      _updateResultValue(resultDataId, formula, decResult)

      var formulas = _getDependFormulas(formula.resultGroupType == 0 ? formula.resultBusinessObjectId : formula.resultGroupId, isSingleCalc ? 0 : 2, formula.resultPropertyName)
      if (formulas) {
          formulas.forEach((item) => {
              _calcFormula(item, resultDataId)
          })
      }
  }

  this.calc = function(formulas, updateDataId, updateValues) {
      _updateDataId = updateDataId ? updateDataId.toLowerCase() : null
      _updateValues = updateValues
      formulas.forEach((formula) => {
          _calcFormula(formula, updateDataId)
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

var ns = {
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
  updateSingleData: function(businessObjectId, businessDataId, propertyName, propertyValue) {
      // / <summary>
      // / 更新当前单个记录的数据
      // / </summary>
      // / <param name="propertyName" type="String">属性名称</param>
      // / <param name="propertyValue" type="type">属性值</param>
      var formulas = _getDependFormulas(businessObjectId, 0, propertyName)
      if (!formulas) { return }

      var updateValues = {}
      updateValues[propertyName] = propertyValue
      var formulaInternalCalc = new FormulaInternalCalc(true)
      formulaInternalCalc.calc(formulas, businessDataId, updateValues)
      _formulaDataMng.resultDataUpdate(formulaInternalCalc.getResult())
  },
  updateDependData: function(businessObjectId) {
      // / <summary>
      // / 更新受当前行数据变化而变化的其它业务对象数据
      // / </summary>
      // / <param name="businessObjectId" type="type">月舞对象id</param>
      // / <param name="linePropertyValue" type="type">行属性数据集合</param>
      var formulas = _getDependFormulas(businessObjectId, 1)
      if (!formulas) { return }

      var formulaInternalCalc = new FormulaInternalCalc(false)
      formulaInternalCalc.calc(formulas)
      _formulaDataMng.resultDataUpdate(formulaInternalCalc.getResult())
  }
}

export default ns
