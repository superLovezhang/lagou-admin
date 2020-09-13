import request from '@/utils/request.js'

export const employeeList = function(page, size, status) {
    return request({
        url: `/employee/list/${page}/${size}?status=${status}`,
        method: 'GET'
    })
}

export const editEmployee = function(employeeId, employee) {
  return request({
    url: '/employee/modify/' + employeeId,
    method: 'POST',
    data: employee
  })
}

export const reviewEmployee = function(employeeId) {
  return request({
    url: '/employee/review/' + employeeId,
    method: 'POST'
  })
}