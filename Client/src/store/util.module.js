import apiService from '../services/api.service';
const actions = {
  newProductCount() {
    return new Promise((resolve, reject) => {
      apiService.newProductCount().then((response) => {
        resolve(response.count)
      }).catch((err) => reject(err));
    })
  },
  newUserCount() {
    return new Promise((resolve, reject) => {
      apiService.newUserCount().then((response) => {
        resolve(response.count)
      }).catch((err) => reject(err));
    })
  },
  newOrderCount() {
    return new Promise((resolve, reject) => {
      apiService.newOrderCount().then((response) => {
        resolve(response.count)
      }).catch((err) => reject(err));
    })
  },
}
export const util = {
  namespaced: true,
  state: null,
  actions,
}