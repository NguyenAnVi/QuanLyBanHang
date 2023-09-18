<script>
import * as yup from "yup";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";

import ConfirmDialog from "@/components/ConfirmDialog.vue";
import UploadImage from "@/components/UploadImage.vue";
import PreviewImages from "@/components/PreviewImages.vue";
import InputTypeFile from "@/components/InputTypeFile.vue";

import { QuillEditor } from '@vueup/vue-quill';
import QuillHTMLEditButton from 'quill-html-edit-button';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
library.add(faCloudArrowUp);

export default {
  components: {
    Form,
    Field,
    QuillEditor,
    UploadImage,
    ErrorMessage,
    InputTypeFile,
    UploadImage,
    PreviewImages,
    ConfirmDialog
  },
  async setup() {
    const p = reactive({
      _id: "",
      roduct: {},
      oldimages: [],
      oldimagesources: []
    });
    const route = useRoute();
    const store = useStore();
    p._id = route.params.id;

    await store.dispatch("product/getEdit", {
      id: p._id
    })
      .then(
        async (product) => {
          p.roduct = product;
        }
      )
      .catch(
        error => {
          toast(error || error.message, { type: "error" });
          p.roduct = {
            _id: "",
            name: "",
            description: "",
            price: 0,
            quantity: 0,
            note: "",
            description: ""
          };
        }
      );
    await store.dispatch("product/getEditImages", {
      id: p._id
    })
      .then(
        async (images) => {
          images.forEach(img => {
            p.oldimagesources.push(img.publicPath);
            p.oldimages.push(img);
          })
          p.oldimages = images;
        }
      )
      .catch(
        error => {
          toast(error || error.message, { type: "error" });
          p.oldimages = [];
        }
      );

    const modules = {
      name: 'htmlEditButton',
      module: QuillHTMLEditButton,
      options: {
        debug: true
      },
    };

    return { modules, p };
  },
  data() {
    return {
      product: this.p.roduct,
      title: document.title,
      imagesArr: [],
      oldImagesDocArr: this.p.oldimages,
      oldImageSourcesArr: this.p.oldimagesources,
      thumbnailUrl: "",
      thumbnailPreviewSrc: "",
      isThumbnailFileSelected: false,
      isEditorSaved: true,
      isProcessing: ref(false),
      description: "",
    };
  },
  methods: {
    async onEditorChangeHandler() {
      const desInp = document.getElementById('description');
      this.isEditorSaved = false;
      var id = window.setTimeout(function () { }, 0);

      while (id--) {
        window.clearTimeout(id); // will do nothing if no timeout with id is present
      }

      setTimeout(() => {
        desInp.value = this.$refs.quillEditor.getHTML();
        desInp.dispatchEvent(new Event('change'));
        this.isEditorSaved = true;
      }, 500);
    },
    async submitHandler(product) {
      this.isProcessing = true;
      await this.$store.dispatch("product/edit", {
        id: this.p._id,
        product
      })
        .then((res) => {
          this.isProcessing = false;

          this.$emit('notification', { message: res.message, type: 'success' })
          this.$router.push({ name: "m.product" });
        })
        .catch((error) => {
          this.isProcessing = false;
          this.message =
            (error.response &&
              error.response?.data &&
              error.response?.data.message) ||
            error.message ||
            error.toString();
          toast(error.response?.data.message || error.message, { type: "error" });
        }
        );
      this.isProcessing = false;
    },
    openImageUploadModal() {
      document.getElementById('uploadImageModal').style.display = 'block';
    },
    addNewImage(newImgData) {
      let tArr = this.imagesArr;
      tArr.push(newImgData)
      this.imagesArr = tArr;
      this.$refs.uploadImageModal.hide();
    },
    deleteImage(index) {
      if (index > this.oldImageSourcesArr.length) {
        let tArr = this.imagesArr;
        tArr.splice(index - this.oldImageSourcesArr.length, 1);
        this.imagesArr = tArr;
      } else {
        // confirm delete productImage
        this.$refs.confirmDialog.show("Are you sure you want to delete?", index)
      }
    },
    deleteOldProductImage(index) {
      this.$store.dispatch("product/deleteProductImage", {
        id: this.oldImagesDocArr[index]._id
      })
        .then((res) => {
          this.oldImagesDocArr.splice(index, 1);
          this.oldImageSourcesArr.splice(index, 1);
          this.$emit("notification", { message: res.message, type: "success" })
        })
        .catch((error) => {
          this.message =
            (error.response &&
              error.response?.data &&
              error.response?.data.message) ||
            error.message ||
            error.toString();
          toast(error.response?.data.message || error.message, { type: "error" });
        });
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.userE.user;
    },
    schema() {
      return yup.object().shape({
        name: yup
          .string()
          .required('This field is required'),
        images: yup
          .string(),
        price: yup
          .number()
          .required('This field is required')
          .min(0, 'Price cannot be negative'),
        quantity: yup
          .number()
          .required('This field is required')
          .min(0, 'Quantity cannot be negative'),
        description: yup
          .string(),
        note: yup
          .string(),
      });
    },
    isFormSubmittable() {
      return (!this.isProcessing && this.isEditorSaved);
    }
  },
  watch: {
    imagesArr: {
      intermediate: true,
      deep: true,
      handler: function (newImages, oldImages) {
        const imagesInput = document.getElementById('images');
        imagesInput.value = JSON.stringify(newImages);
        imagesInput.dispatchEvent(new Event('change'));
      }
    },
    oldImageSourcesArr: {
      intermediate: true,
      deep: true,
      handler: function (newImages) {
        const imagesInput = document.getElementById('oldimages');
        imagesInput.value = JSON.stringify(newImages);
        imagesInput.dispatchEvent(new Event('change'));
      }
    }
  },
  mounted() {
    if (this.p.roduct.description) {
      this.$refs.quillEditor.pasteHTML(this.p.roduct.description);
    }
  }
};
</script>

