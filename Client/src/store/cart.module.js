// import axios from 'axios';
const state = {
  cartItems: []
}

export const cart = {
  namespaced: true,
  state,
  actions: {
    getCartItems ({ commit }) {
      commit('UPDATE_CART_ITEMS', JSON.parse(localStorage.getItem('cartItems')))
      // axios.get('/cart').then((response) => {
      //   commit('UPDATE_CART_ITEMS', response.data)
      // });
    },
    addCartItem ({ commit }, cartItem) {
      commit('UPDATE_CART_ITEMS', JSON.parse(localStorage.getItem('cartItems')).push(cartItem))
      // axios.post('/cart', cartItem).then((response) => {
      //   commit('UPDATE_CART_ITEMS', response.data)
      // });
    },
    removeCartItem ({ commit }, cartItem) {
      commit('UPDATE_CART_ITEMS', JSON.parse(localStorage.getItem('cartItems')).filter(c => !(c.productId == cartItem.productId)))
      // axios.delete('/cart/delete', cartItem).then((response) => {
      //   commit('UPDATE_CART_ITEMS', response.data)
      // });
    },
    removeAllCartItems ({ commit }) {
      localStorage.removeItem('cartItems');
      commit('UPDATE_CART_ITEMS', JSON.parse(localStorage.getItem('cartItems')))
      // axios.delete('/cart/delete/all').then((response) => {
      //   commit('UPDATE_CART_ITEMS', response.data)
      // });
    }
  },
  mutations : {
    UPDATE_CART_ITEMS (state, payload) {
      state.cartItems = payload;
    }
  },
  getters : {
    cartItems: state => state.cartItems,
    cartTotal: state => {
      return state.cartItems.reduce((acc, cartItem) => {
        return (cartItem.quantity * cartItem.price) + acc;
      }, 0);
    },
    cartQuantity: state => {
      return (state.cartItems?.reduce((acc, cartItem) => {
        return cartItem.quantity + acc;
      }, 0) || 0);
    }
  }
};