import mongoose from "../providers/database.js";
import ProductImageModel from "./productImage.model.js";

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
    quantity: {
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

// ProductSchema.pre('remove', async function (next) {
//   await ProductImageModel.find({
//     productId: this.id
//   })
//     .then(images => {
//       Promise.all(images.forEach(image => {
//         unlinkSync(image.path);
//         image.remove();
//       }))
//         .then(next());
//     });
// });

const ProductModel = mongoose.model("Products", ProductSchema);
export default ProductModel;
