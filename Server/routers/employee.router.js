import {
  signin,
  updateProfile,
  updateAvatar,
  requestCreateEmployee,
  signup
} from "../controllers/auth/employee.controller.js"
import {
  getAllProducts,
  get as getProduct,
  add as addProduct,
  edit as editProduct,
  remove as deleteProduct,
  getImages,
  deleteImage
} from "../controllers/manage/product.controller.js"
import {
  newProductCount,
  newUserCount,
  newOrderCount
} from "../controllers/manage/util.controller.js"
import { loginRequired } from "../middlewares/loginRequired.middleware.js"
import { isEmployee } from "../middlewares/isEmployee.middleware.js"
import express from "express"

const router = express.Router()

export default () => {
  router.post("/signin", signin);
  router.post("/signup", signup);
  router.post("/createnewemployee", loginRequired, isEmployee, requestCreateEmployee);
  router.post("/updateprofile", loginRequired, isEmployee, updateProfile);
  router.get("/product/get/:id", loginRequired, isEmployee, getProduct);
  router.get("/product/getimages/:id", loginRequired, isEmployee, getImages);
  router.delete("/product/deleteimage/:id", loginRequired, isEmployee, deleteImage);
  router.delete("/product/delete/:id", loginRequired, isEmployee, deleteProduct);
  router.get("/product/getall", loginRequired, isEmployee, getAllProducts);
  router.post("/product/add", loginRequired, isEmployee, addProduct);
  router.put("/product/edit", loginRequired, isEmployee, editProduct);

  router.get("/newproductcount", loginRequired, isEmployee, newProductCount);
  router.get("/newusercount", loginRequired, isEmployee, newUserCount);
  router.get("/newordercount", loginRequired, isEmployee, newOrderCount);

  // router.post("/updateavatar", loginRequired, isEmployee, updateAvatar);
  return router
}