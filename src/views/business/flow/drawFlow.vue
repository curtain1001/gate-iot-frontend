<template>
  <LogicFlow :flow-row="flowRow" />
</template>

<script>
import LogicFlow from '@/components/LogicFlow'
export default {
  name: 'FlowDraw',
  components: {
    LogicFlow
  },
  data() {
    return {
      flowRow: {}
    }
  },
  activated() {
    const params = this.$route.params
    if (params && params.flowRow) {
      this.flowRow = JSON.parse(params.flowRow)
    }

    console.log(this.flowRow)
  },
  created() {
    const params = this.$route.params
    if (params && params.flowRow) {
      this.flowRow = JSON.parse(params.flowRow)
    }

    console.log(this.flowRow)
  }
}

</script>
