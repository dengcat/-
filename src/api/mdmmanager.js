import request from '@/utils/request'

export function saveBusinessData(data) {
  return request({
    url: '/api/services/app/projectManage/SaveBusinessData',
    method: 'post',
    data
  })
}

export function getProjectInitData(data) {
  return request({
    url: `/api/services/app/projectManage/GetProjectInitData?buGuid=${data.buGuid}&templateGuid=${data.templateGuid}`,
    method: 'post',
  })
}

export function getBusinessUnits() {
  return request({
    url: `/api/services/app/businessUnit/GetBusinessUnits`,
    method: 'post',
  })
}

export function GetBusinessUnitsIncludDepartMent() {
  return request({
    url: `/api/services/app/businessUnit/GetBusinessUnitsIncludDepartMent`,
    method: 'post',
  })
}

export function getBusinessData(data) {
  return request({
    url: `/api/services/app/projectManage/GetPagedBusinessData`,
    method: 'post',
    data
  })
}

export function getProjectDetailBusinessData(data) {
  return request({
    url: `/api/services/app/projectManage/GetProjectDetailBusinessData?businessDataGuid=${data}`,
    method: 'post',
  })
}

export function getBusinessObjectData(data) {
  return request({
    url: `/api/services/app/projectManage/GetBusinessObjectData?businessDataGuid=${data}`,
    method: 'post',
  })
}

export function getBusinessObjectInitData(data) {
  return request({
    url: `/api/services/app/projectManage/GetBusinessObjectInitData?parentGuid=${data.parentGuid}&businessObjectGuid=${data.businessObjectGuid}`,
    method: 'post',
  })
}

// 发起审批
export function projectEditionProcessInitiate(data) {
  return request({
    url: `/api/services/app/projectManage/ProjectEditionProcessInitiate?businessDataGuid=${data}`,
    method: 'post',
  })
}

// 审批驳回
export function projectEditionProcessUnApproved(data) {
  return request({
    url: `/api/services/app/projectManage/ProjectEditionProcessUnApproved?businessDataGuid=${data}`,
    method: 'post',
  })
}

// 审批通过
export function projectEditionProcessApproved(data) {
  return request({
    url: `/api/services/app/projectManage/ProjectEditionProcessApproved?businessDataGuid=${data}`,
    method: 'post',
  })
}

// 激活修订
export function projectActivateEdition(data) {
  return request({
    url: `/api/services/app/projectManage/ProjectActivateEdition`,
    method: 'post',
    data
  })
}

// 取消修订
export function projectUnActivateEdition(data) {
  return request({
    url: `/api/services/app/projectManage/ProjectUnActivateEdition?businessDataGuid=${data}`,
    method: 'post',
  })
}

// 获取修改值
export function buildDiffDataList(data) {
  return request({
    url: `/api/services/app/projectManage/BuildDiffDataList`,
    method: 'post',
    data
  })
}

// 获取产品类型
export function getBelongProductListByParentId(data) {
  return request({
    url: `/api/services/app/projectManage/GetBelongProductListByParentId?parentBusinessDataGuid=${data.parentBusinessDataGuid}&businessObjectGuid=${data.businessObjectGuid}`,
    method: 'post',
  })
}

// 删除
export function deleteBusinessData(data) {
  return request({
    url: `/api/services/app/projectManage/DeleteBusinessData?businessDataGuid=${data}`,
    method: 'post',
  })
}

// 取消删除
export function unDeleteBusinessData(data) {
  return request({
    url: `/api/services/app/projectManage/UnDeleteBusinessData?businessDataGuid=${data}`,
    method: 'post',
  })
}

// 上传文件
export function upload(data, file) {
  return request({
    url: `/api/services/app/fileManager/Upload`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
      file.onProgress({
        percent: complete
      })
    },
    data
  })
}

export function getProjectDetailBusinessDataWithEditionList(data) {
  return request({
    url: `/api/services/app/projectManage/GetProjectDetailBusinessDataWithEditionList?businessDataGuid=${data.businessDataGuid}`,
    method: 'post',
  })
}

export function getBusinessEditionDataByBusinessDataGuid(data) {
  return request({
    url: `/api/services/app/projectManage/getBusinessEditionDataByBusinessDataGuid?businessDataGuid=${data}`,
    method: 'post',
  })
}

export function getVersionContrastResultForMVersions(data) {
  return request({
    url: `/api/services/app/projectManage/GetVersionContrastResultForMVersions`,
    method: 'post',
    data
  })
}

export function getVersionContrastResultForCollectionPropertyMVersions(data) {
  return request({
    url: `/api/services/app/projectManage/getVersionContrastResultForCollectionPropertyMVersions`,
    method: 'post',
    data
  })
}

export function getBusinessDataDetailByKey(data) {
  return request({
    url: `/api/services/app/mdmOpenInterface/GetBusinessDataDetailByKey`,
    method: 'post',
    data
  })
}

// 项目版本详情-项目对象列表
export function getProjectDetailBySerialNo(data) {
  return request({
    url: `/api/services/app/projectManage/GetProjectDetailBySerialNo?businessDataGUID=${data.businessDataGUID}${data.serialNo ? `&serialNo=${data.serialNo}` : ''}`,
    method: 'post',
  })
}

// 项目版本详情-项目对象列表
export function getEditionGridForDetail(data) {
  return request({
    url: `/api/services/app/projectManage/GetEditionGridForDetail?businessDataGUID=${data.businessDataGUID}${data.serialNo ? `&serialNo=${data.serialNo}` : ''}`,
    method: 'post',
  })
}

// 重新分发
export function reDistributeProjects(data) {
  return request({
    url: `/api/services/app/projectManage/ReDistributeProjects`,
    method: 'post',
    data
  })
}

// 获取分发日志
export function getDistributeLog(data) {
  return request({
    url: `/api/services/app/projectManage/GetPagedDistributeLog`,
    method: 'post',
    data
  })
}

export function exportBusinessDataExcel(data) {
  return request({
    url: `/api/services/app/projectManage/ExportExcel?businessDataGuid=${data}`,
    method: 'get'
  })
}



//******************实施纲要相关******************************************** */





//************************************************************************ */

