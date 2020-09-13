import request from '@/utils/request.js'

export const companyList = function(page, size, status) {
    return request({
        url: `/company/list/${page}/${size}?status=${status}`,
        method: 'POST'
    })
}

export const editCompany = function(companyId, company) {
    return request({
        url: `/company/modify/${companyId}`,
        method: 'POST',
        data: company
    })
}

export const certification = function(companyId) {
    return request({
        url: `/company/certification/${companyId}`,
        method: 'POST'
    })
}