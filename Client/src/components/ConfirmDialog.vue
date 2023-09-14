<script>
import { ref } from 'vue';
export default {
  props: {
    hidden: {
      type: Boolean
    },
    id: String,
    countdown: Number
  },
  data() {
    return {
      selected: null,
      parameters: ref(null),
      message: ref(""),
      countdownd: 0
    }
  },
  methods: {
    hide() {
      this.$el.style.display = 'none';
    },
    async show(message = null, payload) {
      this.parameters = payload;
      if (message) {
        this.message = message
      }
      this.$el.style.display = 'block';

      if (this.countdown > 0) {
        for (let count = this.countdown; count > 0; count--) {
          setTimeout(() => {
            count -= 1;
            this.countdownd = count;
          }, (this.countdown - count) * 1000);
        }
      }
    },
    proceed() {
      this.$emit('confirmed', this.parameters)
      this.hide();
    }
  },
  mounted() {
    this.$el.style.display = 'none';
  }
}
</script>

<template>
  <div :id="id" class="modalWrapper">
    <div class="modalOverlay" @click="hide"></div>
    <div class="modal">
      <button class="close" @click="hide" type="button">X</button>
      <div class="bodal-body">
        {{ message }}
      </div>
      <button :disabled="countdown && countdownd > 0" @click="proceed" class="button" type="button">
        OK bồ {{ countdown ? `(${countdownd})` : "" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.modalWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  z-index: 65535;
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
  z-index: 1;
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
  z-index: +20;
  transform: translateY(40vh);

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
</style>