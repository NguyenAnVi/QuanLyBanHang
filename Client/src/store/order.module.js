import apiService from '../services/api.service';
const state = null;

export const order = {
  namespaced: true,
  state,
  actions: {
    placeorder({ }, order) {
      return new Promise((resolve, reject) => {
        apiService.placeOrder(order).then((response) => {
          resolve(response.data)
        }).catch((err) => reject(err));
      })
    },
    getorderlist({ }, query) {
      return new Promise((resolve, reject) => {
        apiService.getOrderList(query).then((response) => {
          resolve(response.data)
        }).catch((err) => reject(err));
      })
    },
    getorderlistadmin({ }, query) {
      return new Promise((resolve, reject) => {
        apiService.getOrderListAdmin(query).then((response) => {
          resolve(response.data)
        }).catch((err) => reject(err));
      })
    },
  },
};