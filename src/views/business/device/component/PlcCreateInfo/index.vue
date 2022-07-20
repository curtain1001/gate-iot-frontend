<template>
  <el-form
    ref="configForm"
    :model="form"
    size="small"
    :inline="true"
    label-width="85px"
  >
    <el-form-item label="Ip地址" prop="host">
      <el-input
        v-model="form.host"
        placeholder="请输入Ip地址"
        clearable
        style="width: 240px"
        @change="change()"
      />
    </el-form-item>
    <el-form-item label="端口" prop="port">
      <el-input
        v-model.number="form.port"
        autocomplete="off"
        placeholder="请输入端口"
        clearable
        style="width: 240px"
        @change="change()"
      />
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'PlcCreateInfo',
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        ip: '',
        port: undefined
      }
    }
  },
  watch: {
    value(val) {
      console.log(val)
      this.form = { ...val }
    }
  },
  created() {
    this.form = { ...this.value }
  },
  methods: {
    change() {
      this.$emit('change', this.form)
      this.$emit('input', this.form)
    }
  }
}
</script>
