import request from '@/utils/request'

export const adminList = function(page, size, adminName) {
    return request({
        url: `/admin/list/${page}/${size}`,
        method: 'GET',
        params: { adminName }
    })
}

export const editAdmin = function(adminId, admin) {
    return request({
        url: `/admin/modify/${adminId}`,
        method: 'POST',
        data: admin
    })
}

export const warrant = function(adminId, roleIds) {
    return request({
        url: `/admin/warrant/${adminId}`,
        method: 'POST',
        data: roleIds
    })
}

export const add = function(admin) {
    return request({
        url: `/admin/add`,
        method: 'PUT',
        data: admin
    })
}

export const remove = function(adminId) {
    return request({
        url: `/admin/remove`,
        method: 'DELETE',
        data: [adminId]
    })
}

