<script>
export default {
  name:"Marquee",
}
</script>

<template>
  <div class="marquee">
    <p class="marquee-text">
      <slot></slot>
    </p>
  </div>
</template>

<style scoped>
.marquee {
  width: 100%;
  display: flex;
  align-items: center;

  color: black;

  white-space: nowrap;
  overflow: hidden;
  & p {
    margin: 0;
    &:hover{
      padding-right: 100%;
      animation: marquee 15s linear infinite;
    }
  }
}
@keyframes marquee {
  0% { transform: translate(0, 0); }
  45% { transform: translate(-100%, 0); }
  49% { transform: translate(-100%, 50px); }
  51% { transform: translate(100%, 50px); }
  65% { transform: translate(100%, 0); }
  100% { transform: translate(0, 0); }
}
</style>