<template>
  <LogicFlow v-if="flowShow" ref="logicFlow" :flow-row="flowRow" :node-data="nodeData" :lane-name="laneName" @saveData="val=>saveData(val)" />
</template>

<script>
import LogicFlow from '@/components/LogicFlow'
import flowApi from './api/index'
import { getLane } from '@/views/business/lane/api/index.js'
export default {
  name: 'FlowDraw',
  components: {
    LogicFlow
  },
  data() {
    return {
      nodeData: {},
      flowRow: {},
      flowId: '',
      laneName: '',
      flowShow: false
    }
  },
  async activated() {
    const params = this.$route.params
    if (params && params.flowId) {
      this.flowId = params.flowId
    }
    console.log(this.flowId)
    const rep = await this.getFlowRow()
    if (rep.code === 200) {
      this.flowRow = rep.data
      console.log('flowRow:' + this.flowRow)
      this.nodeData = this.flowRow.content
    }
    this.$nextTick(() => {
      this.flowShow = true
    })
    await this.getLaneName()
  },
  methods: {
    init() {
      flowApi.getFlow(this.flowId).then(rep => {
        if (rep.code === 200) {
          this.flowRow = rep.data
          console.log('flowRow:' + this.flowRow)
          this.nodeData = this.flowRow.content
          this.$refs['logicFlow'].renderFlowData(this.nodeData)
        }
      })
    },

    getFlowRow() {
      return flowApi.getFlow(this.flowId)
    },
    getLaneName() {
      if (this.flowRow && this.flowRow.laneId) {
        getLane(this.flowRow.laneId).then(rep => {
          if (rep.code === 200) {
            this.laneName = rep.data.laneName
          }
        })
      }
    },
    saveData(val) {
      this.flowRow.content = val
      flowApi.updateFlow(this.flowRow).then((rep) => {
        if (rep.code === 200) {
          this.$modal.msgSuccess(rep.msg)
          this.init()
        } else {
          this.$modal.msgError('保存失败：' + rep.msg)
        }
        console.log(rep)
      })
      console.log('流程数据：' + val)
    }
  }
}

</script>
