<template>
  <div class="node-panel">
    <div
      v-for="item in nodeList"
      :key="item.text"
      class="node-item"
      @mousedown="dragNode(item)"
    >
      <div class="node-item-icon" :class="item.class">
        <div v-if="item.icon"><svg-icon :icon-class="item.icon" class-name="icon" class="shape" /></div>
      </div>
      <span class="node-label">{{ item.text }}</span>
    </div>
    <div class="color-tip">
      <div class="item">
        <div class="board lane">车道: <span class="content"> {{ laneName }}</span></div>
      </div>
      <div class="item">
        <div class="board flow">流程名称：<span class="content">{{ flowName }}</span></div>
      </div>
      <div class="item">
        <div class="board direction">方向：
          <svg-icon icon-class="arrow-" class-name="icon" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NodePanel',
  props: {
    nodeList: {
      type: Array,
      default: () => []
    },
    lf: {
      type: Object,
      default: null
    },
    laneId: {
      type: Number,
      default: undefined
    },
    flowName: {
      type: String,
      default: ''
    },
    laneName: {
      type: String,
      default: ''
    }

  },
  data() {
    return {

    }
  },
  methods: {
    dragNode(item) {
      this.$props.lf.dnd.startDrag({
        type: item.type
      })
    }
  }
}
</script>
<style  scoped lang="scss">
.shape{
  width:2em;
  height: 2em;
}
.node-panel {
  position: absolute;
  top: 50px;
  left: 25px;
  width: 70px;
  padding: 40px 10px;
  background-color: white;
  box-shadow: 0 0 10px 1px rgb(228, 224, 219);
  border-radius: 6px;
  text-align: center;
  z-index: 101;
}
.node-item {
  margin-bottom: 20px;
}
.node-item-icon {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  background-size: cover;
}
.node-label {
  font-size: 12px;
  margin-top: 5px;
  user-select: none;
}

.node-rect{
  border: 1px solid black;
}

.color-tip {
    position: absolute;
    top: -40px;
    right: -30px;
    transform: translateX(100%);
    width: 400px;
    height: 40px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgb(0 0 0 / 30%);
    border-radius: 5px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .item {
      .board,
      .content {
        display: inline-block;
      }
      .board {
        height: 10px;
      }
      .flow {
        width:200px;
      }
      .lane {
        width: 80px;
      }
      .direction {
        width: 80px;
      }
      .content {
        font-size: 14px;
        padding-left: 5px;
      }
    }
  }
</style>
