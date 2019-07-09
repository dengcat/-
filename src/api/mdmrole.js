import request from '@/utils/request'

export function getBusinessUnitsIncludeProj() {
  return request({
    url: '/api/services/app/businessUnit/GetBusinessUnitsIncludeProj',
    method: 'post'
  })
}

export function getSystemAppFunctions() {
  return request({
    url: '/api/services/app/mdmSystem/GetSystemAppFunctions',
    method: 'post'
  })
}

export function getMdmRoles(data) {
  return request({
    url: '/api/services/app/mdmRole/GetMdmRoles',
    method: 'post',
    data
  })
}

export function getMdmRolesNotPaged(userId) {
  return request({
    url: '/api/services/app/mdmRole/GetMdmRolesNotPaged',
    method: 'post',
    params: { userId: userId }
  })
}

export function saveRole(data) {
  return request({
    url: '/api/services/app/mdmRole/SaveRole',
    method: 'post',
    data
  })
}


export function saveUserRole(data) {
  return request({
    url: '/api/services/app/mdmRole/SaveUserRoles',
    method: 'post',
    data
  })
}

export function getRole(roleId) {
  return request({
    url: '/api/services/app/mdmRole/GetRole',
    method: 'post',
    params: { roleId: roleId }
  })
}

export function delRole(roleId) {
  return request({
    url: '/api/services/app/mdmRole/DelRole',
    method: 'post',
    params: { roleId: roleId }
  })
}
