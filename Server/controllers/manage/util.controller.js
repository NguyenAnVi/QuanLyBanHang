import CustomerModel from "../../models/customer.model.js";
import ProductModel from "../../models/product.model.js";
import OrderModel from "../../models/order.model.js";

export const newProductCount = async function (req, res) {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const count = await ProductModel.find({ createdAt: { $gte: startOfToday } }).countDocuments();
  return res.status(200).json({
    // count
    count: 123
  })
}
export const newOrderCount = async function (req, res) {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const count = await OrderModel.find({ createdAt: { $gte: startOfToday } }).countDocuments();
  return res.status(200).json({
    count
  })
}
export const newUserCount = async function (req, res) {
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const count = await CustomerModel.find({ createdAt: { $gte: startOfToday } }).countDocuments();
  return res.status(200).json({
    count
  })
}