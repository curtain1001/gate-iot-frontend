<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
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
    this.initWebSocket()
  },
  methods: {
    initWebSocket() {
      this.$store.dispatch('websocket/WEBSOCKET_INIT', 'ws://192.168.1.40:8989/websocket/message')// 初始化ws
    }
  }

}
</script>
