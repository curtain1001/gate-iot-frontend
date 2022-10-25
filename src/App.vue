<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
const proxy_url = process.env.VUE_APP_WEBSOCKET_URL || 'ws://loclahost:8080/websocket/message' // 代理路由
export default {
  name: 'App',

  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  },
  created() {
    // this.initWebSocket()
  },
  methods: {
    initWebSocket() {
      this.$store.dispatch('websocket/WEBSOCKET_INIT', proxy_url)// 初始化ws
    }
  }

}
</script>
