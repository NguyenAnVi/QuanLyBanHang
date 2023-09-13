<script>
import { h, render, defineEmits } from "vue";
export default {
  name:"PreviewImages",
  props:{
    id:String,
    images:Array
  },
  watch:{
    images : {
      intermediate:true,
      deep:true,
      handler: function (oldImages, newImages) {
        this.fetchImages(newImages);
      }
    }
  },
  methods:{
    deleteImage($event){
      const index = $event.target.getAttribute("data-index");
    },
    fetchImages(images){
      let imagesPreview = document.getElementById(this.$props.id);
      imagesPreview.innerHTML = "";
      images.forEach(function (img, index) {
        const div = document.createElement('div');
        div.className = 'img-item';
        const props = {
          class:'imageItem',
          'data-index': index,
        }
        const children = [
          h('button', {
            class:'deleteImageButton',
            type: 'button',
            'data-index': index,
            onClick: this.deleteImage
          },{},"X"),
          h('img', {
            class:'imagePreview',
            'data-index': index,
            src: img,
            alt: img
          })
        ];
        const imgItem = h('div', props, children);
        imagesPreview.appendChild(div)
        render(imgItem, div)
      },this);
    },
    deleteImage($event){
      this.$emit("deleteImage",$event.target.getAttribute('data-index'))
    }
    
  }
}
</script>

<template>
  <div class="imagesPreview" :id="id"></div>
</template>
<style>
.imagesPreview{
  padding-top: 8px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  max-height: 100px;
  width: 100%;
}
.imageItem{
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    box-sizing: border-box;
    margin-right:8px;
    background-color: antiquewhite;
}
.deleteImageButton{
  position: relative;
  width: 24px;
  height: 24px;
  right: -76px;
  background-color: rgb(255, 0, 0);
  color:rgb(255, 255, 255);
  z-index: 10;
  border-radius: 50%;
  border:none;
}
img.imagePreview{
  display: block;
    border-radius: 8px;
  width: 100px;
  height: 100px;
  z-index: -1;
  transform: translateY(-24px);
}
</style>