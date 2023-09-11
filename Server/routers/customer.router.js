import express from "express"
import { signin, signup, updateProfile, updateAvatar } from "../controllers/auth/customer.controller.js";
import { loginRequired } from "../middlewares/loginRequired.middleware.js";
const router = express.Router()

export default () => {
  router.post("/signin", signin)
  router.post("/signup", signup)
  router.post("/updateprofile", loginRequired, updateProfile)
  // router.post("/updateavatar", loginRequired, updateAvatar);
  return router
};
