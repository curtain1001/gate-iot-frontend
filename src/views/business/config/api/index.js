import request from '@/utils/request'
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

