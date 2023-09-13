import { createStore } from "vuex";
import { cart } from "./cart.module.js";
import { userE } from "./userE.module.js";
import { userC } from "./userC.module.js";
import { product } from "./product.module.js";
import { notification } from "./notification.module.js";

const store = createStore({
  modules: {
    cart,
    userE,
    userC,
    product,
    notification
  },
});

export default store;