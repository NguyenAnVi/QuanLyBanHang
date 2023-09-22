<script>
import gsap from 'gsap'
export default {
  data() {
    return {
      newProductCount: 0,
      newUserCount: 0,
      newOrderCount: 0,
      newProductCountTweened: 0,
      newUserCountTweened: 0,
      newOrderCountTweened: 0
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.userE.user;
    },
    loggedIn() {
      return this.$store.state.userE.status.loggedIn;
    },
    getTimeOfDay() {
      let hour = new Date().getHours();
      if (hour >= 4 && hour <= 11) return 'Morning';
      if (hour >= 12 && hour <= 16) return 'Afternoon';
      if (hour >= 17 && hour <= 20) return 'Evening';
      if (hour >= 21 || hour <= 3) return 'Night';
    }
  },
  watch: {
    newProductCount(n) {
      gsap.to(this, { duration: 1.5, newProductCountTweened: Number(n) || 0 })
    },
    newUserCount(n) {
      gsap.to(this, { duration: 0.5, newUserCountTweened: Number(n) || 0 })
    },
    newOrderCount(n) {
      gsap.to(this, { duration: 0.5, newOrderCountTweened: Number(n) || 0 })
    }
  },
  async mounted() {
    this.newProductCount = this.$store.dispatch('util/newProductCount')
      .then((res) => {
        this.newProductCount = res;
      });
    this.newUserCount = this.$store.dispatch('util/newUserCount')
      .then((res) => {
        this.newUserCount = res;
      });
    this.newOrderCount = this.$store.dispatch('util/newOrderCount')
      .then((res) => {
        this.newOrderCount = res;
      });
  }
}
</script>

<template>
  <main id="main">
    <h1>Good {{ getTimeOfDay }}, {{ currentUser?.name }}!</h1>
    <div class="info-wrapper">
      <div class="anal"> <!-- analytic -->
        <div class="info-card">
          <p><span>{{ newProductCountTweened.toFixed(0) }}</span> product{{ newProductCount > 1 ? "s are" : " is" }} added
            today.</p>
        </div>
        <div class="info-card">
          <p><span>{{ newUserCountTweened.toFixed(0) }}</span> user{{ newUserCount > 1 ? "s are" : " is" }} registed
            today.</p>
        </div>
        <div class="info-card">
          <p><span>{{ newOrderCountTweened.toFixed(0) }}</span> bill{{ newOrderCount > 1 ? "s are" : " is" }} paid today.
          </p>
        </div>
      </div>
      <div class="shor"> <!-- shortcuts -->
        <h2>Start</h2>
        <div class="links">
          <router-link :to="{ name: 'm.product' }">
            <span>Products</span>
          </router-link>
          <!-- <router-link :to="{ name: 'm.user' }">
            <span>Users</span>
          </router-link> -->
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 3rem 0px 0px 2rem;
}

.info-wrapper {
  gap: 8px;
  display: flex;
  flex-wrap: wrap;
}

.anal,
.info-wrapper>*:nth-child(1) {
  flex: 2;
}

.anal>.info-card :not(span) {
  font-size: 2em;
}

.anal>.info-card span {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
  font-size: 2em;
}

.shor,
.info-wrapper>*:nth-child(2) {
  padding: 16px;
  flex: 1;
  background-color: #fcfcfc;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
}

.links {
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.links>a {
  background-color: transparent;
  display: flex;
  padding-block: 1rem;
  padding-right: 2px;
  padding-left: 2px;
  transition-property: padding-left, background-color;
  transition-duration: .3s;
  transition-timing-function: ease-out;
  overflow: hidden;
}

.links>a:hover {
  padding-left: 15px;
  background-color: rgba(0, 0, 0, 0.1);
}

.links>a::before {
  content: ">";
  text-align: right;
  margin: 0;
  margin-right: 3px;
  overflow: hidden;
  width: 0px;
  transition: width .5s ease-out !important;
}

.links>a:hover::before {
  width: 10px;
}

.tags-wrapper {
  height: 36px;
  display: flex;
  gap: 12px;
  overflow-X: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0;
  }

  &>* {
    display: flex;
    min-width: fit-content;
    align-items: center;
    justify-content: center;
    padding-inline: 16px;
    padding-block: 4px;
    background-color: #fff;
    border-radius: 25px;
  }
}
</style>
