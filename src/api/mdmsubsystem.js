import request from '@/utils/request'

export function GetSubSystemList() {
    return request({
        url: '/api/services/app/mdmSubsystem/GetSubSystemList',
        method: 'post'
    })
}

export function GetSubSystemRoleList(buGuid) {
    return request({
        url: '/api/services/app/mdmSubsystem/GetSubSystemRoleList',
        method: 'post',
        params: { buGuid: buGuid }
    })
}

export function GetAllRolesList() {
    return request({
        url: '/api/services/app/mdmSubsystem/GetAllRolesList',
        method: 'post'
    })
}

export function AddSubSystem(data) {
    return request({
        url: '/api/services/app/mdmSubsystem/AddSubSystem',
        method: 'post',
        data
    })
}

export function EditSubSystem(data) {
    return request({
        url: '/api/services/app/mdmSubsystem/EditSubSystem',
        method: 'post',
        data
    })
}

export function RemoveSubSystem(data) {
    return request({
        url: '/api/services/app/mdmSubsystem/RemoveSubSystem',
        method: 'post',
        data
    })
}

export function GetSubSystemTreeData(buGuid) {
    return request({
        url: '/api/services/app/mdmSubsystem/GetSubSystemTreeData',
        method: 'post',
        params: { buGuid: buGuid }
    })
}

export function GetSubSystemTreeCol(data) {
    return request({
        url: '/api/services/app/mdmSubsystem/GetSubSystemTreeCol',
        method: 'post',
        data
    })
}

export function GetRolesListBySysCode(SystemCode, BuGUID) {
    return request({
        url: '/api/services/app/mdmSubsystem/GetRolesListBySysCode',
        method: 'post',
        params: { SystemCode: SystemCode, BuGUID: BuGUID }
    })
}

export function SaveSubSystemRole(data) {
    return request({
        url: '/api/services/app/mdmSubsystem/SaveSubSystemRole',
        method: 'post',
        data
    })
}