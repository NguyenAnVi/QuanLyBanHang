<script>
import * as yup from "yup";
import Select from '../components/Select.vue';
import Switcher from '../components/Switcher.vue';
import UploadImage from "../components/UploadImage.vue";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Switcher,
    Select,
    Form,
    Field,
    ErrorMessage,
    UploadImage
  },
  data() {
    const schema = yup.object().shape({
      name: yup
        .string()
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      phone: yup
        .string()
        .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Phone number is not valid'),
      email: yup
        .string()
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      newpassword: yup
        .string()
        .min(0, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),
      currentpassword: yup
        .string()
        .when('password', {
          is: (val) => (val && val.length > 0 ? true : false),
          then: yup
            .string()
            .required("Current Password is required!")
            .min(6, "Must be at least 6 characters!")
            .max(40, "Must be maximum 40 characters!")
        }),
      confirmnewpassword: yup
        .string()
        .when('password', {
          is: (val) => (val && val.length > 0 ? true : false),
          then: yup
            .string()
            .required("Confirm Password is required!")
            .min(6, "Must be at least 6 characters!")
            .max(40, "Must be maximum 40 characters!")
            .oneOf([yup.ref('password')], 'Passwords must match')
        })
    });
    return {
      selectOptions: {
        optionName: "Language",
        optionId: "Language",
        optionName: "language",
        options:
          [
            {
              value: "vietnamese",
              label: "Tiếng Việt"
            },
            {
              value: "english",
              label: "English"
            },
            {
              value: "teyvat",
              label: "Teyvat",
              selected: true
            },
            {
              value: "0",
              label: "Choose one...",
            }
          ]
      },
      successful: false,
      loading: false,
      message: "",
      schema,
      avtSrc: ""
    }
  },
  methods: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    handleUpdateProfile(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;

      console.log(user);
      this.$store.dispatch("auth/updateprofile", user).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
          toast(this.message);
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message || error.toString();
          toast(this.message, { type: "error" });
          this.successful = false;
          this.loading = false;
        }
      );
    },
    saveSrc(imgSrc) {
      this.avtSrc = imgSrc;
      document.getElementById('newavatar').value = imgSrc;
      document.getElementById('newavatar').dispatchEvent(new Event('change'));
    },
    async handleUpdateAvatar() {
      this.message = "";
      this.successful = false;
      this.loading = true;

      const payload = { avatar: this.avtSrc }
      console.log(payload);
      await this.$store.dispatch("auth/updateavatar", payload).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
          toast(this.message);
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message || error.toString();
          toast(this.message, { type: "error" });
          this.successful = false;
          this.loading = false;
        }
      );
      this.$emit('updateAuthentication');
    }
  }
}
</script>

<template>
  <main>
    <div class="settings-wrapper">
      <h1>Settings</h1>
      <div class="settings-section">
        <h2>Site preferences</h2>
        <div class="settings">
          <div class="setting-cell switcher">
            <label for="theme">Dark mode (Coming soon)</label>
            <Switcher></Switcher>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h2>Localization</h2>
        <div class="settings">
          <div class="setting-cell ">
            <label for="language">Display language (Coming soon)</label>
            <Select disabled :selectOptions="selectOptions" selectName="select" selectId="select"></Select>
          </div>
          <!-- <div class="setting-cell ">
            <label for="language">Display language (Coming soon)</label>
            <input type="text"/>
          </div> -->
        </div>
      </div>
      <div class="settings-section" v-if="currentUser">
        <h2>Account</h2>
        <Form ref="form" @submit="handleUpdateProfile" :validation-schema="schema" class="settings">
          <div class="setting-cell">
            <label for="name">Name</label>
            <!-- <input type="text" name="name" id="name"> -->
            <Field name="name" type="text" id="name" />
            <ErrorMessage name="name" class="error-feedback" />
          </div>
          <div class="setting-cell">
            <label for="phone">Phone</label>
            <Field name="phone" type="tel" id="phone" />
            <ErrorMessage name="phone" class="error-feedback" />
          </div>
          <div class="setting-cell">
            <label for="email">Email</label>
            <Field type="email" name="email" id="email" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="setting-cell">
            <label for="emcurrentpasswordail">Current password</label>
            <Field type="password" name="currentpassword" id="currentpassword" />
            <ErrorMessage name="currentpassword" class="error-feedback" />
          </div>
          <div class="setting-cell">
            <label for="newpassword">New password</label>
            <Field type="password" name="newpassword" id="newpassword" />
            <ErrorMessage name="newpassword" class="error-feedback" />
          </div>
          <div class="setting-cell">
            <label for="confirmnewpassword">Confirm password</label>
            <Field type="password" name="confirmnewpassword" id="confirmnewpassword" />
            <ErrorMessage name="confirmnewpassword" class="error-feedback" />
          </div>
          <div class="setting-cell">
            <label for=""></label>
            <button :disabled="loading">
              <div v-show="loading" class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              Apply changes
            </button>
          </div>
        </form>
        <Form @submit="handleUpdateAvatar" class="settings">
          <label for="">Avatar</label>
          <UploadImage :aspect-ratio="1" @croppingChanged="saveSrc"></UploadImage>
          <Field ref="newavatar" id="newavatar" type="hidden" name="newavatar" />
          <button :disabled="loading" id="submit-avatar">
            <div v-show="loading" class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            Crop and save
          </button>
        </Form>
      </div>
    </div>
    <div class="sidebar-parallel"></div>
  </main>
</template>

<style scoped>
* {
  background-color: transparent;
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  overflow: hidden;
}

.settings-wrapper {
  max-width: 1800px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &>h1:first-child {
    margin-inline: 16px;
    margin-top: 50px;
    margin-bottom: 16px;
  }


}

.sidebar-parallel {
  width: var(--sidebar-icon-width);
  margin-left: 8px;

  @media only screen and (max-width: 768px) {
    display: none;
  }
}

.settings-section {
  background-color: rgba(255, 255, 255, 0.253);
  padding: 16px;
  width: 750px;
  border-radius: 8px;

  &>h2 {
    font-weight: 100;
  }

  &>.settings {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 8px;
    transition: background-color .3s ease-out;

    & .setting-cell {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 8px;

      width: 100%;
      justify-content: space-between;
      align-items: center;

      & * {
        flex-basis: auto;
      }

      & label:first-child {
        flex-basis: 60%;
      }

      &:has(input)>label:first-child {
        flex-basis: 40%;
      }

      & input {
        width: 100%;
        padding: 10px 0px;
        border: none;
        border-bottom: 2px solid #ffffff92;
        background-color: transparent;
        transition-property: border-bottom;
        transition-duration: .2s;
        transition-timing-function: linear;
        box-sizing: content-box;

        &:hover,
        &:focus {
          border-bottom: 2px solid #fff;
          outline: none;
        }
      }

      &>.error-feedback {
        width: 100%;
        color: red;
        flex: 1;
      }

    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

  }
}

button {
  text-align: center;

  min-width: 200px;
  height: max-content;
  padding: 10px 20px;

  display: flex;
  justify-content: center;

  border: none;
  color: #000;
  background-color: #ffffff92;

  &:hover {
    background-color: #ffffff;
  }
}

#submit-avatar {
  width: 200px;
  right: 200px;
  float: right;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
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
