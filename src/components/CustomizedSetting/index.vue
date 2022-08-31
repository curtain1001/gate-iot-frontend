<template>
  <el-form v-if="customizeDatas && Array.isArray(customizeDatas)" ref="form" v-model="configuration" label-width="80px">
    <div v-for="(item, index) in customizeDatas" :key="index">
      <el-form-item :label="item.label" :prop="item.value">
        <el-input v-if="item.type ==='string'" v-model="configuration[item.value]" type="text" placeholder="配置值" @change="submit" @input="submit" @blur="submit" />
        <el-input v-else-if="item.type ==='number'" v-model="configuration[item.value]" type="number" min="0" placeholder="配置值" @change="submit" @input="submit" @blur="submit" />
        <el-select v-else-if="item.type ==='select'||item.type ==='boolean'" v-model="configuration[item.value]" placeholder="配置参数" clearable @submit="submit" @input="submit" @blur="submit">
          <el-option
            v-for="option in item.options"
            :key="option.key"
            :label="option.key"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
export default {
  name: 'CustomizedSetting',
  props: {
    customizeDatas: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      configuration: this.value
    }
  },
  watch: {
    'value'(val) {
      this.configuration = val
      console.log('val:', this.val)
    }
  },
  created() {
    console.log('value', this.configuration)
  },
  methods: {
    submit(value) {
      this.$emit('input', this.configuration)
      this.$emit('blur', this.configuration)
    }
  }
}
</script>
