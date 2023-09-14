const initialState = {
  message: "",
  type: "" // "success", "error", "default", "info" and "warning"
};
export const notification = {
  namespaced: true,
  state: initialState,
  getters: {
    hasNotification(context) {
      return context.message !== "";
    },
  },
  actions: {
    createNotification(context, payload) {
      Object.assign(context.state, payload);
      return true;
    },
    getNotification(context) {
      return context.state;
    },
    clearNotification() {
      Object.assign(context.state, initialState);
      return true;
    }
  },
};