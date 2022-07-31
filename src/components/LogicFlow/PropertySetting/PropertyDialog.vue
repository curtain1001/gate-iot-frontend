<template>
  <div class="property-dialog">
    <User
      v-if="nodeData.type === 'user'"
      :node-data="nodeData"
      :lf="lf"
      @onClose="handleClose"
    />
    <StartNode
      v-else
      :node-data="nodeData"
      :lf="lf"
      @onClose="handleClose"
    />
  </div>
</template>
<script>
// import CommonProperty from './CommonProperty'
import User from './User.vue'
import StartNode from './StartNode.vue'

export default {
  name: 'PropertyDialog',
  components: {
    // CommonProperty,
    User,
    StartNode
  },
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
    return {}
  },
  methods: {
    handleClose() {
      this.$emit('setPropertiesFinish')
    }
  }
}
</script>
<style>
.property-dialog{
  padding: 20px;
}
</style>
