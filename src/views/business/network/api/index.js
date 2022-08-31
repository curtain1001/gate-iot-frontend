import request from '@/utils/request'
export default {
  // 获取所有组件支持
  getSupports() {
    return request({
      url: `/business/network/supports`,
      method: 'get'
    })
  },
  getListByType(type) {
    return request({
      url: `/business/network/list/${type}`,
      method: 'get'
    })
  },

  // 查询设备列表
  listNetwork(query) {
    return request({
      url: 'business/network/list',
      method: 'get',
      params: query
    })
  },

  // 查询设备详细信息
  getNetwork(id) {
    return request({
      url: '/business/network/' + id,
      method: 'get'
    })
  },

  // 新增设备信息
  addNetwork(data) {
    return request({
      url: '/business/network',
      method: 'post',
      data: data
    })
  },

  // 修改设备信息
  updateNetwork(data) {
    return request({
      url: '/business/network',
      method: 'put',
      data: data
    })
  },
  action(id, action) {
    return request({
      url: `/business/network/${id}/${action}`,
      method: 'put'
    })
  },

  // 删除设备
  delNetwork(Ids) {
    return request({
      url: '/business/network/' + Ids,
      method: 'delete'
    })
  }
}
