import request from '@/utils/request'

export function getParamValueList(data) {
  return request({
    url: `/api/services/app/paramSetting/GetParamValueList?paramCode=${data}`,
    method: 'post'
  })
}

export function getParamValueInfo(data) {
  return request({
    url: `/api/services/app/paramSetting/GetParamValueInfo?paramValueGuid=${data}`,
    method: 'post'
  })
}

export function getParamSettingList(data) {
  return request({
    url: `/api/services/app/paramSetting/GetParamSettingList?paramType=${data}`,
    method: 'post'
  })
}

export function getSysParamValueList() {
  return request({
    url: `/api/services/app/paramSetting/GetSysParamValueList`,
    method: 'post'
  })
}

export function saveParamValue(data) {
  return request({
    url: '/api/services/app/paramSetting/SaveParamValue',
    method: 'post',
    data
  })
}

export function saveSysParamValueList(data) {
  return request({
    url: '/api/services/app/paramSetting/SaveSysParamValueList',
    method: 'post',
    data
  })
}

export function deleteParamValue(data) {
  return request({
    url: `/api/services/app/paramSetting/DeleteParamValue?paramValueGuid=${data}`,
    method: 'post'
  })
}

export function getBasicDataTreeByParamName(data) {
  return request({
    url: `/api/services/app/basicData/GetBasicDataTreeByParamName?paramName=${data}`,
    method: 'post'
  })
}

export function getBasicDataTreeByParamCode(data) {
  return request({
    url: `/api/services/app/basicData/GetBasicDataTreeByParamCode?paramCode=${data}`,
    method: 'post'
  })
}

export function getBasicDataById(data) {
  return request({
    url: `/api/services/app/basicData/GetBasicDataById?id=${data}`,
    method: 'post'
  })
}

export function saveBasicData(data) {
  return request({
    url: '/api/services/app/basicData/SaveBasicData',
    method: 'post',
    data
  })
}

export function deleteBasicData(data) {
  return request({
    url: `/api/services/app/basicData/DeleteBasicData?id=${data}`,
    method: 'post'
  })
}

export function getSystemCodeFormatType(data) {
  return request({
    url: `/api/services/app/codeFormat/FindSystemCodeFormatType?appId=${data}`,
    method: 'post'
  })
}

export function getCodeFormatList(data) {
  return request({
    url: `/api/services/app/codeFormat/GetCodeFormatList?codeFormatTypeGuid=${data}`,
    method: 'post'
  })
}

export function saveCodeFormat(data) {
  return request({
    url: '/api/services/app/codeFormat/SaveCodeFormat',
    method: 'post',
    data
  })
}

export function checkProductCode(data) {
  return request({
    url: `/api/services/app/basicData/CheckProductCode?code=${data}`,
    method: 'post'
  })
}

export function checkProductName(data) {
  return request({
    url: `/api/services/app/basicData/CheckProductName?name=${data}`,
    method: 'post'
  })
}

export function getMdmEditionSetting() {
  return request({
    url: `/api/services/app/mdmEditionSetting/GetMdmEditionSetting`,
    method: 'post'
  })
}

export function saveEdition(data) {
  return request({
    url: `/api/services/app/mdmEditionSetting/SaveEdition`,
    method: 'post',
    data
  })
}

export function deleteEdition(data) {
  return request({
    url: `/api/services/app/mdmEditionSetting/DeleteEdition?paramValueGuid=${data}`,
    method: 'post',
  })
}

