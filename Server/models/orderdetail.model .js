import {AvailableOrderStatus} from '../config/shop.config.js'
import mongoose from "../providers/database.js";

const OrderDetailSchema = new mongoose.Schema(
  {
    orderId:{
      type: String,
      required: true
    },
    productId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    orderPrice: {
      type: mongoose.Schema.Types.Number,
      default: 0
    },
    discount: {
      type: mongoose.Schema.Types.Number,
      default: 0
    },
  },
  {
    orderId:{
      type: String,
      required: true
    },
    productId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    quantity: {
      type: mongoose.Schema.Types.Number,
      default: 0
    },
    orderPrice: {
      type: mongoose.Schema.Types.Number,
      default: 0
    },
    discount: {
      type: mongoose.Schema.Types.Number,
      default: 0
    },
  },
  { timestamps: true, collection: "OrderDetails" }
);

const OrderDetailModel = mongoose.model("OrderDetails", OrderDetailSchema);
export default OrderDetailModel;
