import request from '@/utils/request'
export default {
// 查询流程运行实例列表
  listInstance(query) {
    return request({
      url: '/business/flow-process/list',
      method: 'get',
      params: query
    })
  },

  // 查询流程运行实例详细
  getInstance(instanceId) {
    return request({
      url: '/business/flow-process/' + instanceId,
      method: 'get'
    })
  },

  // 查询流程运行实例详细
  getRecord(instanceId) {
    return request({
      url: '/business/flow-process/record/' + instanceId,
      method: 'get'
    })
  },

  // 新增流程运行实例
  addInstance(data) {
    return request({
      url: '/business/flow-process',
      method: 'post',
      data: data
    })
  },

  // 修改流程运行实例
  updateInstance(data) {
    return request({
      url: '/business/flow-process',
      method: 'put',
      data: data
    })
  },

  // 删除流程运行实例
  delInstance(instanceId) {
    return request({
      url: '/business/flow-process/' + instanceId,
      method: 'delete'
    })
  },

  // 导出流程运行实例
  exportInstance(query) {
    return request({
      url: '/business/flow-process/export',
      method: 'get',
      params: query
    })
  }
}
