import request from '@/utils/request'

export default {
// 查询【请填写功能名称】列表
  listFlow(query) {
    return request({
      url: '/business/flow/list',
      method: 'get',
      params: query
    })
  },

  // 查询【请填写功能名称】详细
  getFlow(flowId) {
    return request({
      url: '/business/flow/' + flowId,
      method: 'get'
    })
  },

  // 新增【请填写功能名称】
  addFlow(data) {
    return request({
      url: '/business/flow',
      method: 'post',
      data: data
    })
  },

  // 修改【请填写功能名称】
  updateFlow(data) {
    return request({
      url: '/business/flow',
      method: 'put',
      data: data
    })
  },

  // 删除【请填写功能名称】
  delFlow(flowId) {
    return request({
      url: '/business/flow/' + flowId,
      method: 'delete'
    })
  },

  // 导出【请填写功能名称】
  exportFlow(query) {
    return request({
      url: '/business/flow/export',
      method: 'get',
      params: query
    })
  }
}
