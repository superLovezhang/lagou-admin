import request from '@/utils/request'

export const tree = function() {
    return request({
        url: '/permission/tree',
        method: 'GET'
    })
}

export const save = function(permission) {
    return request({
        url: '/permission/save',
        method: 'PUT',
        data: permission
    })
}

export const remove = function(permissionId) {
    return request({
        url: '/permission/remove/' + permissionId,
        method: 'DELETE'
    })
}

export const modify = function(permissionId, permission) {
    return request({
        url: '/permission/modify/' + permissionId,
        method: 'POST',
        data: permission
    })
}