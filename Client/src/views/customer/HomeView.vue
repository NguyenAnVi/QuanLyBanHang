<script>
// import { useToast } from 'vue-toastification';

export default {
  name: "Navbar"
}
</script>

<template>
  <main>
    Home customer
  </main>
</template>

<style scoped>
main{
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;
}
.tags-wrapper{
  height: 36px;
  display: flex;
  gap: 12px;
  overflow-X: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0;
  }
  
  &>*{
    display: flex;
    min-width: fit-content;
    align-items: center;
    justify-content: center;
    padding-inline: 16px;
    padding-block: 4px;
    background-color: var(--color-background-1);
    border-radius: 25px;
  }
}

</style>
