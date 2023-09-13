import apiService from '../services/api.service';
const state = {
  productItems: [] 
}
const actions = {
  getProductItems ({ commit }) {
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
  }
}
const getters = {
  productItems: state => state.productItems,
  productItemById: (state) => (id) => {
    return state.productItems.find(productItem => productItem.id === id)
  }
}
const mutations = {
  UPDATE_PRODUCT_ITEMS (state, payload) {
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