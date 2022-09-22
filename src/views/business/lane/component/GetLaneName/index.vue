<template>
  <span :model="laneId">{{ name }}</span>
</template>
<script>
import { getLane } from '@/views/business/lane/api/index.js'
export default {
  name: 'GetLaneName',
  props: {
    value: {
      type: Number,
      default: () => undefined
    }
  },

  data() {
    return {
      name: '',
      laneId: this.value
    }
  },
  watch: {
    value(val) {
      this.findName(val)
    }
  },
  created() {
    this.findName(this.laneId)
  },
  methods: {
    findName(val) {
      if (val) {
        const n = localStorage.getItem('lane::laneId::' + val)
        if (!n || n === '') {
          getLane(val).then(rep => {
            this.name = rep.data.laneName
            localStorage.setItem('lane::laneId::' + val, rep.data.laneName)
          })
        } else {
          this.name = n
        }
      } else {
        this.name = ''
      }
    }
  }
}
</script>
