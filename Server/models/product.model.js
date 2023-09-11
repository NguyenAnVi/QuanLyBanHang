import mongoose from "../providers/database.js";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String
    },
    price: {
      type: mongoose.Schema.Types.Number,
      default: 0
    },
    quantity:{
      type: mongoose.Schema.Types.Number,
      default: 0
    },
    note: {
      type: String
    },
    deletedAt: {
      type: mongoose.Schema.Types.Date,
    },
    // createdAt: { 
    //   type: Date, 
    //   expires: 60*60*24*1, 
    //   default: Date.now
    // } // expires means it will disappear after 24hours
  },
  { timestamps: true, collection: "Products" }
);

const ProductModel = mongoose.model("Products", ProductSchema);
export default ProductModel;
