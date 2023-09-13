import axios from 'axios';
import authHeader, {authHeaderE} from './auth-header';
import config from '../config/index.config';

const API_URL = config.API_URL;
class ApiService {

  async getAllProducts () {
    return await axios
    .get(API_URL + '/m/product/getall',
      {headers:{...authHeaderE()}}
    )
    .then(response => {
      return {
        data:response.data
      };
    })
    .catch(err => {
      return {
        data:null
      }
    });
  }
  async addProduct(product){
    return new Promise(async (resolve, reject) => {
      await axios
        .post(API_URL + '/m/product/add',
          {data: product},
          {headers:{...authHeaderE()}}
        )
        .then(response => {
          const data = response;
          resolve(data) 
        })
        .catch(error=>{
          reject(error);
        });
    })
  }
  // async getVideoProperties (id) {
  //   return await axios
  //   .get(API_URL + 'getvideoproperties/'+id)
  //   .then(response => {
  //     const data = response.data;
  //     return {
  //       status:true,
  //       data
  //     };
  //   })
  //   .catch(error=>{
  //     return {
  //       status:false,
  //       error
  //     }
  //   });
      
  // }

  // async getRecomendedVideos (currentVideo) {
  //   return await axios
  //   .post(
  //     API_URL + 'getrecommendedvideos', // http://localhost:3000/getRecommendedVideos type POST
  //     currentVideo ,                   // req.body
  //     {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     }
  //   )
  //   .then(response => {
  //     const data = response.data;
  //     return {
  //       status:true,
  //       data
  //     };
  //   })
  //   .catch(error=>{
  //     return {
  //       status:false,
  //       error
  //     }
  //   });
      
  // }

  // async getVideos() {
  //   return await axios
  //     .get(API_URL + "getvideos")
  //     .then(response => {
  //       const data = response.data;
  //       return {
  //         status:true,
  //         data
  //       }
  //     })
  //     .catch(err=>{
  //       return {
  //         status:false,
  //         error:err
  //       }
  //     });
  // }

  // async uploadVideo (payload) {
  //   return await axios
  //   .post(
  //     API_URL + 'uploadvideo',
  //     {
  //       data: payload
  //     },
  //     {
  //       headers:{
  //         ...authHeader(),
  //       }
  //     }
  //   )
  //   .then(response => {
  //     const data = response.data;
  //     return {
  //       status:true,
  //       data
  //     };
  //   })
  //   .catch(error=>{
  //     return {
  //       status:false,
  //       error
  //     }
  //   });
  // }

  // async countView (payload) {
  //   return await axios
  //   .get(
  //     API_URL + 'countview/'+payload.id,
  //     {
  //       data: payload
  //     },
  //     {
  //       headers:{
  //         ...authHeader(),
  //       }
  //     }
  //   )
  //   .then(response => {
  //     const data = response.data;
  //     return {
  //       status:true,
  //       data
  //     };
  //   })
  //   .catch(error=>{
  //     return {
  //       status:false,
  //       error
  //     }
  //   });
  // }

  // async getAccountInfo (id) {
  //   return await axios
  //   .get(API_URL + 'account/'+id)
  //   .then(response => {
  //     const data = response.data;
  //     return {
  //       status:true,
  //       data
  //     };
  //   })
  //   .catch(error=>{
  //     return {
  //       status:false,
  //       error
  //     }
  //   });
      
  // }
}

export default new ApiService();