<script>

export default {
  name: "OrderSuccessCustomer",
  data() {
    return {
      origin: location.origin
    }
  }
}
</script>

<template>
  <main>
    <Teleport to="#content">
      <div class="mask" id="DY!q">
        <div class="content">
          <img :src="origin + '/success.gif'" alt="">
          <h1>Ordered Successfully</h1>
          <button @click="$router.push({ name: 'CustomerHome' })" class="block">RETURN TO HOME</button>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}

main>* {
  padding: 8px;
}

img {
  height: 400px;
}

h1 {
  text-align: center;
  color: white;
}

.mask {
  position: fixed;
  z-index: 9996;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  background-color: #12C06A;
}


.content {
  z-index: 9997;
}

.mask {
  box-shadow: inset 0 0 48px #000;
}
</style>
