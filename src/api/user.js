import request from '@/utils/request'

export const userList = function(page, size, searchQuery) {
    return request({
        url: `/user/list/${page}/${size}`,
        method: 'POST',
        data: searchQuery
    })
}

export const editUser = function(userId, user) {
    return request({
        url: '/user/modify/' + userId,
        method: 'POST',
        data: user
    })
}

export const deleteUser = function(userId) {
    return request({
        url: '/user/remove/' + userId,
        method: 'DELETE'
    })
}

export const userStatus = function(userId, status) {
    return request({
        url: '/user/updateStatus/' + userId,
        method: 'POST',
        params: { status }
    })
}