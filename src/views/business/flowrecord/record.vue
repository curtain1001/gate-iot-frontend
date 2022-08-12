<template>
  <div class="app-container">
    <div>
      实例名称：<el-tag>标签一</el-tag>
    </div>
    <el-timeline style="margin-top:20px">
      <el-timeline-item
        v-for="(item, index) in histories"
        :key="index"
        :timestamp="item.createTime"
      >
        <el-card>
          <h4>节点名称：{{ item.nodeName }}</h4>
          <p>节点指令：{{ item.instruction }}</p>
          <p>节点指令：{{ item.result }}</p>
          <p>完成时间：{{ item.updateTime }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <!-- <el-timeline>
        <el-timeline-item v-for="item in histories" timestamp="2018/4/12" placement="top">
          <el-card>
            <h4>更新 Github 模板</h4>
            <p>王小虎 提交于 2018/4/12 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/3" placement="top">
          <el-card>
            <h4>更新 Github 模板</h4>
            <p>王小虎 提交于 2018/4/3 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/2" placement="top">
          <el-card>
            <h4>更新 Github 模板</h4>
            <p>王小虎 提交于 2018/4/2 20:46</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-timeline> -->
  </div>
</template>
<script>
import api from './api/index'
export default {
  name: 'ProcessRecord',
  data() {
    return {
      histories: [],
      instanceId: null

    }
  },

  created() {
    const params = this.$route.params
    if (params && params.instanceId) {
      this.instanceId = params.instanceId
    }
    console.log(this.instanceId)
    this.getRecord()
    this.setMsg('11')
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
      this.$store.dispatch('websocket/WEBSOCKET_SEND', 'msg')
    }
  }

}
</script>
