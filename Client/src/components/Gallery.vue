<script>
import { reactive, toRefs } from 'vue';
const { min, max } = Math;
export default {
  name: "Gallery",
  props: {
    images: {
      type: Array,
      required: true
    },

  },
  setup() {
    const state = reactive({
      scroller: null,
      scrollLeft: 0,
    });

    const onWheel = (e) => {
      state.scrollLeft = state.scroller
        ? min(
          state.scroller.scrollWidth - state.scroller.offsetWidth,
          max(0, e.deltaY + state.scrollLeft)
        )
        : state.scrollLeft;
    };
    return { ...toRefs(state), onWheel };
  },
  data() {
    const origin = location.origin;
    const currentImageIndex = -1;
    // console.log(this.$props.images);
    return {
      monitor: this.$props.images.length > 0 ? this.$props.images[currentImageIndex].publicPath : (origin + "noimage.png"),
      currentImageIndex,
      origin

    }
  },
  methods: {
    show(index) {
      // console.log("showing: ", index);
      this.currentImageIndex = index;
      if (this.validArray) {
        // console.log(this.$props.images[index].publicPath);
        this.monitor = this.$props.images[index].publicPath;
      } else { this.showAlternative(); }
    },
    showAlternative() {
      // console.log("showingAlternative");
      this.monitor = this.origin + "/noimage.png"
    }
  },
  computed: {
    validArray() {
      return this.images.length > 0;
    }
  },
  watch: {
    images(newV, oldV) {
      // console.log("images changed");
      this.show(0)
    }
  }
}
</script>
<template>
  <div class="gallery">
    <div class="monitor">
      <img :src="monitor" alt="">
    </div>
    <div class="gallery-shelf" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel">
      <img v-for="(image, index) in images" :key="index" :src="image.publicPath" @click="show(index)" alt="">
    </div>
  </div>
</template>
<style scoped>
.gallery {
  width: inherit;
  display: block;
}

.monitor {
  width: 100%;

  & img {
    width: 100%;
  }
}

.gallery-shelf {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-x: scroll;

  & img {
    display: block;
    height: 5rem;
    aspect-ratio: 1;
  }

  &::-webkit-scrollbar {
    height: 0;
  }
}
</style>