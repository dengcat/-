import request from '@/utils/request'

export function getUserListByOrg(orgId) {
    return request({
        url: '/api/services/app/mdmUser/GetMdmUserListByOrg',
        method: 'post',
        params: { orgId: orgId }
    })
}

// 获取用户角色列表
export function getRoleUserListByOrg(data) {
    return request({
        url: '/api/services/app/mdmUser/GetMdmRoleUserListByOrg',
        method: 'post',
        data
    })
}