<template>
  <main>
    <div class="wrapper">
      <h1 class="section-wrapper background-transparent" @click="$router.go(-1)">&lt;&nbsp;{{ title }}</h1>
      <Form ref="form" @submit="submitHandler" :validation-schema="schema" class="section-wrapper" v-show="currentUser">
        <div class="group-wrapper upload">
          <h3>Product Information</h3>
          <div class="cell-wrapper">
            <label for="name">Product name</label>
            <Field type="text" ref="name" id="name" :value="product.name" placeholder="Product A" name="name" />
            <ErrorMessage name="name" />
          </div>
          <div class="horizontal">
            <div class="cell-wrapper">
              <label for="name">Product price</label>
              <Field type="number" step="1000" min="0" ref="price" :value="product.price" id="price" placeholder
                name="price" />
              <ErrorMessage name="price" />
            </div>
            <div class="cell-wrapper">
              <label for="name">Product quantity</label>
              <Field type="number" step="1" min="0" ref="quantity" :value="product.quantity" id="quantity" placeholder
                name="quantity" />
              <ErrorMessage name="quantity" />
            </div>
          </div>
          <div class="cell-wrapper quill">
            <label>
              Product description
              <div id="quillLoading" v-if="!isEditorSaved" class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div id="quillLoaded" v-else class="lds-ring checked"></div>
            </label>

            <QuillEditor id="quillEditor" ref="quillEditor" theme="snow" :modules="modules" v-model:content="description"
              @textChange="onEditorChangeHandler" />
            <Field type="hidden" ref="description" id="description" name="description" />
          </div>
          <div class="cell-wrapper">
            <label for="name">Note</label>
            <Field type="text" ref="note" :value="product.note" id="note" placeholder name="note" />
            <ErrorMessage name="note" />
          </div>
        </div>
        <div class="group-wrapper upload">
          <h3>Upload Images</h3>
          <div class="cell-wrapper">
            <label for="name">Choose Files</label>
            <button type="button" class="button" @click="openImageUploadModal">Add image</button>
            <PreviewImages id="previewImages" :images="[...oldImageSourcesArr, ...imagesArr]"
              @deleteImage="deleteImage" />
            <Field type="hidden" ref="images" id="images" placeholder name="images" />
            <Field type="hidden" ref="oldimages" id="oldimages" placeholder name="oldimages" />
            <ErrorMessage name="name" />
          </div>

        </div>

        <div class="group-wrapper upload">
          <div class="cell-wrapper">
            <button :disabled="!isFormSubmittable" class="button">
              <div id="quillLoading" v-if="isProcessing" class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <font-awesome-icon v-else icon="cloud-arrow-up" />
              Save Changes
            </button>
          </div>
        </div>
      </Form>
      <div class="section-wrapper" v-show="!currentUser">
        You need to signin to perform this action
      </div>
    </div>
    <ConfirmDialog title="Confirm delete image" @confirmed="deleteOldProductImage" :countdown="4" ref="confirmDialog">
    </ConfirmDialog>
    <UploadImage ref="uploadImageModal" @submitCroppedImage="addNewImage" :aspectRatio="1" id="uploadImageModal" />
  </main>
</template>

<style scoped>
* {
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

.background-transparent {
  background-color: transparent !important;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1.section-wrapper {
  cursor: pointer;
}

.section-wrapper {
  background-color: rgba(255, 255, 255, 0.253);
  padding: 16px;
  margin: 16px;
  width: 75%;

  box-sizing: border-box;

  border-radius: 8px;

  &>.group-wrapper {
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

      background-color: white;
      color: #000;
      box-shadow: 0px 0px 10px #ddd;
      padding: 8px;
      border-radius: 8px;

      justify-content: space-between;
      align-items: center;

      & input,
      & :autofill,
      & :-internal-autofill-selected {
        width: 100%;
        padding: 10px 0px;
        border: none;
        border-bottom: 2px solid #ddd !important;
        background-color: white !important;
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

      &.quill {
        display: block !important;

        &>button {
          border: 1px solid #ddd;
          background-color: white;
          color: #000;
          box-shadow: inset 0 0.2rem 0.4rem rgba(0, 0, 0, .05);
          padding: 8px;
          border-radius: 4px;
        }

        &>label {
          color: #000;
          margin-bottom: 4px;
        }
      }
    }

    & .horizontal {
      display: flex;
      gap: 8px;

      &>* {
        width: calc(50% - 4px) !important;
      }
    }
  }

  @media (max-width:768px) {
    width: 95%;
  }
}

.button {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.section-wrapper {
  display: flex;
  flex-direction: column;
}
</style>