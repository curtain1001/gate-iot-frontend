import request from '@/utils/request'

// 查询通道列表
export function listLane(query) {
  return request({
    url: '/business/lane/list',
    method: 'get',
    params: query
  })
}

// 查询场站详细信息
export function getLane(laneId) {
  return request({
    url: '/business/lane/' + laneId,
    method: 'get'
  })
}

// 根据场站名查询场站信息
export function getLaneByName(laneName) {
  return request({
    url: '/business/lane/' + laneName,
    method: 'get'
  })
}

// 新增场站信息
export function addLane(data) {
  return request({
    url: '/business/lane',
    method: 'post',
    data: data
  })
}

// 修改场站信息
export function updateLane(data) {
  return request({
    url: '/business/lane',
    method: 'put',
    data: data
  })
}

// 删除场站
export function delLane(laneId) {
  return request({
    url: '/business/lane/' + laneId,
    method: 'delete'
  })
}

// --------------------通道配置----------------------

// 查询配置列表
export function listLaneConfigOptions() {
  return request({
    url: '/business/lane/config/options',
    method: 'get'
  })
}

// 查询配置列表
export function listLaneConfig(query) {
  return request({
    url: '/business/lane/config/list',
    method: 'get',
    params: query
  })
}

// 查询通道配置详细信息
export function getLaneConfig(laneId) {
  return request({
    url: '/business/lane/config/' + laneId,
    method: 'get'
  })
}

// 根据key查询配置信息
export function getLaneCofnigByKey(key) {
  return request({
    url: '/business/lane/config/' + key,
    method: 'get'
  })
}

// 新增配置信息
export function addLaneConfig(data) {
  return request({
    url: '/business/lane/config',
    method: 'post',
    data: data
  })
}

// 修改配置信息
export function updateLaneConfig(data) {
  return request({
    url: '/business/lane/config',
    method: 'put',
    data: data
  })
}

// 删除配置
export function delLaneConfig(laneConfigId) {
  return request({
    url: '/business/lane/config/' + laneConfigId,
    method: 'delete'
  })
}
// 停用配置
export function editLaneConfigStatu(laneConfigId, statu) {
  return request({
    url: `/business/lane/config/status/${laneConfigId}`,
    method: 'put',
    data: statu
  })
}

