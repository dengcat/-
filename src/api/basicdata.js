import request from '@/utils/request'

// 获取业务参数
export function getBasicDataTreeByParamName(data) {
  return request({
    url: `/api/services/app/basicData/GetBasicDataTreeByParamName?paramName=${escape(data)}`,
    method: 'post',
  })
}

// 获取业务参数
export function getParamValueListByParamName(data) {
  return request({
    url: `/api/services/app/paramSetting/GetParamValueListByParamName?paramName=${escape(data)}`,
    method: 'post',
  })
}

// 获取业务参数列表
export function getParamSettingList(data) {
  return request({
    url: `/api/services/app/paramSetting/GetParamSettingList?paramType=${escape(data)}`,
    method: 'post',
  })
}

// 查询用户
export function getMdmUserList(data) {
  return request({
    url: `/api/services/app/mdmUser/GetMdmUserList?userCodeOrName=${escape(data)}`,
    method: 'post',
  })
}

// 获取编码
export function getCodeSerialNumber(data) {
  return request({
    url: `/api/services/app/codeFormat/GetCodeSerialNumberPost`,
    method: 'post',
    data
  })
}

// 获取用户
export function getMailUserList(data) {
  return request({
    url: `/api/services/app/codeFormat/GetCodeSerialNumberPost`,
    method: 'post',
    data
  })
}

