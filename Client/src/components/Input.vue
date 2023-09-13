<script>
export default {
  name:"Input",
  data(){
    type:"text";
    name:"input";
    id:"input";
    placeholder:"input";
  }
}
</script>

<template>
  <input :="input">
</template>

<style scoped>
input{
  width: 100%;
  padding: 8px 24px;
  background-color: transparent;
  transition: (transform, padding) .5s ease-in-out;
  font-size: 12px;
  line-height: 8px;
  color: #575756;
  background-color: transparent;
  background-image:url(../assets/search.svg);
  background-repeat: no-repeat;
  background-size: 18px 18px;
  background-position: 95% center;
  border-radius: 50px;
  border: 1px solid #575756;
  transition: all 250ms ease-in-out;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-transition: (transform, padding) .5s ease-in-out;
  -moz-transition: (transform, padding) .5s ease-in-out;
  -ms-transition: (transform, padding) .5s ease-in-out;
  -o-transition: (transform, padding) .5s ease-in-out;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  -ms-border-radius: 50px;
  -o-border-radius: 50px;
}
input::placeholder{
  color: rgba(87, 87, 86, 0.8);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
input:hover, input:focus{
  padding: 12px 12px;
  outline: 0;
  border: 1px solid transparent;
  border-bottom: 1px solid #575756;
  border-radius: 0;
  background-position: 100% center;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
}
</style>