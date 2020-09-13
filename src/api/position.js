import request from '@/utils/request'

export const positionList = function (page, size, searchQuery) {
    return request({
        url: `/position/list/${page}/${size}`,
        method: 'POST',
        data: searchQuery
    })
}

export const editPosition = function (positionId, position) {
    return request({
        url: '/position/modify/' + positionId,
        method: 'POST',
        data: position
    })
}

export const removePosition = function (positionId) {
    return request({
        url: '/position/remove/' + positionId,
        method: 'DELETE'
    })
}
