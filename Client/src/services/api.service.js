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
  async getRecommendedProducts() {
    return await axios
      .get(API_URL + '/c/product/getrecommended')
      .then(response => {
        return {
          data: response.data
        };
      })
      .catch(err => err);
  }
  async getProduct(id) {
    return await axios
      .get(API_URL + '/c/product/getdetail/' + id)
      .then(response => {
        return {
          data: response.data
        };
      })
      .catch(err => err);
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
  async newProductCount() {
    return await axios
      .get(API_URL + '/m/newproductcount', { headers: { ...authHeaderE() } })
      .then(response => response.data)
  }
  async newOrderCount() {
    return await axios
      .get(API_URL + '/m/newordercount', { headers: { ...authHeaderE() } })
      .then(response => response.data)
  }
  async newUserCount() {
    return await axios
      .get(API_URL + '/m/newusercount', { headers: { ...authHeaderE() } })
      .then(response => response.data)
  }
  async placeOrder(order) {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(API_URL + '/c/order/placeorder',
          { data: order },
          { headers: { ...authHeader() } }
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    })
  }
  async getOrderList(query) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(API_URL + '/c/order/getorders',
          {
            headers: { ...authHeader() },
            params: { filter: query },
          },
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    })
  }
  async getOrderListAdmin(query) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(API_URL + '/c/order/getorders',
          {
            headers: { ...authHeaderE() },
            params: { filter: query },
          },
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    })
  }
  async searchUser(query) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(API_URL + '/m/order/searchuser',
          {
            params: { name: query },
            headers: { ...authHeaderE() },
          },
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    })
  }
  async processOrder(query) {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(API_URL + '/m/order/process',
          { ...query },
          { headers: { ...authHeaderE() } },
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    })
  }
  async cancelOrder(query) {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(API_URL + '/c/order/requestcancel',
          { ...query },
          { headers: { ...authHeader() } },
        )
        .then(response => {
          const data = response;
          resolve(data)
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    })
  }
}

export default new ApiService();