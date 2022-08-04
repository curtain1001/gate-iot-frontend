<template>
  <div>
    <el-form ref="form" :model="form" label-width="60px">
      <el-form-item label="条件" prop="remark">
        <span slot="label">

          <el-tooltip placement="top">
            <div slot="content">
              数值=data.get('objectType::deviceId::instruction');语法等判断符号为JS类型
              <br>
              例:获取PLC类型名称为PLC001的设备指令为ONE_OPEN的值 data.get('device::PLC001::ONE_OPEN').result!=null
            </div>
            <i class="el-icon-question" />
          </el-tooltip>

          条件
        </span>
        <el-input
          v-model="form.condition"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'EdgeNode',
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
      form: {
        condition: ''
      }
    }
  },
  computed: {
    laneId() {
      return this.laneId()
    }
  },
  mounted() {
    const { properties } = this.nodeData
    if (properties) {
      this.form = Object.assign({}, this.form, properties)
    }
    console.log('form' + this.form)
  },
  methods: {
    onSubmit() {
      console.log('submit!')
      const { id } = this.nodeData
      this.lf.setProperties(id, {
        ...this.form
      })
      console.log(6666, this.form)
      var text = ''
      if (this.form.condition) {
        text = 'CONDITION::' + this.form.condition
      }
      this.lf.updateText(id, text)
      this.$emit('onClose')
    }
  }
}
</script>
<style scoped>
</style>
