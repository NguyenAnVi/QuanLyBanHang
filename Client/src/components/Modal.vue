<script>
export default {
  props: {
    width: {
      type: String,
      default: "300px",
    }
  },
  data() {
    return {
      showState: false,
    }
  },
  methods: {
    refresh() {
      this.$forceUpdate
    },
    show() {
      this.showState = true;
    },
    hide() {
      this.showState = false;
    },
    toggle() {
      this.showState = !this.showState;
    }
  },
  watch: {
    show(foo) {
      this.showState = foo;
    }
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="showState" class="modal-mask" @click.self="$emit('close')">
      <div :style="{ width }" class="modal-container">
        <div class="modal-header">
          <slot name="header">Untitled</slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="hide">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  border-bottom: 2px solid #ddd;

}

.modal-header h3 {
  margin-top: 0;
  color: var(--primary-color);
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}


.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  /* -webkit-transform: scale(1.1);
  transform: scale(1.1); */
  -webkit-transform: translateY(-10px);
  transform: translateY(-10px);
}

.modal-leave-to .modal-container {
  -webkit-transform: translateY(10px);
  transform: translateY(10px);
}
</style>