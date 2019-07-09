import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/services/app/template/GetPagedTemplates',
    method: 'post',
    data
  })
}

export function fetchBusinessObject(data) {
  return request({
    url: '/api/services/app/businessObject/GetBusinessObjects',
    method: 'post',
    data
  })
}

export function addTemplate(data) {
  return request({
    url: '/api/services/app/template/CreateTemplate',
    method: 'post',
    data
  })
}

export function getTemplateBusinessObjectList(data) {
  return request({
    url: '/api/services/app/template/GetTemplateBusinessObjectList',
    method: 'post',
    data
  })
}

export function saveNorm(data) {
  return request({
    url: '/api/services/app/template/SaveNorm',
    method: 'post',
    data
  })
}

export function saveNormGroup(data) {
  return request({
    url: '/api/services/app/template/SaveNormGroup',
    method: 'post',
    data
  })
}

export function deleteGroup(data) {
  return request({
    url: `/api/services/app/template/DeleteNormGroup?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}`,
    method: 'post',
  })
}

export function deletePropery(data) {
  return request({
    url: `/api/services/app/template/DeleteNorm?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}`,
    method: 'post',
  })
}

export function getBusinessObjectTreeForStringConcatFormula(data) {
  return request({
    url: `/api/services/app/template/GetBusinessObjectTreeByFormulaType?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}&formulaType=${escape(data.formulaType)}`,
    method: 'post',
  })
}

export function deleteTemplate(data) {
  return request({
    url: `/api/services/app/template/DeleteTemplate`,
    method: 'post',
    data
  })
}

export function normMoveUp(data) {
  return request({
    url: `/api/services/app/template/NormMoveUp?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}&formulaType=${escape(data.formulaType)}`,
    method: 'post',
  })
}

export function normMoveDown(data) {
  return request({
    url: `/api/services/app/template/NormMoveDown?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}&formulaType=${escape(data.formulaType)}`,
    method: 'post',
  })
}
export function groupMoveUp(data) {
  return request({
    url: `/api/services/app/template/NormGroupMoveUp?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}`,
    method: 'post',
  })
}

export function groupMoveDown(data) {
  return request({
    url: `/api/services/app/template/NormGroupMoveDown?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}`,
    method: 'post',
  })
}

export function getFormula(data) {
  return request({
    url: `/api/services/app/template/GetFormula?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}`,
    method: 'post',
  })
}

export function saveFormula(data, queryData) {
  return request({
    url: `/api/services/app/template/SaveFormula?templateGuid=${queryData.templateGuid}&businessObjectGuid=${queryData.businessObjectGuid}&normGroupId=${queryData.normGroupId}&normId=${queryData.normId}`,
    method: 'post',
    data
  })
}

export function getFormulaRule(data) {
  return request({
    url: `/api/services/app/template/GetFormulaRule?templateGuid=${data.templateGuid}&oLeftGuid=${data.oLeftGuid}&resultNormId=${data.resultNormId}&oRightGuid=${data.oRightGuid}&beSumedNormId=${data.beSumedNormId}`,
    method: 'post'
  })
}

export function publishTemplate(data) {
  return request({
    url: `/api/services/app/template/PublishTemplate?templateGuid=${data.templateGuid}`,
    method: 'post'
  })
}

export function cancelPublishTemplate(data) {
  return request({
    url: `/api/services/app/template/CancelPublishTemplate?templateGuid=${data.templateGuid}`,
    method: 'post'
  })
}

export function getPublishTemplate(data) {
  return request({
    url: `/api/services/app/template/GetPublishTemplate`,
    method: 'post'
  })
}

export function getTemplatesState(data) {
  return request({
    url: `/api/services/app/template/GetTemplatesState?input=${data}`,
    method: 'post'
  })
}

export function setPrimaryKey(data) {
  return request({
    url: `/api/services/app/template/SetPrimaryKey?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}`,
    method: 'post'
  })
}

export function cancelPrimaryKey(data) {
  return request({
    url: `/api/services/app/template/CancelPrimaryKey?templateGuid=${data.templateGuid}&businessObjectGuid=${data.businessObjectGuid}&normGroupId=${data.normGroupId}&normId=${data.normId}`,
    method: 'post'
  })
}

export function copyTemplate(data) {
  return request({
    url: `/api/services/app/template/CopyTemplate`,
    method: 'post',
    data
  })
}
