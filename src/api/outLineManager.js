import request from '@/utils/request'

export function getStages(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/GetPagedStages`,
    method: 'post',
    data
  })
}

export function getMpiBasicInfo(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/getMpiBasicInfo?mpiVersionGuid=${data}`,
    method: 'post',
    data
  })
}

export function createMpiVersion(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/CreateMpiVersion`,
    method: 'post',
    data
  })
}

export function saveMpiVersion(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/ModfiyMpiVersion`,
    method: 'post',
    data
  })
}

export function getPagedMpiVersions(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/GetPagedMpiVersions`,
    method: 'post',
    data
  })
}

export function getDepartmentByBuGuid(data) {
  return request({
    url: `/api/services/app/businessUnit/GetDepartmentByBuGuid?buGuid=${data}`,
    method: 'post',
  })
}

export function changeYearDimension(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/ChangeYearDimension`,
    method: 'post',
    data
  })
}

export function deleteTemplate(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/DelMpiVersion?mpiVersionGuid=${data}`,
    method: 'post'
  })
}

export function getMpiOutLineStep(data) {
  return request({
    url: `/api/services/app/mpiVersionManage/GetMpiOutLineStep?mpiVersionGuid=${data}`,
    method: 'post'
  })
}

export function checkBusinessDataIsNew(stagesId, projectVersion) {
  return request({
    url: `/api/services/app/mpiVersionManage/CheckBusinessDataIsNew?stagesId=${stagesId}&projectVersion=${projectVersion}`,
    method: 'post'
  })
}
/* 业务参数 begin */
export function getParamValueList(data) {
  return request({
    url: `/api/services/app/MpiParamSetting/GetParamValueList?paramCode=${data}`,
    method: 'post'
  })
}

export function getParamValueInfo(data) {
  return request({
    url: `/api/services/app/MpiParamSetting/GetParamValueInfo?paramValueGuid=${data}`,
    method: 'post'
  })
}

export function getParamSettingList(data) {
  return request({
    url: `/api/services/app/MpiParamSetting/GetParamSettingList?paramType=${data}`,
    method: 'post'
  })
}

export function getSysParamValueList() {
  return request({
    url: `/api/services/app/MpiParamSetting/GetSysParamValueList`,
    method: 'post'
  })
}

export function saveParamValue(data) {
  return request({
    url: '/api/services/app/MpiParamSetting/SaveParamValue',
    method: 'post',
    data
  })
}

export function saveSysParamValueList(data) {
  return request({
    url: '/api/services/app/MpiParamSetting/SaveSysParamValueList',
    method: 'post',
    data
  })
}

export function deleteParamValue(data) {
  return request({
    url: `/api/services/app/MpiParamSetting/DeleteParamValue?paramValueGuid=${data}`,
    method: 'post'
  })
}

/* 业务参数 end */