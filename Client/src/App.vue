<script>
import { Suspense, Transition } from "vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useToast } from "vue-toastification";
import SearchBar from "@/components/SearchBar.vue";
import Cart from "@/components/Cart.vue";
import Sidebar from "@/components/Sidebar.vue";

const toast = useToast();
library.add(faBars, faHouse);

export default {
  components: {
    NavNavbar: 'nav-navbar',
    SearchBar,
    Cart,
    Sidebar
  },
  data() {
    return {
      // routerRoutes: [],
      routerRoutes: [...this.$router.options.routes[0].children, ...this.$router.options.routes[1].children],
      userCAvatar: "",
      userEAvatar: "",
      cartTimestamp: Date.now(),
      origin: location.origin
    }
  },
  methods: {
    async logOutC() {
      if (this.$route.name !== "CustomerHome")
        this.$router.push({ name: 'CustomerHome' });
      else
        this.$router.push({ name: 'CustomerSignin' });
      await this.$store.dispatch('userC/logout');
      this.$store.state.userC.user = undefined;
      this.updateAuthentication();
    },
    async logOutE() {
      if (this.$route.name !== "AdminHome")
        this.$router.push({ name: 'AdminHome' });
      else
        this.$router.push({ name: 'AdminSignin' });
      await this.$store.dispatch('userE/logout');
      this.$store.state.userE.user = undefined;
      this.updateAuthentication();
    },
    updateAuthentication() {
      const defaultAvtSrc = this.origin + "/account.png";
      const newUserCAvatar = JSON.parse(localStorage.getItem('userC'))?.avatar || defaultAvtSrc;
      const newUserEAvatar = JSON.parse(localStorage.getItem('userE'))?.avatar || defaultAvtSrc;
      this.userCAvatar = newUserCAvatar + "?t=" + Date.now();
      this.userEAvatar = newUserEAvatar + "?t=" + Date.now();

      // update Cart:
      this.cartTimestamp = Date.now();

    },
    createNotification(payload) {
      const message = payload.message;
      const type = payload.type || "default"
      if (message !== "")
        toast(message, { type })
    },
    search(value) {
      this.$refs.search.search(value)
    },
    updateCart() {
      this.$refs.cart.update();
    },
    checkAuth(to) {
      document.title = to?.meta.title;
      if (to.meta.requiresAuth) {
        const authType = this.$route.meta.userType;
        if ((authType == 'CUSTOMER' && !this.$store.state.userC.status.loggedIn)) {
          this.$router.push({
            name: 'CustomerSignin',
            query: { redirect: to.fullPath } // Add the current path as a query parameter
          })
        }
        if ((authType == 'ADMIN' && !this.$store.state.userE.status.loggedIn)) {
          this.$router.push({
            name: 'AdminSignin',
            query: { redirect: to.fullPath } // Add the current path as a query parameter
          })
        }
      }
    },
    shrinkContent() {
      this.$refs.content.classList.add('sidebar-opened')
    },
    expandContent() {
      this.$refs.content.classList.remove('sidebar-opened')
    },
  },
  watch: {
    '$route'(to, from) {
      if (to.meta.userType === "ADMIN") {
        this.$refs.wrapper.classList.remove('customer-background');
        this.$refs.wrapper.classList.add('admin-background');
      } else {
        this.$refs.wrapper.classList.add('customer-background');
        this.$refs.wrapper.classList.remove('admin-background');
      }
      this.checkAuth(to);
    }
  },
  mounted() {
    this.checkAuth(this.$route);
    this.updateAuthentication();
  },
  computed: {
    currentUserC() {
      return this.$store.state.userC.user;
    },
    currentUserE() {
      return this.$store.state.userE.user;
    },

  },
}
</script>

