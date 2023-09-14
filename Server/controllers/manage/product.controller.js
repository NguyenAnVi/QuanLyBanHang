import { unlinkSync, writeFile } from "fs";
import Locals from "../../providers/local.js";
import ProductModel from "../../models/product.model.js";
import ProductImageModel from "../../models/productImage.model.js";

const saveImages = async (newImages, product, oldImages = null) => {
  const hostname = Locals.config().hostname;
  const port = Locals.config().port;
  const filepath = './public/storage/products/p_' + product.id + "/";
  const publicpath = hostname + ':' + port + '/storage/products/p_' + product.id + "/";
  Locals.config().createFolderIfNotExist(filepath);

  for (let i = 0; i < newImages.length; i++) {
    const image = newImages[i];
    const imageBase64Data = image.split(',')[1];

    const filename = `image_${i}_${Date.now()}.png`;
    const fileUrl = filepath + filename;
    const publicUrl = publicpath + filename;
    writeFile(fileUrl, imageBase64Data, {
      encoding: 'base64',
      flag: 'w+'
    }, function (werr) {
      if (werr) {
        throw (werr);
        return res.status(500).json({
          message: werr.message,
        });
      }
    });

    await new ProductImageModel({
      name: product.name,
      path: fileUrl,
      publicPath: publicUrl,
      productId: product.id
    }).save()
      .then(pi => {
        return 1;
      })
      .catch(err => {
        throw (err)
        return 0;
        // return res.status(500).send({message:'error when save images'})
      });
    ;
  }
}

export const deleteImage = async function (req, res) {
  const id = req.params.id;
  await ProductImageModel.findByIdAndDelete(id)
    .then(async pi => {
      const filePath = pi.path;
      unlinkSync(filePath);
      return res.status(200).json({
        message: "Image deleted",
      });
    })
    .catch(err => res.status(500).send({ message: err.message }));
}

export const add = async function (req, res) {
  const data = req.body.data;
  try {
    await new ProductModel(data).save()
      .then(async (p) => {
        if (data.images) {
          const images = JSON.parse(data.images);
          await saveImages(images, p);
        }
        return res.status(200).json({
          message: "Product added",
          data: p
        })
      })
      .catch(err => res.status(500).json({ message: err.message }));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const edit = async function (req, res) {
  const id = req.body.id;
  const data = req.body.data;
  try {
    await ProductModel.findByIdAndUpdate(id, data)
      .then(async (p) => {
        if (data.images) {
          const images = JSON.parse(data.images);
          await saveImages(images, p);
        }
        return res.status(200).json({
          message: "Product updated",
          data: p
        })
      })
      .catch(err => res.status(500).json({ message: err.message }));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const remove = async function (req, res) {
  const id = req.params.id;
  try {
    await ProductModel.findByIdAndUpdate(id, {
      deletedAt: Date.now()
    })
      .then(p => {
        if (p.deletedAt != undefined) {
          p.remove();
        }
        return res.status(200).json({
          message: "Product removed",
        })
      })
      .catch(err => res.status(500).json({ message: err.message }));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const update = async function (req, res, next) {
  const id = req.params.id;
  const data = req.body.data;
  try {
    await ProductModel.findByIdAndUpdate(id, data)
      .then(p => res.status(200).json({
        message: "Product updated",
      }))
      .catch(err => res.status(500).json({ message: err.message }));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const uploadProductImage = async function (req, res, next) {
  const hostname = Locals.config().hostname;
  const port = Locals.config().port;

  const folderpath = './public/storage/products/' + productId + '/';
  const publicpath = hostname + ':' + port + '/storage/products/' + productId + '/';
  Locals.config().createFolderIfNotExist(folderpath);

  const productId = req.body.productId;
  const images = req.body.images.filter((v, i) => {
    return {
      name: `image_${i}.${v.type}`,
      path: `${folderpath}image_${i}.${v.type}`,
      publicPath: `${publicpath}image_${i}.${v.type}`,
      data: v.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpg;base64,/, "")
    }
  });
  images.forEach(async (image) => {
    writeFile(image.path, image.data, {
      encoding: 'base64',
      flag: 'w'
    }, function (werr) {
      if (werr) {
        throw (werr);
        return res.status(500).json({
          message: werr.message,
        });
      }
    });
    await new ProductImageModel({
      name: image.name,
      path: image.path,
      publicPath: image.publicPath,
      productId
    }).save();
  });
  return res.status(200).json({
    message: "Images uploaded",
  });
}
export const get = async function (req, res) {
  const id = req.params.id;
  try {
    const product = await ProductModel.findById(id);
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const getImages = async function (req, res) {
  const id = req.params.id;
  try {
    const images = await ProductImageModel.find({
      productId: id
    });
    return res.status(200).json({
      images,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const getAllProducts = async function (req, res) {
  const quantity = req.query.quantity;
  // const filters = req.query.filters;
  // console.log(req.query);

  try {
    const products = await ProductModel.find({
      deletedAt: { $exists: false }
    }).limit(quantity);
    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}