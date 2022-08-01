<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="指令类型">
        <el-select v-model="form.objectType" placeholder="请选择类型">
          <el-option label="设备" value="device" />
          <el-option label="服务" value="server" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type==='device'" label="请选择设备">
        <el-form-item label="设备" prop="deviceId">
          <el-select v-model="form.deviceId" placeholder="请选择设备" clearable @change="deviceChange">
            <el-option
              v-for="device in deviceList"
              :key="device.deviceId"
              :label="device.deviceName"
              :value="device.deviceId"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item else-if="form.type==='device'" label="请选择指令">
        <el-select v-model="form.deviceId" placeholder="请选择设备指令" clearable @change="deviceChange">
          <el-option
            v-for="ins in deviceInsOptions"
            :key="ins.value"
            :label="ins.name"
            :value="ins.value"
          />
        </el-select>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import deviceApi from '@/views/business/device/api/index'
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
      form: {
        deviceInsOptions: '',
        objectType: '',
        deviceId: '',
        instruction: ''
      }
    }
  },
  computed: {
    laneId() {
      return this.laneId()
    }
  },
  activated() {
    this.getDevices()
  },
  mounted() {
    const { properties } = this.nodeData
    if (properties) {
      this.form = Object.assign({}, this.form, properties)
    }
  },
  methods: {
    getDevices() {
      deviceApi.getDevices(this.laneId).then((rep) => {
        console.log(rep)
        // this.deviceList = rep.
      })
    },
    deviceChange(val) {
      if (!val) {
        // this.form.configuration = undefined
      } else {
        this.deviceInsOptions = val.filter(x => x.insType === 'up')
      }
    },

    onSubmit() {
      console.log('submit!')
      const { id } = this.nodeData
      this.lf.setProperties(id, {
        ...this.form
      })
      console.log(6666, this.form)
      this.lf.updateText(id, this.form.name)
      this.$emit('onClose')
    }
  }
}
</script>
<style scoped>
</style>
