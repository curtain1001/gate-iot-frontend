import request from '@/utils/request'
export default {
  // 获取所有组件支持
  listServiceProduct() {
    return request({
      url: `/business/support-service/product/list`,
      method: 'get'
    })
  },

  // 查询设备列表
  lisSupport(query) {
    return request({
      url: 'business/support-service/list',
      method: 'get',
      params: query
    })
  },

  // 查询设备详细信息
  getSupport(id) {
    return request({
      url: '/business/support-service/' + id,
      method: 'get'
    })
  },

  // 新增设备信息
  addSupport(data) {
    return request({
      url: '/business/support-service',
      method: 'post',
      data: data
    })
  },

  // 修改设备信息
  updateSupport(data) {
    return request({
      url: '/business/support-service',
      method: 'put',
      data: data
    })
  },
  action(id, action) {
    return request({
      url: `/business/support-service/${id}/${action}`,
      method: 'put'
    })
  },

  // 删除设备
  delSupport(Ids) {
    return request({
      url: '/business/support-service/' + Ids,
      method: 'delete'
    })
  }
}
