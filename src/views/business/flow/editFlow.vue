<template>
  <LogicFlow :lane-id="laneId" />
</template>

<script>
import LogicFlow from '@/components/LogicFlow'
export default {
  name: 'Flow',
  components: {
    LogicFlow
  },
  data() {
    return {
      lane: undefined
    }
  },
  activated() {
    const params = this.$route.query
    if (params && params.laneId) {
      this.laneId = params.laneId
    }
    console.log(params)
  },
  created() {
    const params = this.$route.query
    if (params && params.laneId) {
      this.laneId = params.laneId
    }
    console.log(params)
  }
}

</script>
