import request from '@/utils/request'

export const roleList = function(page, size, roleName) {
    return request({
        url: `/role/list/${page}/${size}`,
        method: 'GET',
        params: { roleName }
    })
}

export const save = function(role) {
    return request({
        url: `/role/save`,
        method: 'PUT',
        data: role
    })
}

export const modify = function(roleId, role) {
    return request({
        url: `/role/modify/` + roleId,
        method: 'POST',
        data: role
    })
}

export const remove = function(roleId) {
    return request({
        url: `/role/remove/${roleId}`,
        method: 'DELETE'
    })
}

export const addPermission = function(roleId, permissionIds) {
    return request({
        url: `/role/addPermission/${roleId}`,
        method: 'POST',
        data: permissionIds
    })
}