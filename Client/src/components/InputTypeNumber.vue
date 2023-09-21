<script>
import Marquee from './Marquee.vue';

export default {
  name: "InputTypeNumber",
  components: {
    Marquee
  },
  props: {
    params: {
      type: [Object, String]
    },
    max: {
      type: Number,
      default: undefined
    },
    min: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: Number
    },
    width: {
      type: String,
      default: "80px"
    },

    disabled: Boolean
  },
  data() {
    return {
      currentValue: 0,
    }
  },
  methods: {
    async valueChanged() {
      if (this.params !== "") {
        this.$emit('changeWithParams', {
          params: this.params,
          value: this.currentValue
        })
      }
      this.$emit('change', this.currentValue)
    },
    increase() {
      this.currentValue += this.step;

    },
    decrease() {
      this.currentValue -= this.step;
    },
    changeValueManually($event) {
      this.currentValue = parseInt($event.currentTarget.value);
    },
    reset() {
      this.currentValue = this.value || this.min;
    }
  },
  watch: {
    value(v) {
      this.currentValue = v;
    },
    async currentValue(v) {
      if (v < this.min) {
        this.currentValue = this.min;

      }
      if (this.max != undefined && (v > this.max || this.max <= this.min)) {
        this.currentValue = this.max;
      }
      await this.valueChanged();
    }
  },
  created() {
    this.reset();
  }
}
</script>

<template>
  <div class="input-wrapper">
    <span :disabled="currentValue <= min" @click="decrease" class="input-number-decrement">–</span>
    <input :disabled="disabled" :style="{ width }" ref="input" @change="changeValueManually" class="input-number"
      type="text" :value="currentValue" :min="min" :max="max">
    <span :disabled="currentValue >= max" @click="increase" class="input-number-increment">+</span>
  </div>
</template>

<style scoped>
span[disabled=true],
input[disabled=true] {
  cursor: no-drop;
  color: #ccc;
  background: linear-gradient(to right, #00000044, #00000044);
}

.input-number {
  padding: 0 12px;
  vertical-align: top;
  text-align: center;
  outline: none;
}

.input-number,
.input-number-decrement,
.input-number-increment {
  border: 1px solid #ccc;
  height: 40px;
  user-select: none;
}

.input-number-decrement,
.input-number-increment {
  display: inline-block;
  width: 30px;
  line-height: 38px;
  background: #f1f1f1;
  color: #444;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}

.input-number-decrement:active,
.input-number-increment:active {
  background: #ddd;
}

.input-number-decrement {
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.input-number-increment {
  border-left: none;
  border-radius: 0 4px 4px 0;
}
</style>