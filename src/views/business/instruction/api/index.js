import request from '@/utils/request'
export default {

  // 执行指令
  run(id, product, instruction) {
    return request({
      url: `/business/instruction/${id}/run/${product}/${instruction}`,
      method: 'get'
    })
  },
  // 获取所有服务指令
  getServeIns(objetType = 'service') {
    return request({
      url: `/business/instruction/list/${objetType}`,
      method: 'get'
    })
  },

  // 查询设备列表
  listInstruction(query) {
    return request({
      url: 'business/instruction/list',
      method: 'get',
      params: query
    })
  },

  // 查询设备详细信息
  getInstruction(id) {
    return request({
      url: '/business/instruction/' + id,
      method: 'get'
    })
  },

  // 新增设备信息
  addInstruction(data) {
    return request({
      url: '/business/instruction',
      method: 'post',
      data: data
    })
  },

  // 修改设备信息
  updateInstruction(data) {
    return request({
      url: '/business/instruction',
      method: 'put',
      data: data
    })
  },

  // 删除设备
  delInstruction(Ids) {
    return request({
      url: '/business/instruction/' + Ids,
      method: 'delete'
    })
  }

}