<template>
  <div>
    <div id="appWrapper" ref="wrapper">
      <div id="header">
        <div>
          <font-awesome-icon id="sidebar-toggler" @click="$refs.sidebar.toggle()" :icon="['fas', 'bars']" size="lg"
            v-if="$route.meta.userType === 'ADMIN'" />
          <img @click="$router.push({ name: ($route.meta.userType === 'ADMIN') ? ('AdminHome') : ('CustomerHome') })"
            id="logo" alt="logo" class="logo" src="@/assets/logo.svg" />
          <span
            style="color:var(--primary-color); font-size: larger; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">
            QUANLYBANHANG
          </span>
        </div>
        <div>
          <SearchBar ref="search"></SearchBar>
        </div>
        <nav-navbar>
          <div class="user-menu" v-if="($route.meta.userType === 'CUSTOMER') && currentUserC">
            <div class="menu-label">
              <img class="user-avatar" :src="origin + '/bill.jpg'" alt="">
              <router-link class="user-text" :to="{ name: 'CustomerOrdersList' }"
                v-if="$route.meta.userType === 'CUSTOMER'">My
                Orders</router-link>
            </div>
          </div>
          <Cart @notification="createNotification" ref="cart" :t="cartTimestamp"
            v-if="$route.meta.userType === 'CUSTOMER'" />
          <div class="user-menu" v-if="$route.meta.userType === 'CUSTOMER'">
            <div class="menu-label">
              <img class="user-avatar" :src="userCAvatar" alt="">
              <a href="#" class="user-text" v-if="!currentUserC">Signin/Signup</a>
              <a href="#" class="user-text" v-else>{{ currentUserC.name }}</a>
            </div>
            <ul class="menu-select" v-if="!currentUserC">
              <li>
                <router-link :to="{ name: 'CustomerSignin' }">Signin</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'CustomerSignup' }">Signup</router-link>
              </li>
            </ul>
            <ul class="menu-select" v-else>
              <li>
                <router-link to="/settings">
                  <div>Settings</div>
                </router-link>
              </li>
              <li @click="logOutC">
                Sign Out
              </li>
            </ul>
          </div>
          <div class="user-menu" v-if="$route.meta.userType === 'ADMIN'">
            <div class="menu-label">
              <img class="user-avatar" :src="userEAvatar" alt="">
              <a href="#" class="user-text" v-if="!currentUserE">Signin/Signup</a>
              <a href="#" class="user-text" v-else>{{ currentUserE.name }}</a>
            </div>
            <ul class="menu-select" v-if="!currentUserE">
              <li>
                <router-link :to="{ name: 'AdminSignin' }">Signin</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'AdminSignup' }">Signup</router-link>
              </li>
            </ul>
            <ul class="menu-select" v-else>
              <li>
                <router-link to="/settings">
                  <div>Settings</div>
                </router-link>
              </li>
              <li @click="logOutE">
                Sign Out
              </li>
            </ul>
          </div>
        </nav-navbar>
      </div>
      <div id="body">
        <Sidebar ref="sidebar" @opened="shrinkContent" @closed="expandContent" v-if="$route.meta.userType === 'ADMIN'" />
        <div id="content" ref="content">
          <Suspense>
            <RouterView @checkAuth="checkAuth" @updateAuthentication="updateAuthentication"
              @notification="createNotification" @search="search" @updateCart="updateCart" v-slot="{ Component }">
              <Transition name="fade" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </Suspense>
        </div>
      </div>
      <div id="footer">
        <a class="credit" href="https://github.com/NguyenAnVi">
          <div class="container">
            <h1><span>@nguyenanvi</span></h1>
            <div class="blobs_1"></div>
            <div class="blobs_2"></div>
            <div class="blobs_3"></div>
            <div class="blobs_4"></div>
            <div class="blobs_5"></div>
            <div class="blobs_6"></div>
            <div class="blobs_7"></div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
#appWrapper {
  margin: 8px;
  padding: 8px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  /* Set a specified height, or the minimum height for the background image */

  /* Set background image to fixed (don't scroll along with the page) */
  background-attachment: fixed;

  /* Center the background image */
  background-position: center;

  /* Set the background image to no repeat */
  background-repeat: no-repeat;

  /* Scale the background image to be as large as possible */
  background-size: cover;
  border-radius: 8px;
  transition: background-image 3s ease;
}

#appWrapper.customer-background {
  background-image: url(@/../customerbackground.jpg);
}

#appWrapper.admin-background {
  background-image: url(@/../adminbackground.jfif);
}

#header,
#body,
#footer {
  box-sizing: border-box;
  border-radius: 8px;
}

#sidebar-toggler {
  width: var(--sidebar-icon-width);
}

#header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px 8px 8px 0;
  height: var(--header-height);
  line-height: 1.5;

  background-color: #fff;

  &>* {
    display: flex;
    align-items: center;
    flex: 1 0 0px;
    gap: 8px;
    justify-content: center;

    &:first-child {
      justify-content: start;
    }

    &>#search {
      width: 100%;
      padding: 8px 24px;
      background-color: transparent;
      transition: (transform, padding) .5s ease-in-out;
      font-size: 12px;
      line-height: 8px;
      color: #575756;
      background-color: transparent;
      background-image: url(./assets/search.svg);
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

    &>#search::placeholder {
      color: rgba(87, 87, 86, 0.8);
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    &>#search:hover,
    #search:focus {
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
  }

  &>nav-navbar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;

    &>* {
      border-radius: 18px;
    }

    &>.user-menu {
      max-width: 140px;
      height: 32px;
      display: inline-block;
      overflow: visible;

      &>* {
        z-index: 10;
      }

      &>.menu-label {
        width: fit-content !important;
        height: inherit;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 16px;
        background-color: #fff;
        box-shadow: rgba(0, 0, 0, 0.21) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;


        &>.user-avatar {
          border-radius: 50%;
          overflow: hidden;
          width: 25px;
          height: 25px;
          padding: 5px;
        }

        &>.user-text {
          text-align: center;
          overflow: hidden;
          font-size: 12px;
          font-weight: 800;
          width: calc(140px - 40px - 10px);
          padding-right: 5px;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000;
        }
      }


      &>ul {
        min-width: 150px;
        border-radius: 16px;
        height: auto;
        margin: 0;
        padding: 0;
        display: none;
        list-style: none;
        position: absolute;
        right: 16px;
        box-shadow: rgba(0, 0, 0, 0.21) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
        background-color: #ffffff;
        overflow: hidden;

        &>li {
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        & li a {
          width: 100%;
          height: 100%;
          box-sizing: content-box;
          text-align: center;
        }
      }

      &:hover {
        &>ul {
          display: flex;
          flex-direction: column;

          &>li:hover {
            background-color: #bababa;
          }
        }
      }
    }
  }
}

