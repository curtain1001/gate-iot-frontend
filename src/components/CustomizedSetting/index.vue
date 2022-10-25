<template>
  <el-form v-if="customizeDatas && Array.isArray(customizeDatas)" ref="form" v-model="configuration" label-width="80px">
    <div v-for="(item, index) in customizeDatas" :key="index">
      <el-form-item :label="item.label" :prop="item.value">
        <el-input v-if="item.type ==='string'" v-model="configuration[item.value]" type="text" placeholder="配置值" @change="submit" @input="submit" @blur="submit" />
        <el-input v-else-if="item.type ==='number'" v-model="configuration[item.value]" type="number" min="0" placeholder="配置值" @change="submit" @input="submit" @blur="submit" />
        <el-select v-else-if="item.type ==='select'||item.type ==='boolean'" v-model="configuration[item.value]" placeholder="选择参数" clearable @submit="submit" @input="submit" @blur="submit">
          <el-option
            v-for="option in item.options"
            :key="option.key"
            :label="option.key"
            :value="option.value"
          />
        </el-select>
        <div v-else-if="item.value ==='parserType' && item.type ==='customized'">
          <el-select v-model="configuration[item.value]" placeholder="选择解析方式" clearable @submit="submit" @input="submit" @blur="submit" @change="parserTypeChange">
            <el-option
              v-for="option in item.options"
              :key="option.key"
              :label="option.key"
              :value="option.value"
            />
          </el-select>
        </div>
      </el-form-item>
    </div>
    <el-form-item v-if="configuration.parserType&&configuration.parserType==='DELIMITED'" label="分隔符" :prop="configuration.parserConfiguration.delimited">
      <el-input v-model="configuration.parserConfiguration.delimited" type="text" placeholder="设置分隔符" @change="submit" @input="submit" @blur="submit" />
    </el-form-item>
    <el-form-item v-if="configuration.parserType&&configuration.parserType==='FIXED_LENGTH'" label="固定长度" :prop="configuration.parserConfiguration.size">
      <el-input v-model="configuration.parserConfiguration.size" type="text" placeholder="设置固定长度" @change="submit" @input="submit" @blur="submit" />
    </el-form-item>
  </el-form>
</template>
<script>
import Vue from 'vue'
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
      console.log('configuration:', this.configuration)
      this.configuration = val
      console.log('val:', this.val)
    }
  },
  created() {
    console.log('value', this.configuration)
  },
  methods: {
    parserTypeChange(value) {
      if (value === 'DELIMITED' || value === 'FIXED_LENGTH') {
        this.$set(this.configuration, 'parserConfiguration', {})
      } else if (this.configuration.parserConfiguration) {
        Vue.delete(this.configuration, 'parserConfiguration')
      }
      console.log('添加属性' + value)
    },

    submit(value) {
      this.$emit('input', this.configuration)
      this.$emit('blur', this.configuration)
    }
  }
}
</script>
<style scoped>
  .el-form-item .el-select {
    width: 100%;
  }
  .el-form-item .el-input {
    width: 100%;
  }
  .el-form-item .el-cascader {
    width: 100%;
  }

  .el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  }
  .el-icon-arrow-down {
  font-size: 12px;
  }
</style>
