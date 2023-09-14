<script>
import { Suspense, Transition } from "vue";
import { routes as routerRoutes } from "./router/index.js";
import { RouterLink, RouterView } from "vue-router";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser, faArrowRightFromBracket, faHouse, faCloudArrowUp, faGear } from '@fortawesome/free-solid-svg-icons';
import { useToast } from "vue-toastification";

const toast = useToast();
library.add(faBars, faUser, faArrowRightFromBracket, faHouse, faCloudArrowUp, faGear);

export default {
  components: {
    NavNavbar: 'nav-navbar',
    NavSidebar: 'nav-sidebar',
    Suspense,
    Transition
  },
  data() {
    return {
      routerRoutes,
      avtSrc: "http://localhost:3001/account.png",
    }
  },
  watch: {
    '$route'(to, from) {
      const title = this.routerRoutes.filter(r => (r.name === to.name))[0].title;
      document.title = title;
    }
  },
  mounted: function () {
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
    this.updateAvatar();
  },
  computed: {
    cartQuantity() {
      return this.$store.getters["cart/cartQuantity"]
    },
    currentUserC() {
      return this.$store.state.userC.user;
    },
    currentUserE() {
      return this.$store.state.userE.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }

      return false;
    }
  },
  methods: {
    isValidImage(url) {
      return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = url;
      });
    },
    logOutC() {
      this.$store.dispatch('userC/logout');
      this.$store.state.userC.user = undefined;
      this.$router.push('/c');
    },
    logOutE() {
      this.$store.dispatch('userE/logout');
      this.$store.state.userE.user = undefined;
      this.$router.push('/m');
    },
    updateAvatar() {
      this.avtSrc = "http://localhost:3001/account.png";
      const newAvtSrc = JSON.parse(localStorage.getItem('user'))?.avatar || this.avtSrc;
      this.isValidImage(newAvtSrc).then(isValid => {
        if (isValid) {
          // The image is valid
          this.avtSrc = newAvtSrc + "?timestamp=" + Date.now();
        }
      });
    },
    createNotification(message, type = "default") {
      toast(message, type)
    }
  },
  created() {
    this.$store.dispatch("cart/getCartItems");
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
            style="color:rgb(0, 141, 96); font-size: larger; font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">QUANLYBANHANG</span>
        </div>
        <div>
          <input type="text" name="search" id="search" placeholder="Search ...">
        </div>
        <nav-navbar>
          <div class="user-menu" v-if="!currentUserC && $route.fullPath[1] === 'c'">
            <div class="menu-label">
              <img class="user-avatar" src="http://127.0.0.1:3001/account.png" alt="">
              <a href="#" class="user-text">Signin/Signup</a>
            </div>
            <ul>
              <li>
                <RouterLink to="/c/signin">Signin</RouterLink>
              </li>
              <li>
                <RouterLink to="/c/signup">Signup</RouterLink>
              </li>
            </ul>
          </div>
          <div class="user-menu" v-if="!currentUserE && $route.fullPath[1] === 'm'">
            <div class="menu-label">
              <img class="user-avatar" src="http://127.0.0.1:3001/account.png" alt="">
              <a href="#" class="user-text">Signin/Signup</a>
            </div>
            <ul>
              <li>
                <RouterLink to="/m/signin">Signin</RouterLink>
              </li>
              <li>
                <RouterLink to="/m/signup">Signup</RouterLink>
              </li>
            </ul>
          </div>
          <div class="user-menu" v-if="currentUserE && $route.fullPath[1] === 'm'">
            <div class="menu-label">
              <img ref="useravatar" class="user-avatar" :src="avtSrc" alt="">
              <a href="#" class="user-text">{{ currentUserE.name }}</a>
            </div>
            <ul>
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
          <div class="user-menu" v-if="currentUserC && $route.fullPath[1] === 'c'">
            <div class="menu-label">
              <img ref="useravatar" class="user-avatar" :src="avtSrc" alt="">
              <a href="#" class="user-text">{{ currentUserC.name }}</a>
            </div>
            <ul>
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
          <div class="user-menu" v-if="$route.fullPath[1] === 'c'">
            <div class="menu-label">
              <img class="user-avatar" src="http://127.0.0.1:3001/cart.png" alt="">
              <a href="#" class="user-text">Cart: {{ cartQuantity }}</a>
            </div>
            <ul>
              <li>
                <RouterLink to="/c/signin">Signin</RouterLink>
              </li>
              <li>
                <RouterLink to="/c/signup">Signup</RouterLink>
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
            <RouterView @updateAvatar="updateAvatar" @notification="createNotification" v-slot="{ Component }">
              <Transition name="fade" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </Suspense>
        </div>
      </div>
      <div id="footer">
        <div>
          <RouterLink to="/about">About</RouterLink>
        </div>
        <div>
          Policy
        </div>
        <div>
          @nguyenanvi122333
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url(@/assets/colortheme.css);

:root {
  --icon-width: 30px;
  --header-height: 45px;
  --footer-height: 50px;
  --sidebar-icon-width: 48px;
  --sidebar-width: 200px;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease-out;
}

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
  background-image: url(@public/background.jpg);
  border-radius: 8px;
}

#header,
#body,
#footer {
  box-sizing: border-box;
  /* box-shadow: inset 0 0 3px var(--color-background-5); */
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

  background-color: var(--color-background-1);

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
    justify-content: end;
    display: block;

    &>* {
      float: right;
      background-color: var(--color-background-2);
      border-radius: 8px;
      -webkit-border-radius: 8px;
      -moz-border-radius: 8px;
      -ms-border-radius: 8px;
      -o-border-radius: 8px;
      border: 1px solid var(--color-text-1);
    }

    &>.user-menu {
      width: 140px;
      height: 32px;
      display: block;
      overflow: hidden;
      border-radius: 16px;

      &>* {
        z-index: 10;
        width: inherit;
        height: inherit;
      }

      &>.menu-label {
        height: inherit;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;

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
        height: auto;
        padding: 0;
        margin: 0;
        display: none;
        list-style: none;
        border-radius: 8px;
        border: 1px solid black;
        position: absolute;
        background-color: #080;
        transition-property: transform;
        transition-duration: .2s;
        transition-timing-function: ease-in-out;

        &>li {
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: #ffffff;
          color: #000;

          &:first-child {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }

          &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }
      }

      &:hover {
        &>ul {
          display: flex;
          flex-direction: column;

          &>li:hover {
            color: #fff;
            background-color: #000000;
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
  background-color: #00000077;

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
  background-color: var(--color-background-1);
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
    box-shadow: 0 0 5px var(--color-background-5);
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
  height: 100%;
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
</style>