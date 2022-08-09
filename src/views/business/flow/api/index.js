import request from '@/utils/request'

export default {
// 查询流程列表
  listFlow(query) {
    return request({
      url: '/business/flow/list',
      method: 'get',
      params: query
    })
  },

  // 查询流程详细
  getFlow(flowId) {
    return request({
      url: '/business/flow/' + flowId,
      method: 'get'
    })
  },

  // 新增流程
  addFlow(data) {
    return request({
      url: '/business/flow',
      method: 'post',
      data: data
    })
  },

  // 修改流程
  updateFlow(data) {
    return request({
      url: '/business/flow',
      method: 'put',
      data: data
    })
  },

  // 删除流程
  delFlow(flowId) {
    return request({
      url: '/business/flow/' + flowId,
      method: 'delete'
    })
  },
  // 部署流程
  deploy(laneId, flowId, version) {
    return request({
      url: `/business/flow/deploy/${laneId}/${flowId}/${version}`,
      method: 'put'
    })
  },

  // 导出流程
  exportFlow(query) {
    return request({
      url: '/business/flow/export',
      method: 'get',
      params: query
    })
  },
  // --------------------部署管理----------------------
  // 获取所有车道部署的流程信息
  getDeployAll() {
    return request({
      url: '/business/flow-deployment/all',
      method: 'get'
    })
  },
  // 获取车道部署流程信息
  getDeployByLaneId(laneId) {
    return request({
      url: `/business/flow-deployment/lane/${laneId}`,
      method: 'get'
    })
  },
  // 查询部署流程信息列表
  listFlowDeploy(query) {
    return request({
      url: '/business/flow-deployment/list',
      method: 'get',
      params: query
    })
  },
  // 删除流程
  delFlowDeploy(laneId) {
    return request({
      url: '/business/flow-deployment/' + laneId,
      method: 'delete'
    })
  }

}
