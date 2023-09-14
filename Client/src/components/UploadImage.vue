<script>
import ImageCropper from './ImageCropper.vue';
import InputTypeFile from './InputTypeFile.vue';

export default {
  components: {
    ImageCropper,
    InputTypeFile
  },
  props: {
    cooldown: {
      type: Number
    },
    src: {
      type: String,
    },
    aspectRatio: {
      type: Number
    },
    hidden: {
      type: Boolean
    },
    id: String,
    title: String
  },
  data() {
    return {
      url: null,
      cropper: {},
      destination: {},
      image: {},
      croppedImage: null,
      isProcessing: false,
      isLoaded: false
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
      this.isLoaded = true
    },
    croppingChangedHandler(value) {
      this.croppedImage = value;
      this.$emit('croppingChanged', value);
    },
    croppingSavingHandler() {
      this.isProcessing = true;
    },
    croppingSavedHandler() {
      this.isProcessing = false;
    },
    clearedHandler() {
      this.$emit('cleared');
    },
    show() {
      this.$el.style.display = 'block';
    },
    hide() {
      this.$el.style.display = 'none';
    },
    createNewImage() {
      this.$emit('submitCroppedImage', this.croppedImage);
    }

  },
  watch: {
    src: function () {
      this.url = this.src;
    }
  },
  mounted() {
    this.hide();
  }
}
</script>

<template>
  <div :id="id" class="modalWrapper">
    <div class="modalOverlay" @click="hide"></div>
    <div class="modal">
      <button @click="hide" class="close" type="button">X</button>
      <div class="modal-header" v-if="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <InputTypeFile @change="onFileChange" @cleared="clearedHandler" iaccept=".jpg, .png" icapture />
        <ImageCropper @saved="croppingSavedHandler" @saving="croppingSavingHandler" @change="croppingChangedHandler"
          v-show="url" ref="cropper" :aspectRatio="aspectRatio" :cooldown="cooldown" :src="url" :hidden="hidden">
        </ImageCropper>
      </div>
      <button :disabled="!isLoaded || isProcessing" @click="createNewImage" class="button" type="button">
        Add image
        <div id="quillLoading" v-if="isProcessing" class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="lds-ring" style="color: green;" v-else>✔</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
}

.modalWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  z-index: 65535;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-block: 16px;
}

.modalOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.button {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.close {
  content: "X";
  position: absolute;
  padding: 0;
  width: 36px;
  height: 36px;
  top: -18px;
  right: 16px;
  background-color: white;
  z-index: 10;
  border-radius: 50%;
  border: none;
  text-align: center;
  font-weight: bolder;
  box-shadow: 0 0 5px #888;
}

.modal {
  position: absolute;
  left: 0;
  right: 0;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-inline: 16px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  width: 50%;
  background-color: #fff;
  z-index: +20;
  transform: translateY(20vh);

  @media only screen and (max-width:768px) {
    width: 100%;
  }
}
</style>