<template>
  <div>
    <json-viewer :value="graphData" />
  </div>
</template>
<script>
import JsonViewer from 'vue-json-viewer'

export default {
  components: { JsonViewer },
  props: {
    graphData: {
      type: Object || String,
      default: () => {}
    }
  }
}
</script>
<style scoped>
</style>
