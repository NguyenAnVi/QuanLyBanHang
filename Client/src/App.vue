<script>
import { Suspense, Transition } from "vue";
import { routes as routerRoutes } from "./router/index.js";
import { RouterLink, RouterView } from "vue-router";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser, faArrowRightFromBracket, faHouse, faCloudArrowUp, faGear } from '@fortawesome/free-solid-svg-icons';
import { useToast } from "vue-toastification";
import SearchBar from "@/components/SearchBar.vue";
import Cart from "./components/Cart.vue";

const toast = useToast();
library.add(faBars, faUser, faArrowRightFromBracket, faHouse, faCloudArrowUp, faGear);

export default {
  components: {
    NavNavbar: 'nav-navbar',
    NavSidebar: 'nav-sidebar',
    Suspense,
    Transition,
    SearchBar,
    Cart
  },
  data() {
    return {
      routerRoutes,
      userCAvatar: "",
      userEAvatar: "",
      cartTimestamp: Date.now(),
      origin: location.origin
    }
  },
  watch: {
    '$route'(to, from) {
      const title = this.routerRoutes.filter(r => (r.name === to.name))[0].title;
      document.title = title;
    }
  },
  mounted() {
    const sidebar = document.getElementById("sidebar");
    const openSideBar = (sb) => {
      sb.classList.add("opened");
    };
    const closeSideBar = (sb) => {
      sb.classList.remove("opened");
    };
    const toggleSideBar = (sb) => {
      if (sb.classList.contains("opened"))
        closeSideBar(sb);
      else
        openSideBar(sb);
    };
    const logo = document.getElementById("sidebar-toggler");
    logo.addEventListener('click', () => {
      toggleSideBar(sidebar);
    });
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
  methods: {
    async logOutC() {
      await this.$store.dispatch('userC/logout');
      this.$store.state.userC.user = undefined;
      this.$router.go('/c');
    },
    logOutE() {
      this.$store.dispatch('userE/logout');
      this.$store.state.userE.user = undefined;
      this.$router.go('/m');
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
  }
}
</script>

<template>
  <div>
    <div id="appWrapper">
      <div id="header">
        <div>
          <font-awesome-icon id="sidebar-toggler" :icon="['fas', 'bars']" size="lg" />
          <img id="logo" alt="logo" class="logo" src="@/assets/logo.svg" />
          <span
            style="color:var(--primary-color); font-size: larger; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">QUANLYBANHANG</span>
        </div>
        <div>
          <SearchBar ref="search"></SearchBar>
        </div>
        <nav-navbar>
          <Cart ref="cart" :t="cartTimestamp" v-if="$route.fullPath[1] === 'c'" />
          <div class="user-menu" v-if="$route.fullPath[1] === 'c'">
            <div class="menu-label">
              <img class="user-avatar" :src="userCAvatar" alt="">
              <a href="#" class="user-text" v-if="!currentUserC">Signin/Signup</a>
              <a href="#" class="user-text" v-else>{{ currentUserC.name }}</a>
            </div>
            <ul class="menu-select" v-if="!currentUserC">
              <li>
                <RouterLink to="/c/signin">Signin</RouterLink>
              </li>
              <li>
                <RouterLink to="/c/signup">Signup</RouterLink>
              </li>
            </ul>
            <ul class="menu-select" v-else>
              <li>
                <RouterLink to="/settings">
                  <div>Settings</div>
                </RouterLink>
              </li>
              <li @click="logOutC">
                Sign Out
              </li>
            </ul>
          </div>
          <div class="user-menu" v-if="$route.fullPath[1] === 'm'">
            <div class="menu-label">
              <img class="user-avatar" :src="userEAvatar" alt="">
              <a href="#" class="user-text" v-if="!currentUserE">Signin/Signup</a>
              <a href="#" class="user-text" v-else>{{ currentUserE.name }}</a>
            </div>
            <ul class="menu-select" v-if="!currentUserE">
              <li>
                <RouterLink to="/m/signin">Signin</RouterLink>
              </li>
              <li>
                <RouterLink to="/m/signup">Signup</RouterLink>
              </li>
            </ul>
            <ul class="menu-select" v-else>
              <li>
                <RouterLink to="/settings">
                  <div>Settings</div>
                </RouterLink>
              </li>
              <li @click="logOutE">
                Sign Out
              </li>
            </ul>
          </div>
        </nav-navbar>
      </div>
      <div id="body">
        <div id="sidebar" class="" ref="sidebar">
          <nav-sidebar>
            <!-- {{ routerRoutes }} -->
            <RouterLink v-for="route in routerRoutes" v-show="route.showInSideBar === $route.fullPath[1]"
              :to="route.path">
              <font-awesome-icon v-if="route.icon" :icon="route.icon" />
              <div>{{ route.title }}</div>
            </RouterLink>
          </nav-sidebar>
        </div>
        <div id="content">
          <Suspense>
            <RouterView @updateAuthentication="updateAuthentication" @notification="createNotification" @search="search"
              @updateCart="updateCart" v-slot="{ Component }">
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
  background-image: url(@/../public/background.jpg);
  border-radius: 8px;
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
        /* display: flex;
        flex-direction: column; */
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
  display: flex;
  justify-items: stretch;
  overflow: hidden;

  background-color: transparent;
  min-height: calc(100vh - var(--header-height) - var(--footer-height) - 48px);
}

#sidebar {
  box-sizing: border-box;
  overflow: hidden;
  min-width: var(--sidebar-icon-width);
  width: var(--sidebar-icon-width);
  margin-right: 8px;
  background-color: #0000003f;

  backdrop-filter: blur(10px);

  transition-property: width, min-width;
  transition-duration: .5s;
  transition-timing-function: ease-in-out;
}

