import OrderModel from "../../models/order.model.js";
import OrderDetailModel from "../../models/orderdetail.model.js";
import ProductModel from "../../models/product.model.js";
export const placeOrder = async function (req, res) {
  let data = req.body.data;
  data.customerId = req.user._id;
  try {
    await new OrderModel(data).save()
      .then(async function (order) {
        const orderId = order._id;
        data.list.forEach(async orderDetail => {
          orderDetail.orderId = orderId;
          await new OrderDetailModel(orderDetail).save()
          let product = await ProductModel.findById(orderDetail.productId);
          product.quantity -= orderDetail.quantity;
          await product.save();
        });
        return res.status(200).json({
          message: "Product added",
          data: order
        })
      })
      .catch(err => res.status(500).json({ message: err.message }));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}