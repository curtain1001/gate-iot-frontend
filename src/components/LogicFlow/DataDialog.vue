<template>
  <div>
    <json-viewer :value="graphData" :boxed="true" />
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
