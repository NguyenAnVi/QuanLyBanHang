<script>
export default {
  name: "InputTypeDateComponent",
  setup() {



  },
  methods: {
    changeHandler(event) {
      this.$emit('changed', new Date(event.currentTarget.value));
    }
  },
}
</script>
<template>
  <div>
    <span class="datepicker-toggle">
      <span class="datepicker-toggle-button"></span>
      <input @change="changeHandler" type="date" class="datepicker-input">
    </span>
  </div>
</template>
<style scoped>
input[type="date"] {
  background-color: var(--primary-color);
  padding: 4px;
  padding-left: 16px;
  font-family: "Roboto Mono", monospace;
  color: #ffffff;
  border: none;
  margin: 4px;
  border-radius: 25px;
  box-sizing: border-box;
}

::-webkit-calendar-picker-indicator {
  background-color: #ffffff;
  padding: 5px;
  cursor: pointer;
  border-radius: 25px;
}
</style>