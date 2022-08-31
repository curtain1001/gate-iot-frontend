<template>
  <div class="app-container">
    <div>
      实例名称：<el-tag>标签一</el-tag>
      <el-button type="primary" plain style="float:right" @click="goBack()">返回</el-button>
    </div>
    <el-timeline style="margin-top:20px">
      <el-timeline-item
        v-for="(item, index) in histories"
        :key="index"
        :timestamp="item.createTime"
      >
        <el-card>
          <h3>节点类型：{{ item.nodeType? nodeTypes.find(k=>k.key===item.nodeType).value:"" }}</h3>
          <p>节点名称：{{ item.nodeName }}</p>
          <p>节点指令：{{ item.instruction }}</p>
          <p>节点报文：{{ item.result }} </p>
          <p>完成时间：{{ item.updateTime }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import router from '@/router'
import api from './api/index'
import { mapGetters } from 'vuex'
const nodeType = [
  { key: 'start', value: '开始节点' },
  { key: 'end', value: '结束节点' },
  { key: 'device', value: '设备节点' },
  { key: 'server', value: '服务节点' },
  { key: 'or', value: '服务节点' },
  { key: 'and', value: '服务节点' }
]
export default {
  name: 'ProcessRecord',

  data() {
    return {
      histories: [],
      instanceId: null,
      nodeTypes: nodeType

    }
  },
  computed: {
    ...mapGetters(['websocketMsg'])
  },
  watch: {
    websocketMsg(value) {
      const val = JSON.parse(value)
      var reg = new RegExp(val.topic)
      if (val.requestId === this.instanceId && reg.test(this.$route.path)) {
        this.histories = val.payload
      }
    }
  },

  created() {
    // this.$store.watch((state, getters) => {
    //   return getters.websocketMsg
    // }, (msg) => {
    //   console.log('111111', msg)
    //   this.histories = msg
    // })
    const params = this.$route.params
    if (params && params.instanceId) {
      this.instanceId = params.instanceId
    }
    console.log(this.instanceId)
    this.getRecord()
    const request = {
      id: '',
      topic: this.$route.path,
      parameter: null
    }
    this.setMsg(request)
  },
  methods: {
    getRecord() {
      api.getRecord(this.instanceId).then((rep) => {
        if (rep.code === 200) {
          this.histories = rep.data
        }
      })
    },
    setMsg(msg) {
      this.$store.dispatch('websocket/WEBSOCKET_SEND', JSON.stringify(msg))
    },
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      router.replace(`/business/flow-record`)
    }
  }

}
</script>
