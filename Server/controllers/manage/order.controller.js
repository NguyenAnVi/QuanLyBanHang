import { OrderStatus } from "../../../Client/src/config/index.config.js";
import { AvailableOrderStatus } from "../../config/shop.config.js";
import CustomerModel from "../../models/customer.model.js";
import OrderModel from "../../models/order.model.js";

export const searchUser = async function (req, res) {
  const name = req.query.name;
  try {
    const users = await CustomerModel.find({
      name: {
        $regex: name,
        $options: 'i'
      }
    });
    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const processOrder = async function (req, res) {
  const { orderId, newStatus } = req.body;
  if (AvailableOrderStatus.includes(newStatus)) {
    await OrderModel.findByIdAndUpdate(orderId, {
      status: newStatus
    }).then(r => res.status(200).json({ message: "Updated order status" }))
      .catch(err => res.status(500).json({ message: err.message }))
  } else {
    res.status(500).json({ message: "Invalid Order Status" })
  }
}