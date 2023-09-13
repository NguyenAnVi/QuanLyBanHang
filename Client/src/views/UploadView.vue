<script>
import * as yup from "yup";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { reactive, toRefs, watchEffect } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";

import UploadImage from "../components/UploadImage.vue";
import UploadVideo from "../components/UploadVideo.vue";
import InputTypeFile from "../components/InputTypeFile.vue";

import { QuillEditor } from '@vueup/vue-quill';
import QuillHTMLEditButton from 'quill-html-edit-button';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
library.add( faCloudArrowUp );

const toast = useToast();

function getVideoCover(file, seekTo = 0.0) {
  return new Promise((resolve, reject) => {
      // load the file to a video player
      const videoPlayer = document.createElement('video');
      videoPlayer.setAttribute('src', file.src);
      videoPlayer.load();
      videoPlayer.addEventListener('error', (ex) => {
          reject("error when loading video file", ex);
      });
      // load metadata of the video to get video duration and dimensions
      videoPlayer.addEventListener('loadedmetadata', () => {
          // seek to user defined timestamp (in seconds) if possible
          if (videoPlayer.duration < seekTo) {
              reject("video is too short.");
              return;
          }
          // delay seeking or else 'seeked' event won't fire on Safari
          setTimeout(() => {
            videoPlayer.currentTime = seekTo;
          }, 200);
          // extract video thumbnail once seeking is complete
          videoPlayer.addEventListener('seeked', () => {
              // define a canvas to have the same dimension as the video
              const canvas = document.createElement("canvas");
              canvas.width = videoPlayer.videoWidth;
              canvas.height = videoPlayer.videoHeight;
              // draw the video frame to canvas
              const ctx = canvas.getContext("2d");
              ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
              // return the canvas image as a blob
              ctx.canvas.toBlob(
                  blob => {
                      resolve(blob);
                  },
                  "image/jpeg",
                  0.75 /* quality */
              );
          });
      });
  });
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export default {
  components: {
    Form,
    Field,
    QuillEditor,
    UploadImage,
    UploadVideo,
    ErrorMessage,
    InputTypeFile,
  },
  data() {
    return {
      currentTimeCode:0.0,
      videoDuration:0,
      videoFile:{},
      videoUrl: "",
      isVideoFileSelected: false,
      thumbnailUrl: "",
      thumbnailPreviewSrc : "",
      isThumbnailFileSelected: false,
      videoDescription: "",
      isEditorSaved: true,
      isProcessing: false
    };
  },
  setup() {
    const toast = useToast();
    const store = useStore();
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
    const video = reactive({
      videos: [],
    });

    watchEffect(async function () {
      await store
        .dispatch("video/getVideosForHomePage")
        .then((response) => {
          video.videos = response.videos;
        })
        .catch((error) => {
          toast(error.message, { type: "error" });
          video.videos = null;
        });
    });

    const modules = {
      name: 'htmlEditButton',
      module: QuillHTMLEditButton,
      options: {
        debug: true
      },
    };

    return { video, ...toRefs(state), onWheel, modules };
  },
  methods: {
    async getMetadata($event){
      this.videoDuration = $event.target.duration;
    },
    async HandleVideoFileSelect(file) {
      this.videoFile = file;
      this.videoUrl = URL.createObjectURL(file);
      this.isVideoFileSelected = true;

      var vid = document.createElement('video');
      vid.src = this.videoUrl;
      
      document.getElementById('videoInput').value = await toBase64(file);
      document.getElementById('videoInput').dispatchEvent(new Event('change'));
      document.getElementById('videoTitle').setAttribute('placeholder', file.name);
    },
    HandleVideoFileClear() {
      this.videoFile = {};
      this.isVideoFileSelected = false;
      this.videoUrl = "";
      document.getElementById('videoTitle').value = "";
      document.getElementById('videoTitle').dispatchEvent(new Event('change'));

    },
    HandleThumbnailFileClear() {
      this.thumbnailPreviewSrc = "";
      this.isThumbnailFileSelected = false;
      document.getElementById('thumbnail').value = "";
    },
    HandleThumbnailFileSelect(img) {
      this.thumbnailUrl = img;
      this.isThumbnailFileSelected = true;
    },
    croppingChangedHandler(img) {
      this.thumbnailPreviewSrc = img;
      this.isThumbnailFileSelected = true;
      document.getElementById('thumbnail').value = img;
      document.getElementById('thumbnail').dispatchEvent(new Event('change'));
    },
    getCurrentTimecode($event){
      this.currentTimeCode = $event.target.currentTime;
    },
    async getThumbnailFromVideo(){
      this.HandleThumbnailFileClear();
      try {
        const file = this.$refs.uploadvideo;
        const cover = await getVideoCover(file, this.currentTimeCode);
        this.thumbnailUrl = URL.createObjectURL(cover);
      } catch (ex) {
          console.log("ERROR: ", ex);
      }
    },
    async onEditorChangeHandler($event){
      this.isEditorSaved = false;
      var id = window.setTimeout(function() {}, 0);

      while (id--) {
          window.clearTimeout(id); // will do nothing if no timeout with id is present
      }
      
      setTimeout(() => {
        document.getElementById('videoDescription').value = $event.target.innerHTML;
        document.getElementById('videoDescription').dispatchEvent(new Event('change'));
        this.isEditorSaved = true;
      }, 2000);
    },
    async submitHandler(video){
      if(!video.videoTitle) video.videoTitle = this.videoFile.name || "";

      video.info = {
        name: this.videoFile.name,
        duration: this.videoDuration,
        type: this.videoFile.type
      }

      this.isProcessing = true;

      await this.$store.dispatch("video/upload", video).then(
        (success) => {
          toast(success.data.message, { type:"success" });
        })
        .catch(
        (error) => {
          this.isProcessing = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          toast(error.response.data.message, { type:"error" });
        }
      );
      this.isProcessing = false;
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    schema () {
      return yup.object().shape({
        video: yup
          .string(),
        thumbnail: yup
          .string(),
        videoTitle: yup
          .string(),
        videoDescription: yup
          .string(),
      });
    },
    isFormSubmittable(){
      return (!this.isProcessing && this.isEditorSaved && this.isThumbnailFileSelected && this.isVideoFileSelected);
    }
  },
};
</script>

<template>
  <main>
    <div class="wrapper">
      <h1 class="section-wrapper background-transparent">Upload Video</h1>
      <Form ref="form" @submit="submitHandler" :validation-schema="schema" class="section-wrapper" v-show="currentUser">
        <div class="group-wrapper upload" v-if="videoUrl || isThumbnailFileSelected">
          <h3>Previews</h3>
          <div class="cell-wrapper display-flex-between" v-show="isVideoFileSelected">
            <div class="video-preview">
              <video
                muted
                loop
                ref="uploadvideo"
                id="videopreview"
                controls="false"
                :src="videoUrl"
                v-if="videoUrl"
                @loadedmetadata="getMetadata($event)"
                @pause="getCurrentTimecode($event)"
                @seeked="getCurrentTimecode($event)"
              ></video>
              Video preview
            </div>
            <div class="thumbnail-preview">
              <img class="img-preview" :src="thumbnailPreviewSrc" v-if="isThumbnailFileSelected">
              <div class="fill center" v-else>No image selected</div>
              Thumbnail preview
            </div>
          </div>
        </div>
        <div class="group-wrapper upload">
          <h3>Select video</h3>
          <div class="cell-wrapper">
            <UploadVideo
              @cleared="HandleVideoFileClear"
              @selected="HandleVideoFileSelect"
            ></UploadVideo>
            <Field id="videoInput" ref="video" name="video" type="hidden"/>
          </div>
        </div>
        <div class="group-wrapper upload" v-show="isVideoFileSelected">
          <h3>Select thumbnail</h3>
          <div class="cell-wrapper quill">
            <button type="button" @click="getThumbnailFromVideo">Get current frame of video for thumbnail</button>
            <UploadImage
              :src="thumbnailUrl"
              :hidden="true"
              :aspectRatio="16 / 9"
              :cooldown="300"
              @croppingChanged="croppingChangedHandler"
              @changed="HandleThumbnailFileSelect"
              @cleared="HandleThumbnailFileClear"
            ></UploadImage>
            <Field name="thumbnail" ref="thumbnail" id="thumbnail" type="hidden"/>
          </div>
        </div>
        <div class="group-wrapper" v-show="isVideoFileSelected && isThumbnailFileSelected">
          <div class="cell-wrapper upload">
            <label for="videoTitle">Video Title</label>
            <Field type="text" ref="videoTitle" id="videoTitle" placeholder name="videoTitle" />
            <ErrorMessage name="videoTitle" />
          </div>
          <div class="cell-wrapper quill">
            <label>
              Video Description
              <div id="quillLoading" v-if="!isEditorSaved" class="lds-ring">
                <div></div><div></div><div></div><div></div>
              </div>
              <div id="quillLoaded" v-else class="lds-ring checked"></div>
            </label>
            
            <QuillEditor 
              theme="snow" 
              :modules="modules" 
              v-model:content="videoDescription"
              @input="onEditorChangeHandler"
            />
            <Field type="hidden" ref="videoDescription" id="videoDescription" name="videoDescription" />
            <!-- <ErrorMessage name="videoDescription" /> -->
          </div>
          <div class="cell-wrapper">
            <button :disabled="!isFormSubmittable" class="form-submit">
              Upload
              <div id="quillLoading" v-if="isProcessing" class="lds-ring">
                <div></div><div></div><div></div><div></div>
              </div>
              <font-awesome-icon v-else icon="cloud-arrow-up" />
            </button>
          </div>
        </div>
      </Form>
      <div class="section-wrapper" v-show="!currentUser">
        You need to signin to perform this action
      </div>
    </div>
  </main>
</template>

<style scoped>
*{
  background-color: transparent;
}
main {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.video-preview{
  width: 48%;
  & video{
    width: 100%;

  }
}
.thumbnail-preview {
  display: flex;
  flex-direction: column;
  width: 48%;
  min-height: 100%;
  object-fit: contain;
  & img{
    max-width: 100%;
  }
  & .fill{
    width: auto;
    height: auto;
    align-self: stretch;
    flex-grow:1;
    background-color: #000;
    color: #fff;
  }
  & .center{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.background-transparent{
  background-color: transparent !important;
}
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.section-wrapper {
  background-color: rgba(255, 255, 255, 0.253);
  padding: 16px;
  margin: 16px;
  width: 75%;

  box-sizing: border-box;
    
  border-radius: 8px;
  & > .group-wrapper {
    width: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    &.upload {
      transition: none;
    }
    & .cell-wrapper {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 8px;
      width: inherit;

      background-color: #00000044;
      padding: 8px;
      border-radius: 8px;

      justify-content: space-between;
      align-items: center;

      &.thumbnail{
        display: block !important;
      }
      &.display-flex-between{
        justify-content: space-between !important;
        align-items: stretch;
      }
      & * {
        flex-basis: auto;
      }
      &:has(input[type=text]) > label:first-child {
        flex-basis: 40%;
      }
      & input {
        width: 100%;
        padding: 10px 0px;
        border: none;
        border-bottom: 2px solid #ffffff92;
        background-color: transparent;
        transition-property: border-bottom;
        transition-duration: 0.2s;
        transition-timing-function: linear;
        box-sizing: content-box;
        &:hover,
        &:focus {
          border-bottom: 2px solid #fff;
          outline: none;
        }
      }
      & > .error-feedback {
        width: 100%;
        color: red;
        flex: 1;
      }
      &.quill{
        background-color: white;
        color: #000;
        display: block  !important;
        & > button{
          border: 1px solid #ddd;
          background-color: white;
          color: #000;
          box-shadow: inset 0 0.2rem 0.4rem rgba(0,0,0,.05);
          padding: 8px;
          border-radius: 4px;
        }
        & > label{
          color: #000;
          margin-bottom: 4px;
        }
      }
    }
  }
  @media (max-width:768px){
    width: 95%;
  }
}

input {
  width: fit-content;
}
select {
  background-color: transparent;
  & > option {
    padding: 8px;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: transparent;
  }
}
.form-submit{
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.section-wrapper {
  display: flex;
  flex-direction: column;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 16px;
  height: 17px;
  &.checked::before{
    color: #00d519;
    content:"✔"
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
