import request from '@/utils/request'

export function getReportClassList() {
  return request({
    url: `/api/services/app/report/GetReportClassList`,
    method: 'post'
  })
}

export function getReportClassInfo(data) {
  return request({
    url: `/api/services/app/report/GetReportClassInfo?reportClassGuid=${data}`,
    method: 'post'
  })
}

export function deleteReportClass(data) {
  return request({
    url: `/api/services/app/report/DeleteReportClass?reportClassGuid=${data}`,
    method: 'post'
  })
}

export function saveReportClass(data) {
  return request({
    url: '/api/services/app/report/SaveReportClass',
    method: 'post',
    data
  })
}

export function getALLReportList() {
  return request({
    url: `/api/services/app/report/GetALLReportList`,
    method: 'post'
  })
}

export function getReportListByClass(data) {
  return request({
    url: `/api/services/app/report/GetReportListByClass?reportClassGuid=${data}`,
    method: 'post'
  })
}

export function getReportList(data) {
  return request({
    url: `/api/services/app/report/GetReportList`,
    method: 'post',
    data
  })
}

export function getReportInfo(data) {
  return request({
    url: `/api/services/app/report/GetReportInfo?reportGuid=${data}`,
    method: 'post'
  })
}

export function deleteReport(data) {
  return request({
    url: `/api/services/app/report/DeleteReport?reportGuid=${data}`,
    method: 'post'
  })
}

export function saveReport(data) {
  return request({
    url: '/api/services/app/report/SaveReport',
    method: 'post',
    data
  })
}
