import { createStore } from "vuex";
import { cart } from "./cart.module.js";
import { userE } from "./userE.module.js";
import { userC } from "./userC.module.js";
import { util } from "./util.module.js";
import { product } from "./product.module.js";

const store = createStore({
  modules: {
    cart,
    userE,
    userC,
    product,
    util
  },
});

export default store;