#sidebar.opened,
#sidebar:hover {
  min-width: var(--sidebar-width);
  width: var(--sidebar-width);
}

#content {
  flex-shrink: 0;
  background-color: #ffffff77;
  backdrop-filter: blur(10px);
  width: calc(100% - var(--sidebar-icon-width) - 8px);

  &>*:first-child {
    min-height: 100%;
    box-sizing: border-box;
  }
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
  margin: 0;
  max-height: calc(var(--header-height) - 8px);
}

nav-sidebar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: var(--sidebar-width);
  font-size: 16px;
  border-radius: 8px 0 0 8px;
  -webkit-border-radius: 8px 0 0 8px;
  -moz-border-radius: 8px 0 0 8px;
  -ms-border-radius: 8px 0 0 8px;
  -o-border-radius: 8px 0 0 8px;
}

nav-sidebar>a {
  border-radius: 8px 0 0 8px;
  background-color: #ffffff88;
  display: flexbox;
  width: var(--sidebar-width);
  height: var(--sidebar-icon-width);
  align-items: center;
  transition-property: background-color, height;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;

  &:hover {
    z-index: 2;
  }

  &:focus {
    z-index: 1;
  }

  &:hover,
  &:focus,
  &.router-link-exact-active {
    height: calc(var(--sidebar-icon-width) + 16px);
    box-shadow: 0 0 5px #414141;
    background-color: #fff;
  }
}

nav-sidebar>a.router-link-exact-active {
  border-radius: 8px 0 0 8px;
  -webkit-border-radius: 8px 0 0 8px;
  -moz-border-radius: 8px 0 0 8px;
  -ms-border-radius: 8px 0 0 8px;
  -o-border-radius: 8px 0 0 8px;

  &:hover {
    cursor: default;
  }
}

nav-sidebar>a {
  display: flex;
}

nav-sidebar>a>div {
  display: inline-block;
}

nav-sidebar>a>svg {
  width: var(--sidebar-icon-width);
  max-height: 100%;
  align-items: center;
  box-sizing: border-box;
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