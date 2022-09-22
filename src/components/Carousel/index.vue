<template>
  <!-- <div>
    <div class="pic-box">
      <pic-zoom :url="pImgSrc" :scale="3" />
    </div>
    <div class="box">
      <el-carousel height="90px" indicator-position="none" :interval="5000">
        <el-carousel-item v-for="(item,i) in imagesList" :key="i">
          <div
            v-for="(img,index) in item.imgUrl"
            :key="index"
            class="img-url"
            @click="getIndex(img.url)"
          >
            <img :src="img.url">
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div> -->

  <div class="slide_pc">
    <el-carousel trigger="click" height="20vw" :interval="5000" arrow="hover" @change="loadAnimate">
      <el-carousel-item v-for="(item,index) in imagesList" :key="index">
        <figure>
          <img :src="item.url" style="width:100%;height: auto;">
        </figure>
      </el-carousel-item>
    </el-carousel>
    <!-- <slider-show :slides="sliders" :inv="invTime"></slider-show> -->
  </div>

</template>
<script>
// import PicZoom from '../PicZoom/index'
export default {
  name: 'Carousel',
  components: {
    // PicZoom
  },
  props: {
    imgSrc: {
      type: String,
      default: ''
    },
    imagesList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      pImgSrc: ''
    }
  },
  watch: {
    imgSrc: {
      handler(aImgSrc, pImgSrc) {
        this.pImgSrc = aImgSrc
      },
      immediate: true
    }
  },
  methods: {
    loadAnimate(val) {

    },
    getIndex(imgSrc) {
      this.pImgSrc = imgSrc
    }
  }
}
</script>

<style scoped lang="scss"  >
.box {
  width: 100%;
  height: 500px;
  overflow: hidden;
  margin-top: 10px;
  ul {
    position: absolute;
    width: 2000px;

    li {
      display: inline-block;
      list-style: none;
      width: 90px;
      height: 90px;
      background-color: white;
      margin-top: 15px;
      border: 1px solid #eee;
      overflow: hidden;
      margin-right: 10px;
      img {
        width: 100%;
      }
    }
  }
}
.pic-box {
  position:relative;
  width:  100%;
  height: 400px;
  border: 1px solid #eee;
}
.mouse-cover-canvas {
  top: 200px !important;
  margin-top: 200px;
}

.img-url {
  display: inline-block;
  border: 1px solid #eee;
  margin-right: 10px;
  &:nth-child(5) {
    margin-right: 0;
  }
  img {
    width: 125px;
  }
}
</style>
