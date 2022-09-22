import request from '@/utils/request'
export default {

  // 查询所有服务
  getServers(laneId) {
    return request({
      url: `/business/server/all/${laneId}`,
      method: 'get'
    })
  },

  // 查询服务产品类型列表
  listServerProduct() {
    return request({
      url: '/business/server/product/list',
      method: 'get'
    })
  },

  // 开关
  enabled(id, status) {
    return request({
      url: `/business/server/${id}/${status === 0 ? 'on' : 'off'}`,
      method: 'put'
    })
  },

  // 查询服务列表
  listServer(query) {
    return request({
      url: '/business/server/list',
      method: 'get',
      params: query
    })
  },

  // 查询服务详细信息
  getServer(id) {
    return request({
      url: '/business/server/' + id,
      method: 'get'
    })
  },

  // 根据服务名查询服务信息
  getServerByName(serverName) {
    return request({
      url: '/business/server/' + serverName,
      method: 'get'
    })
  },

  // 新增服务信息
  addServer(data) {
    return request({
      url: '/business/server',
      method: 'post',
      data: data
    })
  },

  // 修改服务信息
  updateServer(data) {
    return request({
      url: '/business/server',
      method: 'put',
      data: data
    })
  },

  // 删除服务
  delServer(Ids) {
    return request({
      url: '/business/server/' + Ids,
      method: 'delete'
    })
  }

}
