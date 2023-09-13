import mongoose from "../providers/database.js"

const ProductImageSchema = new mongoose.Schema(
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

const ProductImageModel = mongoose.model("ProductImages", ProductImageSchema)
export default ProductImageModel
