import axios from 'axios';
import authHeader, { authHeaderE } from './auth-header';
import config from '../config/index.config';

const API_URL = config.API_URL;
class ApiService {

  async getAllProducts() {
    return await axios
      .get(API_URL + '/m/product/getall',
        {
          headers: { ...authHeaderE() },
        }
      )
      .then(response => {
        return {
          data: response.data
        };
      })
      .catch(err => {
        return {
          data: null
        }
      });
  }
  async addProduct(product) {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(API_URL + '/m/product/add',
          { data: product },
          { headers: { ...authHeaderE() } }
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          reject(error);
        });
    })
  }
  async editProduct(id, product) {
    return new Promise(async (resolve, reject) => {
      await axios
        .put(API_URL + '/m/product/edit',
          {
            id,
            data: product
          },
          { headers: { ...authHeaderE() } }
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          reject(error);
        });
    })
  }
  async deleteProduct(id) {
    return new Promise(async (resolve, reject) => {
      await axios
        .delete(API_URL + '/m/product/delete/' + id,
          { headers: { ...authHeaderE() } }
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          reject(error);
        });
    })
  }

  async getProductEdit(id) {
    return await axios
      .get(API_URL + '/m/product/get/' + id, { headers: { ...authHeaderE() } })
      .then(response => {
        const data = response.data;
        return {
          status: true,
          data
        };
      })
      .catch(error => {
        return {
          status: false,
          error
        }
      });

  }
  async getProductEditImages(id) {
    return await axios
      .get(API_URL + '/m/product/getimages/' + id, { headers: { ...authHeaderE() } })
      .then(response => {
        const data = response.data;
        return {
          status: true,
          data
        };
      })
      .catch(error => {
        return {
          status: false,
          error
        }
      });

  }
  async deleteProductImage(id) {
    return await axios
      .delete(API_URL + '/m/product/deleteimage/' + id, { headers: { ...authHeaderE() } })
      .then(response => {
        const data = response.data;
        return {
          status: true,
          data
        };
      })
      .catch(error => {
        return {
          status: false,
          error
        }
      });

  }
}

export default new ApiService();