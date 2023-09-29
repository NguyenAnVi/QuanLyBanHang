<script>

export default {
  name: "InputTypeSelect",
  props: [
    'options',
    'id',
    'name',
    'label',
    'value'
  ],
  methods: {
    changeHandler($event) {
      const index = $event.target.value;
      this.$emit('changed', this.options[index]);
    }
  },
}
</script>

<template>
  <select :name="name" ref="select" :id="id" @change="changeHandler">
    <option default value="">Select {{ label }}...</option>
    <option v-for="(option, index) in options" :data-index="index" :data-data="option" :value="index">{{
      option.label }}
    </option>
  </select>
</template>

<style scoped>
:root {
  --select-border: #777;
  --select-focus: blue;
  --select-arrow: var(--select-border);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

select {
  min-width: 30ch;
  max-width: 50ch;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
  max-width: 200px;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  outline: none;
}

select::-ms-expand {
  display: none;
}
</style>