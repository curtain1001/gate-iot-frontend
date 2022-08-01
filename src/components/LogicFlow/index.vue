<template>
  <div>
    <!-- 节点面板 -->
    <NodePanel v-if="lf" :lf="lf" :node-list="nodeList" />
    <!-- 画布 -->
    <div id="flow" />
    <!-- 辅助工具栏 -->
    <Control
      v-if="lf"
      class="demo-control"
      :lf="lf"
      @catData="catData"
    />
    <!-- 属性面板 -->
    <el-drawer
      title="设置节点属性"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="400px"
      :before-close="closeDialog"
    >
      <PropertyDialog
        v-if="dialogVisible"
        :node-data="clickNode"
        :lf="lf"
        @setPropertiesFinish="closeDialog"
      />
    </el-drawer>
    <!-- 数据查看面板 -->
    <el-dialog
      title="数据"
      :visible.sync="dataVisible"
      width="50%"
    >
      <DataDialog :graph-data="graphData" />
    </el-dialog>
  </div>
</template>
<script>
// 引入logicflow
import LogicFlow from '@logicflow/core'
// 从logicflow组件包中解构出控制面板、右键菜单、拖拽面板
import { Menu, DndPanel, Snapshot, MiniMap } from '@logicflow/extension'
// 引入logicflow样式
import '@logicflow/core/dist/style/index.css'
// 引入logicflow组件样式
import '@logicflow/extension/lib/style/index.css'
// 重置节点圆形、矩形
// import { registerCircle, registerRect } from './registerNode'
// HTML
import registerCircle from './js/registerCircle'
import registerRect from './js/registerRect'
import registerStart from './js/registerStart'
import registerDevice from './js/registerDevice'
import registerServe from './js/registerServe'
import PropertyDialog from './PropertySetting/PropertyDialog'
import NodePanel from './NodePanel'
import Control from './Control'
import DataDialog from './DataDialog'
import { nodeList } from './js/config'
export default {
  name: 'LogicFlow',
  components: { NodePanel, Control, PropertyDialog, DataDialog },
  provide() {
    return {
      laneId: this.laneId
    }
    // provide发送值，类型为对象
  },
  props: {
    nodeData: {
      type: Object,
      default: () => {}
    },
    laneId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      lf: null,
      nodeList,
      clickNode: null,
      addClickNode: null,
      dialogVisible: false, // 数据查看弹窗
      dataVisible: false, // 数据查看弹窗
      graphData: null, // 数据
      config: { // logicflow配置
        stopScrollGraph: true, // 禁止鼠标滚动移动画布，默认false
        stopZoomGraph: true, // 禁止缩放画布，默认false
        snapline: true, // 是否启用节点辅助对齐线，默认true
        keyboard: {
          enabled: true // 开启默认的快捷键， ctrl + c  ctrl + v
        },
        height: 1800, // 画布高度，单位'px'
        grid: { // 网格，若设为false不开启网格，则为 1px 移动单位，不绘制网格背景，若设置为true开启则默认为 20px 点状网格
          type: 'dot', // 网格样式，目前内置支持点状'dot'和网格'mesh'
          size: 10 // 栅格
        },
        textEdit: true, // 是否开启文本编辑
        style: { // 节点样式
          rect: { // 矩形样式
            width: 80,
            height: 40,
            radius: 6,
            stroke: '#187DFF' // 边框颜色
          },
          circle: { // 圆形样式
            r: 20, // 半径
            stroke: '#187DFF'
          },
          line: { // 直线
            stroke: '#187DFF'
          },
          polyline: { // 折线
            stroke: '#187DFF'
          }
        }
      }
    }
  },
  watch: {
    nodeData: {
      handler(newValue, oldValue) {
        if (newValue.id) {
          // lf.getNodeData(nodeId) 获取节点数据
          const curNodeData = this.lf.getNodeDataById(newValue.id)
          if (newValue.name !== curNodeData.text.value) {
            curNodeData.text.value = newValue.name
            curNodeData.properties = Object.assign({}, newValue)
            // lf.setNodeData(nodeData) 设置节点数据
            this.lf.setNodeData(curNodeData)
          } else {
            curNodeData.properties = Object.assign({}, newValue)
            this.lf.setNodeData(curNodeData)
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initFlow()
  },
  methods: {
    initFlow() {
      // 生成logicflow实例
      const lf = new LogicFlow({
        ...this.config,
        container: document.querySelector('#flow'),
        plugins: [Menu, DndPanel, MiniMap, Snapshot]
        //         // 控制面板
        // LogicFlow.use()
        // // 右键菜单
        // LogicFlow.use(Menu)
        // // 拖拽面板
        // LogicFlow.use(DndPanel)
      })
      this.lf = lf
      // 设置主题
      lf.setTheme({
        circle: {
          stroke: '#000000',
          strokeWidth: 1,
          outlineColor: '#88f'
        },
        rect: {
          outlineColor: '#88f',
          strokeWidth: 1
        },
        polygon: {
          strokeWidth: 1
        },
        polyline: {
          stroke: '#000000',
          hoverStroke: '#000000',
          selectedStroke: '#000000',
          outlineColor: '#88f',
          strokeWidth: 1
        },
        nodeText: {
          color: '#000000'
        },
        edgeText: {
          color: '#000000',
          background: {
            fill: '#f7f9ff'
          }
        }
      })
      // 注册节点
      registerCircle(this.lf)
      registerRect(this.lf)
      registerStart(this.lf)
      registerDevice(this.lf)
      registerServe(this.lf)
      /*
       * 自定义右击菜单
       * 注意：最新版修改为 lf.setMenuConfig() !!!
       * 参考：http://logic-flow.org/guide/extension/component-menu.html#重置菜单
       */
      this.lf.setMenuConfig({
        nodeMenu: [
          {
            text: '删除',
            callback(node) {
              lf.deleteNode(node.id)
            }
          },
          {
            text: '复制',
            callback(node) {
              lf.cloneNode(node.id)
            }
          }
        ]
      })

      // 渲染logicflow，并添加相应的事件监听
      this.renderFlow()
    },
    renderFlow() {
      this.lf.render()
      this.eventFlow()
    },
    eventFlow() {
      // 参考 http://logic-flow.org/guide/advance/event.html#边事件
      // 节点点击
      this.lf.on('node:click', ({ data }) => {
        console.log('node:click', data)
        this.clickNode = data
        this.dialogVisible = true
      })
      // 节点不允许建立连接
      this.lf.on('connection:not-allowed', (data) => {
        this.$message({
          type: 'error',
          message: data.msg
        })
      })
      this.lf.on('edge:click', ({ data }) => {
        console.log('edge:click', data)
        this.clickNode = data
        this.dialogVisible = true
      })
      this.lf.on('element:click', () => {
      })
      this.lf.on('edge:add', ({ data }) => {
        console.log('edge:add', data)
      })
      this.lf.on('node:mousemove', ({ data }) => {
        console.log('node:mousemove')
        this.moveData = data
      })
      this.lf.on('blank:click', (e) => {
        this.$emit('blank-click', e)
      })
      this.lf.on('connection:not-allowed', (data) => {
        this.$message({
          type: 'error',
          message: data.msg
        })
      })
    },

    mouseDownPlus(e, attributes) {
      e.stopPropagation()
      console.log('mouseDownPlus', e, attributes)
    },
    hideAddPanel() {
      this.showAddPanel = false
      this.addPanelStyle.top = 0
      this.addPanelStyle.left = 0
      this.addClickNode = null
    },
    getGraphData() {
      // lf.getGraphData() 获取流程绘图数据
      return this.lf.getGraphData()
    },
    getData() {
      const data = this.lf.getGraphData()
      console.log(JSON.stringify(data))
    },
    closeDialog() {
      this.dialogVisible = false
    },
    catData() {
      this.graphData = this.lf.getGraphData()
      this.dataVisible = true
    }
  }
}
</script>
<style>
.logic-flow-view {
  height: 100vh;
  position: relative;
}
.demo-title{
  text-align: center;
  margin: 20px;
}
.demo-control{
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 2;
}
#LF-view{
  width: calc(100% - 100px);
  height: 80%;
  outline: none;
  margin-left: 50px;
}
.time-plus{
  cursor: pointer;
}
.add-panel {
  position: absolute;
  z-index: 11;
  background-color: white;
  padding: 10px 5px;
}
.el-drawer__body {
  height: 80%;
  overflow: auto;
  margin-top: -30px;
  z-index: 3;
}
</style>

