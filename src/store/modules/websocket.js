export default {

  namespaced: true,
  state: {
    websock: null,
    url: '',
    lockReconnect: false, // 是否真正建立连接
    timeout: 25 * 1000, // 25秒一次心跳
    timeoutObj: null, // 心跳心跳倒计时
    serverTimeoutObj: null, // 心跳倒计时
    timeoutnum: null, // 断开 重连倒计时
    message: {}
  },
  getters: {
    message(state) {
      return state.message
    }
  },
  mutations: {
    WEBSOCKET_INIT(state, url) {
      var that = this
      state.websock = new WebSocket(url)
      state.url = url
      state.websock.onopen = function() {
        console.log('连接成功') // 发送用户JWT令牌 后端解析后自动绑定用户
        // state.websock.send('id:123')
        // state.websock.send('OpenBarScanner')
        // 发送心跳包
        that.commit('websocket/start')
      }
      state.websock.onmessage = function(callBack) {
        // console.log(callBack.data)
        // 重置心跳
        // console.log(callBack.data)
        that.commit('websocket/reset')
        if (callBack.data === 'heartCheck') {
          return
        }
        state.message = callBack.data
        console.log('websocket：' + state.message)
      }
      state.websock.οnerrοr = function() { // e错误
        // console.log(e)
        that.commit('websocket/reconnect')
      }
      state.websock.onclose = function() { // e关闭
        // console.log(e)
        that.commit('websocket/reconnect')
      }
    },
    WEBSOCKET_SEND(state, message) {
      state.websock.send(message)
    },
    reconnect(state) { // 重新连接
      // console.log("重新连接")
      var that = this
      if (state.lockReconnect) {
        return
      }
      state.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      state.timeoutnum && clearTimeout(state.timeoutnum)
      state.timeoutnum = setTimeout(function() {
        // 新连接
        that.commit('websocket/WEBSOCKET_INIT', state.url)
        state.lockReconnect = false
      }, 5000)
    },
    reset(state) { // 重置心跳
      // 清除时间
      clearTimeout(state.timeoutObj)
      clearTimeout(state.serverTimeoutObj)
      // 心跳
      this.commit('websocket/start')
    },
    start(state) { // 开启心跳
      // console.log("开启心跳")
      var that = this
      state.timeoutObj && clearTimeout(state.timeoutObj)
      state.serverTimeoutObj && clearTimeout(state.serverTimeoutObj)
      state.timeoutObj = setTimeout(function() {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // console.log(state.websock)
        if (state.websock.readyState === 1) { // 如果连接正常
          state.websock.send('heartCheck')
        } else { // 否则重连
          that.commit('websocket/reconnect')
        }
        state.serverTimeoutObj = setTimeout(function() {
          // 超时关闭
          state.websock.close()
        }, state.timeout)
      }, state.timeout)
    }
  },
  actions: {
    WEBSOCKET_INIT({
      commit
    }, url) {
      commit('WEBSOCKET_INIT', url)
    },
    WEBSOCKET_SEND({
      commit
    }, message) {
      commit('WEBSOCKET_SEND', message)
    }

  }
}

