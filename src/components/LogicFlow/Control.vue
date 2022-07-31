<template>
  <div>
    <el-button-group>
      <el-button type="plain" size="small" @click="zoomIn">放大</el-button>
      <el-button type="plain" size="small" @click="zoomOut">缩小</el-button>
      <el-button type="plain" size="small" @click="zoomReset">大小适应</el-button>
      <el-button type="plain" size="small" @click="translateRest">定位还原</el-button>
      <el-button type="plain" size="small" @click="reset">还原(大小&定位)</el-button>
      <el-button type="plain" size="small" :disabled="undoDisable" @click="undo">上一步(ctrl+z)</el-button>
      <el-button type="plain" size="small" :disabled="redoDisable" @click="redo">下一步(ctrl+y)</el-button>
      <el-button type="plain" size="small" @click="download">下载图片</el-button>
      <el-button type="plain" size="small" @click="catData">查看数据</el-button>
    </el-button-group>
  </div>
</template>
<script>
export default {
  name: 'Control',
  props: {
    catTurboData: {
      type: Boolean,
      default: () => { false }
    },
    lf: {
      type: [Object, String],
      default: null
    }
  },
  data() {
    return {
      undoDisable: true,
      redoDisable: true,
      graphData: null,
      dataVisible: false
    }
  },
  mounted() {
    this.lf.on('history:change', ({ data: { undoAble, redoAble }}) => {
      this.undoDisable = !undoAble
      this.redoDisable = !redoAble
    })
  },
  methods: {
    zoomIn() {
      this.lf.zoom(true)
    },
    zoomOut() {
      this.lf.zoom(false)
    },
    zoomReset() {
      this.lf.resetZoom()
    },
    translateRest() {
      this.lf.resetTranslate()
    },
    reset() {
      this.lf.resetZoom()
      this.lf.resetTranslate()
    },
    undo() {
      this.lf.undo()
    },
    redo() {
      this.lf.redo()
    },
    download() {
      this.lf.getSnapshot()
    },
    catData() {
      this.$emit('catData')
    }
  }
}
</script>
<style scoped>
</style>
