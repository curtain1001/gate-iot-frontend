import request from '@/utils/request'

// 查询场站列表
export function listArea(query) {
  return request({
    url: '/business/area/list',
    method: 'get',
    params: query
  })
}

// 查询场站详细信息
export function getArea(areaId) {
  return request({
    url: '/business/area/' + areaId,
    method: 'get'
  })
}

// 根据场站名查询场站信息
export function getAreaByName(areaName) {
  return request({
    url: '/business/area/configKey/' + areaName,
    method: 'get'
  })
}

// 新增场站信息
export function addArea(data) {
  return request({
    url: '/business/area',
    method: 'post',
    data: data
  })
}

// 修改场站信息
export function updateArea(data) {
  return request({
    url: '/business/area',
    method: 'put',
    data: data
  })
}

// 删除场站
export function delArea(areaId) {
  return request({
    url: '/business/area/' + areaId,
    method: 'delete'
  })
}

