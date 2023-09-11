import { writeFile } from "fs";
import Locals from "../../providers/local.js";
import ProductModel from "../../models/product.model.js";
import ProductImageModel from "../../models/productImage.model.js";

export const add = async function (req, res, next) {
  const data = req.body.data;
  try {
    const newProduct = await new ProductModel(data);
    newProduct.save()
    .then(p=> res.status(200).json({
      message: "Product added",
      product: newProduct
    }))
    .catch(err => res.status(500).json({message: err.message}));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const remove = async function (req, res, next) {
  const id = req.params.id;
  try {
    await ProductModel.findByIdAndUpdate(id,{
      deletedAt: Date.now()
    })
    .then(p=> res.status(200).json({
        message: "Product removed",
      }))
    .catch(err => res.status(500).json({message: err.message}));
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
 .then(p=> res.status(200).json({
  message: "Product updated",
}))
.catch(err => res.status(500).json({message: err.message}));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const uploadProductImage = async function (req, res, next) {
  const hostname = Locals.config().hostname;
  const port = Locals.config().port;

  const folderpath = './public/storage/products/'+productId+'/';
  const publicpath = hostname + ':' + port + '/storage/products/'+productId+'/';
  Locals.config().createFolderIfNotExist(folderpath);

  const productId = req.body.productId;
  const images = req.body.images.filter((v, i)=>{
    return {
      name: `image_${i}.${v.type}`,
      path: `${folderpath}image_${i}.${v.type}`,
      publicPath : `${publicpath}image_${i}.${v.type}`,
      data: v.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpg;base64,/, "")
    }
  });
  images.forEach(async (image) => {
    writeFile(image.path, image.data, {
      encoding:'base64',
      flag:'w'
    }, function(werr) {
      if(werr){
        console.log(werr);
        return res.status(500).json({
          message:werr.message,
        });
      }
    });
    await new ProductImageModel({
      name:image.name,
      path:image.path,
      publicPath:image.publicPath,
      productId
    }).save();
  });
  return res.status(200).json({
    message: "Images uploaded",
  });
}

export const get = async function (req, res, next) {
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
export const getAllProduct = async function (req, res, next){
  const quantity = req.query.quantity || 0;
  try {
    const products = await ProductModel.find(quantity);
    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
// export const uploadVideo = async function (req, res){
//   const data = req.body.data;
//   setTimeout(async () => {
//     const hostname = Locals.config().hostname;
//     const port = Locals.config().port;
//     const timestamp = Date.now();
//     const folderpath = './public/storage/videos/'+timestamp+"/";
//     const publicpath = hostname + ':' + port + '/storage/videos/'+timestamp+"/";

//     Locals.config().createFolderIfNotExist(folderpath);

//     var videoData = data.video.replace(/^data:video\/mp4;base64,/, "");
//     let filename = 'video.mp4';
//     const videopublicPath = publicpath+filename;
//     writeFile(folderpath+filename, videoData, {
//       encoding:'base64',
//       flag:'w+'
//     }, function(werr) {
//       if(werr){
//         console.log(werr);
//         return res.status(500).json({
//           message:werr.message,
//         });
//       }
//     });

//     var imageData = data.thumbnail.replace(/^data:image\/png;base64,/, "");
//     filename = 'thumbnail.png';
//     const thumbnailpublicPath = publicpath+filename;
//     writeFile(folderpath+filename, imageData, {
//       encoding:'base64',
//       flag:'w+'
//     }, function(werr) {
//       if(werr){
//         console.log(werr);
//         return res.status(500).json({
//           message:werr.message,
//         });
//       }
//     });

//     const newvideo = await new VideoModel({
//       owner: req.user._id,
//       title: data.videoTitle,
//       description: data.videoDescription,
//       path: videopublicPath,
//       thumbnail: thumbnailpublicPath,
//       duration:data.info.duration,
//       status: 1
//     }).save().then(
//       videoResult => {
//         return res.status(200).json({
//           message:"Uploaded!"
//         });
//       }
//     )

    

//   }, 1000);
// }