import { AvailableOrderStatus, AvailablePaymentMethods } from '../config/shop.config.js'
import mongoose from "../providers/database.js";

const OrderSchema = new mongoose.Schema(
  {
    customerId: { // tai khoan dat hang
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    receiverName: String, // ten nguoi nhan
    receiverPhone: String,
    receiverAddress: String,
    employeeId: mongoose.Schema.Types.ObjectId,
    orderedAt: {
      type: Date,
      default: Date.now()
    },
    deliveredAt: Date,
    status: {
      type: String,
      default: AvailableOrderStatus[0],
      validate: {
        validator(v) {
          return AvailableOrderStatus.includes(v);
        },
        message: (props) =>
          `${props.value} is not a valid OrderStatus, Check Server/config/shop!`,
      },
    },
    message: String,
    paymentMethod: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return AvailablePaymentMethods.includes(v);
        },
        message: (props) =>
          `${props.value} is not a valid PaymentMethod, Check Server/config/shop!`,
      },
    },
    subTotal: Number,
    total: Number,
    shippingFee: Number,
  },
  { timestamps: true, collection: "Orders" }
);

const OrderModel = mongoose.model("Orders", OrderSchema);
export default OrderModel;
