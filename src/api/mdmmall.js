import request from '@/utils/request'

export function getBusinessUnitsIncludeProj() {
  return request({
    url: '/api/services/app/notificationManage/GetBusinessUnitsIncludeProj',
    method: 'post'
  })
}

export function enable(data) {
  return request({
    url: `/api/services/app/notificationManage/Enable?notificationGUID=${data}`,
    method: 'post'
  })
}

export function disable(data) {
  return request({
    url: `/api/services/app/notificationManage/Disable?notificationGUID=${data}`,
    method: 'post'
  })
}

export function getImportedUser(data) {
  return request({
    url: `/api/services/app/notificationManage/GetImportedUser?businessDataGUID=${data}`,
    method: 'post'
  })
}

export function addNotificationManage(data) {
  return request({
    url: `/api/services/app/notificationManage/AddNotificationManage`,
    method: 'post',
    data
  })
}
