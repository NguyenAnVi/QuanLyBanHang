import express from "express"
import { signin, signup, updateProfile, saveCart, updateAvatar } from "../controllers/auth/customer.controller.js";
import { getOrders, getOrder, placeOrder, cancelOrder } from "../controllers/customer/order.controller.js";
import {
  get as getProduct,
  getRecommendedProducts
} from "../controllers/customer/product.controller.js"
import { loginRequired } from "../middlewares/loginRequired.middleware.js";
const router = express.Router()

export default () => {
  router.post("/signin", signin)
  router.post("/signup", signup)
  router.get("/product/getdetail/:id", getProduct)
  router.get("/product/getrecommended", getRecommendedProducts)
  router.post("/savecart", loginRequired, saveCart)
  router.post("/updateprofile", loginRequired, updateProfile)
  // router.post("/updateavatar", loginRequired, updateAvatar);
  router.post("/order/placeorder", loginRequired, placeOrder)
  router.get("/order/getorders", loginRequired, getOrders)
  router.get("/order/getorder/:id", loginRequired, getOrder)
  router.post("/order/requestcancel", loginRequired, cancelOrder);

  return router
};