#body {
  display: block;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;

  background-color: transparent;
  min-height: calc(100vh - var(--header-height) - var(--footer-height) - 48px);
}

#body:has(#sidebar) {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

#content {
  flex-grow: 1;
  background-color: #ffffff77;
  backdrop-filter: blur(10px);
  width: auto;
  transition: width 2s ease-out;
  min-height: calc(100vh - var(--header-height) - var(--footer-height) - 48px);
}


#footer {
  height: var(--footer-height);
  border-top: 1px solid var(--color-border);
  padding: 8px;
  padding-top: 16px;
  background-color: #fff;
  display: flex;
  grid-column: 3;
  align-items: end;
}



.logo {
  width: var(--icon-width);
  height: var(--icon-width);
  margin: 0 0 0 1rem;
  max-height: calc(var(--header-height) - 8px);
}



#footer>* {
  flex: 1 1 1px;
  text-align: center;
}

@media only screen and (max-width: 720px) {
  #appWrapper {
    margin: 0;
    border-radius: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    -ms-border-radius: 0;
    -o-border-radius: 0;
  }
}

.credit {
  display: block;
  height: 2em;
  overflow: hidden;
  padding-block: 2px;
  box-sizing: border-box;
}

.container {
  display: block;
  position: relative;
}

.container * {
  display: block;
  position: absolute;
}

.credit>.container {
  width: 120px;
  height: 2.1em;
  line-height: 2.1em;
  box-sizing: content-box;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}

h1 {
  background: #fff;
  width: 100%;
  height: inherit;
  margin: 0;
  padding: 0;
  display: flex;
  font-family: 'Titan One', cursive;
  font-size: 1.1em;
  font-weight: 700;
  flex-flow: row wrap;
  align-content: center;
  justify-content: center
}

h1 span {
  height: inherit;
  width: 100%;
  position: relative;
  overflow: hidden;
}

h1 span:before {
  height: inherit;
  background: linear-gradient(45deg, #fc5c7d, #6a82fb, #fc5c7d);
  width: 100%;
  display: block;
  position: absolute;
  content: "";
  mix-blend-mode: screen;
}

[class*="blobs"] {
  mix-blend-mode: color;
  animation: blobs 15s ease-in-out infinite alternate
}

.blobs_1 {
  background: #ff1493;
  width: 16px;
  height: 16px;
  top: 9px;
  left: 90px
}

.blobs_2 {
  background: #ff4500;
  width: 40px;
  height: 40px;
  top: 15px;
  left: 23px
}

.blobs_3 {
  background: #00ff00;
  width: 20px;
  height: 20px;
  top: -7px;
  left: 20px
}

.blobs_4 {
  background: #ff0000;
  width: 10px;
  height: 10px;
  top: 11px;
  left: 10px
}

.blobs_5 {
  background: #ffff00;
  width: 25px;
  height: 25px;
  top: -4px;
  left: 60px
}

.blobs_6 {
  background: #00ffff;
  width: 20px;
  height: 20px;
  top: 12px;
  left: 55px
}

.blobs_7 {
  background: #ff8c00;
  width: 30px;
  height: 20px;
  top: 10px;
  left: 70px
}

@keyframes blobs {
  0% {
    border-radius: 26% 74% 61% 39% / 54% 67% 33% 46%
  }

  10% {
    border-radius: 74% 26% 47% 53% / 68% 46% 54% 32%
  }

  20% {
    border-radius: 48% 52% 30% 70% / 27% 37% 63% 73%
  }

  30% {
    border-radius: 73% 27% 57% 43% / 28% 67% 33% 72%
  }

  40% {
    border-radius: 63% 37% 56% 44% / 25% 28% 72% 75%
  }

  50% {
    border-radius: 39% 61% 70% 30% / 61% 29% 71% 39%
  }

  60% {
    border-radius: 27% 73% 29% 71% / 73% 51% 49% 27%
  }

  70% {
    border-radius: 39% 61% 65% 35% / 74% 65% 35% 26%
  }

  80% {
    border-radius: 55% 45% 37% 63% / 38% 30% 70% 62%
  }

  90% {
    border-radius: 25% 75% 70% 30% / 39% 50% 50% 61%
  }

  100% {
    border-radius: 66% 34% 33% 67% / 65% 73% 27% 35%
  }
}

@media screen and (max-width:768px) {
  .user-text {
    display: none;
  }
}
</style>