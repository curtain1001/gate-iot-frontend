<template>
  <div>
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="请选择指令类型">
        <el-select v-model="form.insType" placeholder="请选择指令类型" clearable @change="serverInsTypeChange">
          <el-option
            v-for="ins in insTypeList"
            :key="ins.value"
            :label="ins.label"
            :value="ins.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.insType" label="请选择服务指令">
        <el-select v-model="form.instruction" placeholder="请选择服务指令" clearable @change="serverInsChange">
          <el-option
            v-for="ins in serverInsOptions"
            :key="ins.value"
            :label="ins.name"
            :value="ins.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import deviceApi from '@/views/business/device/api/index'
import instuctionApi from '@/views/business/instruction/api/index'
const typeList = [{
  'label': '上行',
  'value': 'up'
}, {
  'label': '下行',
  'value': 'down'
}]
export default {
  name: 'StartNode',
  // inject接收值，类型为数组
  inject: ['laneId'],
  props: {
    nodeData: {
      type: Object,
      default: () => {}
    },
    lf: {
      type: Object || String,
      default: () => {}
    }
  },
  data() {
    return {
      serverInsList: [],
      serverInsOptions: [],
      insTypeList: typeList,
      form: {
        instruction: '',
        objectType: 'service',
        deviceId: ''
      }
    }
  },
  computed: {
    laneId() {
      return this.laneId()
    }
  },

  async mounted() {
    console.log('mounted')
    await this.getServeIns()
    const { properties } = this.nodeData
    this.$nextTick(function() {
      if (properties) {
        this.form = Object.assign({}, this.form, properties)
        if (this.form.instruction) {
          if (this.form.objectType === 'server') {
            this.serverInsOptions = this.serverInsList.filter(x => x.insType === 'up')
          }
        }
      }
    })

    console.log('form' + this.form)
  },
  methods: {
    async getDevices() {
      const rep = await deviceApi.getDevices(this.laneId)
      console.log('设备列表：' + rep)
      if (rep.code === 200) {
        this.deviceList = rep.data
      }
    },
    async getServeIns() {
      const rep = await instuctionApi.getServeIns()
      if (rep.code === 200) {
        this.serverInsList = rep.data
      }
    },
    serverInsTypeChange(val) {
      console.log('设备：' + val)
      if (!val) {
        this.form.instruction = undefined
      } else {
        this.form.instruction === undefined
        this.serverInsOptions = this.serverInsList.filter(i => i.insType === 'up')
      }
    },
    deviceInsChange(val) {
      console.log('指令：' + val)
    },
    serverInsChange(val) {
      console.log('服务指令+' + val)
    },

    onSubmit() {
      console.log('submit!')
      const { id } = this.nodeData
      this.lf.setProperties(id, {
        ...this.form
      })
      console.log(6666, this.form)
      const text = (this.form.deviceId ? 'DEVICE::' + this.form.deviceId + '::' : 'SERVICE::') + this.form.instruction
      this.lf.updateText(id, text)
      this.$emit('onClose')
    }
  }
}
</script>
<style scoped>
</style>
