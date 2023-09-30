<script>
export default {
  name: "Sidebar",
  components: {
    NavSidebar: 'nav-sidebar'
  },
  data() {
    let routerRoutes = this.$router.options.routes;
    let routes = [];
    routerRoutes.forEach((r, i) => {
      if (r.children) {
        r.children.forEach((rc, ic) => {
          let nrc = rc;
          nrc.path = (r.path + "/" + rc.path).replace('//', '/');
          routes.push(nrc);
        })
      }
    })
    return {
      routes,
    }
  },
  methods: {
    expand() {
      this.$refs.sidebarContainer.classList.add("opened");
      this.$emit('opened')
    },
    shrink() {
      this.$refs.sidebarContainer.classList.remove("opened");
      this.$emit('closed')
    },
    toggle() {
      this.$nextTick(() => {
        if (this.$refs.sidebarContainer.classList.contains("opened"))
          this.shrink()
        else
          this.expand()
        return;
      })
    }
  },
}
</script>
<template>
  <div id="sidebar" ref="sidebarContainer">
    <nav-sidebar>
      <router-link v-for="route in routes" v-show="route.meta?.showInSidebar === $route.meta.userType" :to="route.path">
        <font-awesome-icon v-if="route.meta?.sidebarIcon" :icon="route.meta?.sidebarIcon" />
        <div>{{ route.meta?.title }}</div>
      </router-link>
    </nav-sidebar>
  </div>
</template>
<style scoped>
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
</style>