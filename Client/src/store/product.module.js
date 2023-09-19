import apiService from '../services/api.service';
const state = {
  productItems: []
}
const actions = {
  getRecommendedProducts({ }) {
    return new Promise((res, rej) => {
      apiService.getRecommendedProducts()
        .then((response) => {
          res(response.data)
        })
        .catch(err => rej(err));
    })
  },
  getProduct({ }, id) {
    return new Promise((res, rej) => {
      apiService.getProduct(id)
        .then((response) => {
          res(response.data)
        })
        .catch(err => rej(err));
    })
  },
  getProductItems({ commit }) {
    apiService.getAllProducts().then((response) => {
      commit('UPDATE_PRODUCT_ITEMS', response.data.data)
    });
  },
  add({ commit }, product) {
    return new Promise((resolve, reject) => {
      apiService.addProduct(product).then((response) => {
        commit('UPDATE_PRODUCT_ITEMS', response.data)
        resolve(response.data)
      }).catch((err) => reject(err));
    })
  },
  edit({ commit }, payload) {
    return new Promise((resolve, reject) => {
      apiService.editProduct(payload.id, payload.product).then((response) => {
        commit('UPDATE_PRODUCT_ITEMS', response.data)
        resolve(response.data)
      }).catch((err) => reject(err));
    })
  },
  delete({ commit }, id) {
    return new Promise((resolve, reject) => {
      apiService.deleteProduct(id).then((response) => {
        commit('UPDATE_PRODUCT_ITEMS', response.data)
        resolve(response.data)
      }).catch((err) => reject(err));
    })
  },
  getEdit({ }, payload) {
    return new Promise((resolve, reject) => {
      apiService.getProductEdit(payload.id).then((response) => {
        if (response.status)
          resolve(response.data.product)
      }).catch((errResponse) => reject(errResponse.error));
    })
  },
  getEditImages({ }, payload) {
    return new Promise((resolve, reject) => {
      apiService.getProductEditImages(payload.id).then((response) => {
        if (response.status)
          resolve(response.data.images)
      }).catch((errResponse) => reject(errResponse.error));
    })
  },
  deleteProductImage({ }, payload) {
    return new Promise((resolve, reject) => {
      apiService.deleteProductImage(payload.id).then((response) => {
        if (response.status)
          resolve(response.data)
      }).catch((errResponse) => reject(errResponse.error));
    })
  }
}
const getters = {
  productItems: state => state.productItems,
  productItemById: (state) => (id) => {
    return state.productItems.find(productItem => productItem.id === id)
  }
}
const mutations = {
  UPDATE_PRODUCT_ITEMS(state, payload) {
    state.productItems = payload;
  }
}
export const product = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}