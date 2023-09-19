<script>
import { reactive, toRefs } from 'vue';
const { min, max } = Math;
export default {
  name: "Pills",
  props: {
    pills: Array
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
  methods: {
    clickPill(e) {
      this.$emit('clickPill', e.target.innerText);
    }
  }
}
</script>
<template>
  <div class="pills" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel">
    <slot>
      <div class="pill" v-for="pill in pills" @click="clickPill">
        {{ pill }}
      </div>
    </slot>
  </div>
</template>
<style scoped>
.pills {
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;

  overflow-X: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
}

.pills::-webkit-scrollbar {
  height: 0;
}

.pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  background-color: white;
  transition: background-color .3s ease-out;
}

.pill:hover {
  background-color: rgb(0, 141, 96) !important;
  color: white;
}
</style>