import { Form } from 'element-ui'
import CompareHelper from './CompareHelper.js'
import FormulaCalc from './FormulaCalc'
import FormulaCalcText from './FormulaCalcText'
/**
 * 该 mixin 负责处理渲染时需要使用的公共函数
 */
export default {
  props: Object.assign({}, Form.props, {
    content: {
      type: Array,
      required: true
    },
    // 禁用所有表单
    disabled: {
      type: Boolean,
      default: false
    },
    formdata: {
      type: Object
    },
    initData: {
      type: Object
    },
    mode: {
      type: String
    },
    businessObject: {
      type: Object
    }
  }),
  data() {
    return {
      mainBusinessObjectGuid: this.initData.data.businessObjectGuid ? this.initData.data.businessObjectGuid.toUpperCase() : '',
      parentData: this.initData.data.parentData,
    }
  },
  methods: {
    getPropertyMode(propertyName) {
      // var c = ns.form.get(propertyName);
      // if (c) { return c.getMode(); }
      return 3
    },
    getAllBusinessDataPropertyValue(businessObjectId, sumDataGroupId) {
      let griddata = []
      const grid = this.initData.collectionPropertyGrids.find(
        item => {
          if (item.groupId === sumDataGroupId) {
            return true
          }
        }
      )
      griddata = this.savedata[grid.collectionPropertyObjectName]
      return griddata
      // to 可重复分组的数据值
      // var data;
      // _.find(ns.collectionPropertyGrids, function(item) {
      //   if (item.GroupId == sumDataGroupId && item.Grid) {
      //     data = item.Grid.getData(); //可重复分组
      //     return true;
      //   }
      // });
      // return data;
    },
    getBusinessDataPropertyValue(
      businessObjectId,
      businessDataId,
      reusltGroupType,
      propertyName,
      propertyFullName,
      rowId
    ) {
      var value
      switch (reusltGroupType) {
        case 0: // 不可重复分组
          value = this.savedata[propertyName]
          break
        case 1: // 可重复分组
          // value = this.savedata[propertyName]
          value = this.currEditRow[propertyName]
      }
      if (value === undefined && propertyFullName) {
        var arr = propertyFullName.split('.')
        if (arr.length === 2) {
          // eslint-disable-next-line one-var
          var id = arr[0],
            normName = arr[1]
          if (id.toUpperCase() === businessObjectId.toUpperCase()) {
            var arrPropertyName = propertyName.split('.')
            propertyName = arrPropertyName[1] || arrPropertyName[0]

            value = this.savedata[propertyName]
            // var subControl = ns.form.get(propertyName);
            // if (subControl) {
            //   value = subControl.getValue();
            // } else {
            //   value = ns.subFormData[propertyName];
            // }
          } else {
            this.initData.collectionPropertyGrids.find((item) => {
              if (item.groupId.toUpperCase() === id.toUpperCase()) {
                var rows = this.savedata[item.collectionPropertyObjectName]
                rows.find((row) => {
                  if (row.businessDataGuid === rowId) {
                    value = row[propertyName]
                    return true
                  }
                })

                return true
              }
            })
          }
        }
      }

      return value
    },
    getRptGroupGridRows: function(groupId) {
      var rows

      this.initData.collectionPropertyGrids.find((item, name) => {
        if (item.groupId.toUpperCase() === groupId.toUpperCase() && item.Grid) {
          rows = item.Grid.getRows()
          return true
        }
      })

      return rows
    },
    /**
     * resultObjectPropertyValues:
     * {
     *      "businessObjectId": "",
     *      "propertyValues": {
     *          "属性名":"属性值" ,
     *          "属性名":"属性值"
     *          ...
     *      }
     * }
     */
    resultDataUpdate: function(resultObjectPropertyValues, gridRow) {
      // eslint-disable-next-line one-var
      var resultGroupId = resultObjectPropertyValues.resultGroupId,
        resultGroupType = resultObjectPropertyValues.resultGroupType,
        normManual = resultObjectPropertyValues.normManual || {}

      switch (resultGroupType) {
        case 0: // 不可重复分组
          this.savedata = Object.assign(this.savedata, resultObjectPropertyValues.propertyValues)
          break

        case 1: // 可重复分组
          this.currEditRow = Object.assign(this.currEditRow, resultObjectPropertyValues.propertyValues)
          break
      }
    },
    getBusinessDataPropertyValueEx(businessObjectId, businessDataId, propertyName) {
      switch (businessObjectId.toUpperCase()) {
        case this.mainBusinessObjectGuid:
          return this.savedata[propertyName]
        default: // 父级
          return this.parentData[propertyName]
      }
    },
    handNumValueEvent(item, val, row) {
      if (row && row.groupType === 1) {
        this.handGridCellNumValuechanged(item, val, row)
      } else {
        this.handNumValuechanged(item, val)
      }
    },
    handNumValuechanged(item, val) {
      if (this.mode === 3) return
      const subFormData = this.savedata

      var businessObjectId = this.businessObject.businessObjectGUID
      if (!businessObjectId) return
      var businessDataId = '主数据'
      var propertyName = item.fieldName || item.name
      var propertyValue = val
      var groupType = 0

      var propertyFullName =
        businessObjectId.toLowerCase() + '.' + propertyName
      FormulaCalc.updateSingleData(
        businessObjectId,
        businessDataId,
        propertyFullName,
        propertyValue,
        groupType
      )

      // 作为汇总公式的条件影响了计算场景
      FormulaCalc.updateDependData(businessObjectId)
    },

    // 可重复分组列表数值型单元格发生变化时需要触发的方法
    handGridCellNumValuechanged(item, val) {
      if (this.mode === 3) return

      var businessObjectId = this.businessObject.businessObjectGUID

      var businessDataId = '主数据'
      var propertyName = item.fieldName || item.name
      var propertyValue = val
      var groupId = item.groupId
      // if (!groupId) {
      //   var grid = e.sender.getParent().getParent()
      //   var gridInfo = _.find(this.collectionPropertyGrids, function (r) {
      //     return r.Grid == grid;
      //   })
      //   if (gridInfo) {
      //     groupId = gridInfo.GroupId;
      //   }
      // }

      propertyName = groupId + '.' + propertyName
      FormulaCalc.updateSingleData(businessObjectId, businessDataId, propertyName, propertyValue)

      // 作为汇总公式的条件影响了计算场景
      FormulaCalc.updateDependData(businessObjectId)
    },

    handTextValueEvent(item, val, row) {
      if (row && row.groupType === 1) {
        this.handGridCellTextValuechanged(item, val, row)
      } else {
        this.handTextValuechanged(item, val)
      }
    },
    updateSUMData() {
      FormulaCalc.updateDependData(this.mainBusinessObjectGuid)
    },
    // 文本型控件发生变化时需要触发的方法
    handTextValuechanged(item, val) {
      // todo 详细地址改变
      if (this.mode === 3) {
        return
      }
      var businessObjectId = this.mainBusinessObjectGuid
      if (!businessObjectId) { return }
      var businessDataId = '主数据'
      var propertyName = item.fieldName || item.name
      var propertyValue = val
      FormulaCalcText.updateSingleData(businessObjectId, businessDataId, propertyName, propertyValue)
      // 作为汇总公式的条件影响了计算场景
      // FormulaCalc.updateDependData(businessObjectId)
    },
    handGridCellTextValuechanged(item, val, row) {
      if (this.mode === 3) {
        return
      }
      // this.subFormData = e.row
      var businessObjectId = item.groupId
      // 找到当前单元格所在的网格
      // var grid
      // _.find(this.collectionPropertyGrids, function(item) {
      //   var allRows = item.Grid.getAllRows()
      //   if (_.find(allRows, function(row) {
      //       return row === e.row
      //     })) {
      //     grid = item.Grid
      //     if (!businessObjectId) {
      //       businessObjectId = item.GroupId
      //     }
      //     return true
      //   }
      // })

      var propertyName = item.fieldName || item.name
      var propertyValue = val
      // 对于treeselect控件, 公式计算使用文本计算
      // if (e.sender.getType() == 'ux-treeselect') {
      //   propertyValue = e.sender.getText()
      // } else {
      //   propertyValue = e.sender.getValue()
      // }

      // 产品类型的值变更时, 需要更新隐藏列产品类型简称的值
      // if (propertyName == '产品类型' && grid) {
      //   var selected = e.sender.getSelectedRow()
      //   var shortText = selected.text
      //   var editor = grid.getCellEditor('产品类型_shortName', e.row)
      //   editor && editor.setValue && editor.setValue(shortText)
      //   editor = grid.getCellEditor('产品类型_code', e.row)
      //   var code = selected.extData.code
      //   editor && editor.setValue && editor.setValue(code)
      // }

      FormulaCalcText.updateSingleData(businessObjectId, '属性数据', propertyName, propertyValue)

      // 作为汇总公式的条件影响了计算场景
      // FormulaCalc.updateDependData(this.businessObject.businessObjectGUID)
    },
  },
  created() {
    FormulaCalc.init(this.initData.formulas, {
      getMainBusinessDataId: '主数据',
      getPropertyMode: this.getPropertyMode,
      getFormData: this.savedata,
      getAllBusinessDataPropertyValue: this.getAllBusinessDataPropertyValue,
      getBusinessDataPropertyValue: this.getBusinessDataPropertyValue,
      getRptGroupGridRows: this.getRptGroupGridRows,
      resultDataUpdate: this.resultDataUpdate
    })

    FormulaCalcText.init(this.initData.formulas, {
      getMainBusinessDataId: '主数据',
      getAllBusinessDataPropertyValue: this.getAllBusinessDataPropertyValue,
      getBusinessDataPropertyValue: this.getBusinessDataPropertyValue,
      getBusinessDataPropertyValueEx: this.getBusinessDataPropertyValueEx,
      resultDataUpdate: this.resultDataUpdate
    })
  }
}
