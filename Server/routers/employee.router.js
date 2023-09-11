import { signin, updateProfile, updateAvatar, requestCreateEmployee, signup } from "../controllers/auth/employee.controller.js"
import { loginRequired } from "../middlewares/loginRequired.middleware.js"
import { isEmployee } from "../middlewares/isEmployee.middleware.js"
import express from "express"

const router = express.Router()

export default () => {
  router.post("/signin", signin);
  router.post("/signup", signup);
  router.post("/createnewemployee", loginRequired, isEmployee, requestCreateEmployee);
  router.post("/updateprofile", loginRequired, isEmployee, updateProfile);
  // router.post("/updateavatar", loginRequired, isEmployee, updateAvatar);
  return router
}