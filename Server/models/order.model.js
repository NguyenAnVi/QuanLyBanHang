import {AvailableOrderStatus} from '../config/shop.config.js'
import mongoose from "../providers/database.js";

const OrderSchema = new mongoose.Schema(
  {
    orderId:{
      type: String,
      unique: true, 
      default: "DH"+Date.now(),
      required: true
    },
    customerId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    employeeId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    ordered_at: {
      type: Date,
    },
    delivered_at: {
      type: Date
    },
    status: {
      type: String,
      validate: {
        validator(v) {
          return AvailableOrderStatus.includes(v);
        },
        message: (props) =>
          `${props.value} is not a valid OrderStatus, Check Server/config/shop!`,
      },
    },
  },
  { timestamps: true, collection: "Orders" }
);

const OrderModel = mongoose.model("Orders", OrderSchema);
export default OrderModel;
