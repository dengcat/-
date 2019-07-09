export function _getFormulaType(formulaText) {
  switch (formulaText.substr(0, 3).toLowerCase()) {
    case 'sum':
      return 'SUM'
    default:
      return ''
  }
}

export function _aggFormulaToObj(formulaText, formulaType, getBusinessObjectInfoFn) {
  const startIndex = formulaText.indexOf('[')
  const endIndex = formulaText.lastIndexOf(']')
  const arrData = formulaText.substr(startIndex + 1, endIndex - startIndex - 1).split('.')
  if (arrData.length !== 2 && arrData.length !== 3) {
    throw new Error('公式格式不正确.')
  }

  const businessObjectInfo = getBusinessObjectInfoFn(arrData)
  if (businessObjectInfo == null) {
    throw new Error('指定的业务对象[' + arrData[0] + ']没有找到。')
  }

  let childBusinessObjectId, sumDataGroupId, childIsPropertyObject

  if (businessObjectInfo.isPropertyObject) {
    childBusinessObjectId = businessObjectInfo.parentId
    sumDataGroupId = businessObjectInfo.id
    childIsPropertyObject = true
  } else {
    childBusinessObjectId = businessObjectInfo.id
    childIsPropertyObject = false
  }

  return {
    childBusinessObjectId: childBusinessObjectId,
    childIsPropertyObject: childIsPropertyObject,
    sumDataGroupId: sumDataGroupId,
    data: [arrData[arrData.length - 1]]
  }
}

export function _arithmeticFormulaToObj(formulaText, resultParentName) {
    resultParentName = resultParentName + '.'
    while (formulaText.indexOf(resultParentName) >= 0) {
      formulaText = formulaText.replace(resultParentName, '')
    }

    const regex = new RegExp('\\[([^\\]]*)\\]', 'g')
    const list = []
    const formulaScript = formulaText.replace(regex, ($1, $2) => {
      let index = list.indexOf($2)
      if (index < 0) {
        index = list.length
        list.push($2)
      }
      return 'data[' + index + ']'
    })

    return {
      formulaScript: formulaScript.replace(/÷/ig, '/'),
      data: list
    }
  }
  export function _concatFormulaToObj(formulaText, resultParentName, formulaType, getBusinessObjectInfoFn) {
    // 与结果字段所在父级相同，则为data。否则parentData
    resultParentName = resultParentName + '.'
    while (formulaText.indexOf(resultParentName) >= 0) {
      formulaText = formulaText.replace(resultParentName, '')
    }

    // 转换为字符串公式表达式
    formulaText = '"' + formulaText.replace(/\[/g, '"+[').replace(/\]/g, ']+"') + '"'

    const regex = new RegExp('\\[([^\\.\\]]*)\\]', 'g')
    const list = []
    let formulaScript = formulaText.replace(regex, ($1, $2) => {
      let index = list.indexOf($2)
      if (index < 0) {
        index = list.length
        list.push($2)
      }
      return 'data[' + index + ']'
    })

    const parentRegex = new RegExp('\\[([^\\d\\]][^\\]]*)\\]', 'g')
    const parentlist = []
    let parentBusinessObjectId = '00000000-0000-0000-0000-000000000000'
    let resultGroupType
    formulaScript = formulaScript.replace(parentRegex, ($1, $2) => {
      const arrData = $2.split('.')
      if (arrData.length !== 2 && arrData.length !== 3) {
        throw new Error('公式格式不正确.')
      }

      const businessObjectInfo = getBusinessObjectInfoFn(arrData[0])
      if (businessObjectInfo == null) {
        throw new Error('指定的业务对象[' + arrData[0] + ']没有找到。')
      }
      parentBusinessObjectId = businessObjectInfo.businessObjectId
      resultGroupType = businessObjectInfo.resultGroupType

      let index = parentlist.indexOf(arrData[1])
      if (index < 0) {
        index = parentlist.length
        parentlist.push(arrData[1])
      }
      return 'parentData[' + index + ']'
    })

    return {
      formulaScript: formulaScript,
      type: 'Concat',
      parentBusinessObjectId: parentBusinessObjectId,
      data: list,
      parentData: parentlist,
      resultGroupType: resultGroupType
    }
  }

export function convertToFormulaObj(resultBusinessObjectId, formulaInfo, getBusinessObjectInfoFn) {
    // / <summary>
    // / 转换到json格式公式
    // / </summary>
    // / <param name="resultBusinessObjectId"></param>
    // / <param name="formula">ui公式</param>
    // / <param name="getBusinessObjectInfoFn">用于获取指定业务对象信息,签名如下
    // / function(businessObjectName)=>{businessObjectId: "", isPropertyObject: true/false}
    // / </param>
    // / <returns></returns>
    // / <remarks>
    // / ex: 总建筑面积=SUM([工程楼栋.可售面积])
    // / {
    // /	    "formulaScript": "Sum(data)",
    // /	    "resultBusinessObjectId": "",
    // /	    "resultPropertyName": "",
    // /	    "type": "SUM",
    // /	    "childBusinessObjectId": "49721112-DFB3-4CEA-8233-E8C76480984C",
    // /	    "isPropertyObject": false,
    // /	    "data": ["面积"]
    // / }
    // / ex: 总建筑面积=[地上面积]+[地下面积]
    // / {
    // /    "formulaScript": "data[0]+data[1]",
    // /	    "resultBusinessObjectId": "",
    // /	    "resultPropertyName": "",
    // /    "data": ["地上面积","地下面积"]
    // / }
    // / </remarks>
    let formulaText = formulaInfo.formulaConditionTextField || formulaInfo.formulaConditionText
    if (formulaText == null) {
      return null
    }

    const arrFormula = formulaText.split('=')
    if (arrFormula.length !== 2) {
      throw new Error('公式格式不正确.')
    }

    formulaText = arrFormula[1].trim()
    if (!formulaText) {
      return null
    }

    // const formulaType = _getFormulaType(formulaText), formulaObj;
    const formulaType = formulaInfo.formulaType
    let formulaObj
    switch (formulaType) {
      case 'SUM':
        formulaObj = _aggFormulaToObj(formulaText, formulaType, getBusinessObjectInfoFn)
        formulaObj.formulaScript = 'Sum(data)'
        break
      case 'Concat':
        formulaObj = _concatFormulaToObj(formulaText, formulaInfo.resultParentName, formulaType, getBusinessObjectInfoFn)
        break
      case 'DateMax':
        formulaObj = _aggFormulaToObj(formulaText, formulaType, getBusinessObjectInfoFn)
        formulaObj.formulaScript = 'Max(data)'
        break
      case 'DateMin':
        formulaObj = _aggFormulaToObj(formulaText, formulaType, getBusinessObjectInfoFn)
        formulaObj.formulaScript = 'Min(data)'
        break
      case 'DateSetValue':
        formulaObj = _aggFormulaToObj(formulaText, formulaType, getBusinessObjectInfoFn)
        formulaObj.formulaScript = 'parentData[0]'
        formulaObj.parentData = formulaObj.data
        formulaObj.data = []

        formulaObj.parentBusinessObjectId = formulaObj.childBusinessObjectId
        delete formulaObj.childBusinessObjectId
        break
      default:
        formulaObj = _arithmeticFormulaToObj(formulaText, formulaInfo.resultParentName)
    }

    formulaObj.type = formulaType
    formulaObj.resultBusinessObjectId = resultBusinessObjectId
    formulaObj.resultPropertyName = arrFormula[0].trim()

    return formulaObj
  }
