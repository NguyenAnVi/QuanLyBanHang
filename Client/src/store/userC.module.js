import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('userC'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const userC = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.loginC(user).then(
        user => {
          user.userType = "EMPLOYEE";
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    register({ }, user) {
      return AuthService.registerC(user).then(
        response => {
          return Promise.resolve(response.data);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    updateprofile({ commit }, user) {
      return AuthService.updateprofile(user).then(
        response => {
          commit('updateSuccess', response);
          return Promise.resolve(response);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    updateavatar({ commit }, avatar) {
      return AuthService.updateavatar(avatar).then(
        response => {
          commit('updateAvatarSuccess', response);
          return Promise.resolve(response);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    async logout({ commit }) {
      await AuthService.logoutC();
      commit('logout');
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    updateSuccess(state, response) {
      state.status.loggedIn = true;
      state.user = response.user;
    },
    updateAvatarSuccess(state, response) {
      state.status.loggedIn = true;
      state.user.avatar = response.avatar;
    },
  }
};