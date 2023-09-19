<script>
export default {
  methods: {
    search(key) {
      this.$refs.search.value = key;
      this.$refs.search.dispatchEvent(new Event('input'));
    }
  }
}
</script>
<template>
  <input ref="search" type="text" name="search" id="search" placeholder="Search ...">
</template>