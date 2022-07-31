import request from '@/utils/request'
export default {
      // 查询设备产品类型列表
  getDevices() {
    return request({
      url: '/business/device/all',
      method: 'get'
    })
  },
}

