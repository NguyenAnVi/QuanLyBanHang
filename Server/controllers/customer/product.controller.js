import ProductModel from "../../models/product.model.js";
import ProductImageModel from "../../models/productImage.model.js";

export const getRecommendedProducts = async function (req, res) {
  try {
    const products = await ProductModel.find({
      deletedAt: { $exists: false }
    }).limit(16);

    var images = {};
    for (let i in products) {
      const pid = products[i]._id.toString();
      const productImages = await ProductImageModel.find({
        productId: products[i]._id
      })

      images = {
        ...images,
        [pid]: productImages
      }
    };

    return res.status(200).json({
      products,
      images
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const get = async function (req, res) {
  const id = req.params.id;

  try {
    const product = await ProductModel.findOne({
      _id: id,
    });
    const productImages = await ProductImageModel.find({
      productId: product._id
    })
    return res.status(200).json({
      product,
      images: productImages
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}