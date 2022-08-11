<template>
  <div>
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="指令类型">
        <el-select v-model="form.objectType" placeholder="请选择类型" @change="objectTypeChange">
          <el-option
            v-for="type in objectTypeList"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.objectType==='device'" label="请选择设备">
        <el-select v-model="form.deviceId" placeholder="请选择设备" clearable @change="deviceChange">
          <el-option
            v-for="device in deviceList"
            :key="device.deviceId"
            :label="device.deviceName"
            :value="device.deviceId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.objectType==='device' && form.deviceId" label="请选择指令">
        <el-select v-model="form.instruction" placeholder="请选择设备指令" clearable @change="deviceInsChange">
          <el-option
            v-for="ins in deviceInsOptions"
            :key="ins.value"
            :label="ins.name"
            :value="ins.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.objectType==='server'" label="请选择服务指令">
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
  'label': '设备',
  'value': 'device'
}, {
  'label': '服务',
  'value': 'server'
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
      deviceList: [],
      serverInsList: [],
      deviceInsOptions: [],
      serverInsOptions: [],
      objectTypeList: typeList,
      form: {
        instruction: '',
        objectType: '',
        deviceId: '',
        insType: 'up'
      }
    }
  },
  computed: {
    laneId() {
      return this.laneId()
    }
  },

  async created() {
    console.log('mounted')
    await this.getDevices()
    await this.getServeIns()
    const { properties } = this.nodeData
    this.$nextTick(() => {
      if (properties) {
        this.form = Object.assign({}, this.form, properties)
        if (this.form.instruction) {
          if (this.form.objectType === 'device') {
            const instructions = this.deviceList.filter(d => d.deviceId === this.form.deviceId)[0].instructions
            this.deviceInsOptions = instructions.filter(i => i.insType === this.form.insType)
          } else if (this.form.objectType === 'server') {
            this.serverInsOptions = this.serverInsList.filter(x => x.insType === this.form.insType)
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
    objectTypeChange(val) {
      console.log('类型：' + val)
      this.form.deviceId = undefined
      this.form.instruction === undefined
      if (val === 'server') {
        this.serverInsOptions = this.serverInsList.filter(x => x.insType === this.form.insType)
      }
    },
    deviceChange(val) {
      console.log('设备：' + val)
      if (!val) {
        this.form.deviceId = undefined
        this.form.instruction = undefined
      } else {
        this.form.instruction === undefined
        const instructions = this.deviceList.filter(d => d.deviceId === val)[0].instructions
        this.deviceInsOptions = instructions.filter(i => i.insType === this.form.insType)
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
