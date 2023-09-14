<script>
import { h, render, reactive, toRefs } from "vue";
const { min, max } = Math;
export default {
  name: "PreviewImages",
  props: {
    id: String,
    images: Array
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
  watch: {
    images: {
      intermediate: true,
      deep: true,
      handler: function (oldImages, newImages) {
        this.fetchImages(newImages);
      }
    }
  },
  methods: {
    deleteImage($event) {
      const index = $event.target.getAttribute("data-index");
    },
    fetchImages(images) {
      let imagesPreview = document.getElementById(this.$props.id);
      imagesPreview.innerHTML = "";
      images.forEach(function (img, index) {
        const div = document.createElement('div');
        div.className = 'img-item';
        const props = {
          class: 'imageItem',
          'data-index': index,
        }
        const children = [
          h('button', {
            class: 'deleteImageButton',
            type: 'button',
            'data-index': index,
            onClick: this.deleteImage
          }, {}, "X"),
          h('img', {
            class: 'imagePreview',
            'data-index': index,
            src: img,
            alt: img
          })
        ];
        const imgItem = h('div', props, children);
        imagesPreview.appendChild(div)
        render(imgItem, div)
      }, this);
    },
    deleteImage($event) {
      this.$emit("deleteImage", $event.target.getAttribute('data-index'))
    }

  }
}
</script>

<template>
  <div class="imagesPreview" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel" :id="id"></div>
</template>
<style>
.imagesPreview {
  padding-top: 8px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  max-height: 100px;
  width: 100%;
  overflow: hidden;
}

.imageItem {
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  font-weight: bolder;
  box-sizing: border-box;
  margin-right: 8px;
  background-color: antiquewhite;
}

.deleteImageButton {
  padding: 0;
  position: relative;
  width: 24px;
  height: 24px;
  right: -76px;
  background-color: rgb(255, 0, 0);
  color: rgb(255, 255, 255);
  z-index: 10;
  border-top-right-radius: 8px;
  border: none;
  box-shadow: none;
}

.deleteImageButton:hover {
  transform: none;
  background-color: rgb(255, 0, 0);
  box-shadow: none;
}

img.imagePreview {
  display: block;
  border-radius: 8px;
  width: 100px;
  height: 100px;
  z-index: -1;
  transform: translateY(-24px);
}
</style>