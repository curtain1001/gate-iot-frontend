import request from '@/utils/request'
export default {

  // 查询所有设备
  getDevices(laneId) {
    return request({
      url: `/business/device/all/${laneId}`,
      method: 'get'
    })
  },

  // 查询设备产品类型列表
  listDeviceProduct() {
    return request({
      url: '/business/device/product/list',
      method: 'get'
    })
  },

  // 查询设备产品类型列表
  getNetworks() {
    return request({
      url: '/business/device/network/supports',
      method: 'get'
    })
  },

  // 开关
  enabled(id, status) {
    return request({
      url: `/business/device/${id}/${status ? 'on' : 'off'}`,
      method: 'put'
    })
  },

  // 查询设备列表
  listDevice(query) {
    return request({
      url: '/business/device/list',
      method: 'get',
      params: query
    })
  },

  // 查询设备详细信息
  getDevice(id) {
    return request({
      url: '/business/device/' + id,
      method: 'get'
    })
  },

  // 根据设备名查询设备信息
  getDeviceByName(deviceName) {
    return request({
      url: '/business/device/' + deviceName,
      method: 'get'
    })
  },

  // 新增设备信息
  addDevice(data) {
    return request({
      url: '/business/device',
      method: 'post',
      data: data
    })
  },

  // 修改设备信息
  updateDevice(data) {
    return request({
      url: '/business/device',
      method: 'put',
      data: data
    })
  },

  // 删除设备
  delDevice(Ids) {
    return request({
      url: '/business/device/' + Ids,
      method: 'delete'
    })
  }

}
