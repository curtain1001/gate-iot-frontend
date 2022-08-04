<template>
  <div class="property-dialog">
    <DeviceNode
      v-if="nodeData.type === 'device'"
      :node-data="nodeData"
      :lf="lf"
      @onClose="handleClose"
    />
    <ServerNode
      v-else-if="nodeData.type === 'server'"
      :node-data="nodeData"
      :lf="lf"
      @onClose="handleClose"
    />
    <StartNode
      v-else-if="nodeData.type === 'start'"
      :node-data="nodeData"
      :lf="lf"
      @onClose="handleClose"
    />
    <EdgeNode
      v-else-if="nodeData.type ==='polyline'"
      :node-data="nodeData"
      :lf="lf"
      @onClose="handleClose"
    />
    <EndNode
      v-else-if="nodeData.type ==='end'"
      :node-data="nodeData"
      :lf="lf"
      @onClose="handleClose"
    />
  </div>
</template>
<script>
// import CommonProperty from './CommonProperty'
import StartNode from './StartNode.vue'
import DeviceNode from './DeviceNode.vue'
import ServerNode from './ServerNode.vue'
import EdgeNode from './EdgeNode.vue'
import EndNode from './EndNode.vue'

export default {
  name: 'PropertyDialog',
  components: {
    // CommonProperty,
    DeviceNode,
    ServerNode,
    StartNode,
    EdgeNode,
    EndNode
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
