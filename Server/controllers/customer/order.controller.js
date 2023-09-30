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
export const getOrders = async function (req, res) {
  try {
    const uid = req.user._id;
    const filter = req.query.filter;
    var data = [];
    let result = await OrderModel.find({
      customerId: uid,
      ...filter
    })
    if (result) {
      Promise.all(
        result.map(async (item) => {
          const list = await OrderDetailModel.find({
            orderId: item._id
          })
          return {
            ...item._doc,
            list
          }
        })
      ).then((values) => {
        return res.status(200).json({
          data: values
        })
      })
    }

  } catch (err) {
    return res.status(500).json({
      message: err.message,
      data: null
    })
  }
}
export const getOrder = async function (req, res) {
  const uid = req.user._id;
  const orderId = req.params.id;
  let order = await OrderModel.findById(orderId)
  if (order && (uid == order?.customerId)) {
    let result = order;
    result.list = await OrderDetailModel.find({
      orderId
    })
    return res.status(200).json({
      data: result
    })
  } else {
    return res.status(404).json({
      message: "Order not found",
      data: null
    })
  }
}