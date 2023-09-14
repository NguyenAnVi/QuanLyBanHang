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
    id: String
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
    this.$el.style.display = 'none';
  }
}
</script>

<template>
  <div :id="id" class="modalWrapper">
    <div class="modalOverlay"></div>
    <div class="modal">
      <button @click="hide" class="close" type="button">X</button>
      <div class="bodal-body">
        <InputTypeFile @change="onFileChange" @cleared="clearedHandler" iaccept=".jpg, .png" icapture />
        <ImageCropper @saved="croppingSavedHandler" @saving="croppingSavingHandler" @change="croppingChangedHandler"
          v-show="url" ref="cropper" :aspectRatio="aspectRatio" :cooldown="cooldown" :src="url" :hidden="hidden">
        </ImageCropper>
      </div>
      <button :disabled="!isLoaded || isProcessing" @click="createNewImage" class="button" type="button">
        OK bồ
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
.modalWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 5%;
  top: 0;
  margin-left: auto;
  margin-right: auto;
  display: none;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.253);
  box-sizing: border-box;
}

body {
  background-color: #e2e2e2;
}

.button {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modalOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -10;
}

.close {
  position: absolute;
  width: 36px;
  height: 36px;
  top: -18px;
  right: 16px;
  background-color: white;
  z-index: 10;
  border-radius: 50%;
  border: none
}

.modal {
  position: absolute;
  left: 0;
  right: 0;
  padding-top: 46px;
  padding-bottom: 16px;
  padding-inline: 16px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  width: 50%;
  background-color: rgb(193, 193, 193);

  &>* {
    display: block;
  }

  @media only screen and (max-width:768px) {
    width: 100%;
  }

  .modal-body {
    display: flex;
  }
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 16px;
  height: 17px;

  &.checked::before {
    color: #00d519;
    content: "✔"
  }
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  margin: 0px;
  border: 3px solid #000000;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #000000 transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>