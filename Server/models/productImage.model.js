import mongoose from "../providers/database.js"

const ProductImageScheme = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    path: {
      type: String
    },
    publicPath: {
      type: String
    },
    productId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true, collection: "ProductImages" }
)

const ProductImageModel = mongoose.model("ProductImages", ProductImageScheme)
export default ProductImageModel
