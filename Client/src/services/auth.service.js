import axios from 'axios';
import authHeader from './auth-header';
import config from '../config/index.config';

const API_URL = config.API_URL

class AuthService {
  async loginE(user) { // login action for Employees
    return await axios
      .post(API_URL + '/m/signin', user)
      .then(response => {
        if (response.data.accessToken) {
          response.data.userType = "EMPLOYEE";
          localStorage.setItem('userE', JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  async loginC(user) { // login action for Customers
    return await axios
      .post(API_URL + '/c/signin', user)
      .then(response => {
        if (response.data.accessToken) {
          response.data.userType = "CUSTOMER";
          localStorage.setItem('userC', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  registerE(user) {
    return axios.post(API_URL + '/m/signup', user);
  }
  
  logoutE() {
    localStorage.removeItem('userE');
  }
  logoutC() {
    localStorage.removeItem('userC');
  }

  async updateprofile(user) {
    return await axios
      .post(API_URL + 'updateprofile', user, {
        headers:{
          ...authHeader(),
        }
      })
      .then(response => {
        localStorage.setItem(
          'user', 
          JSON.stringify({
            ...JSON.parse(localStorage.getItem('user')),
            ...response.data.user
          })
        );
        return response.data;
      });
  }

  // async updateavatar(avatar) {
  //   return await axios
  //     .post(API_URL + 'updateavatar', avatar, {
  //       headers:{
  //         ...authHeader(),
  //         "Content-Type": "application/json"
  //       }
  //     })
  //     .then(response => {
  //       localStorage.setItem(
  //         'user', 
  //         JSON.stringify({
  //           ...JSON.parse(localStorage.getItem('user')),
  //           avatar: response.data.avatar
  //         })
  //       );
  //       return response.data;
  //     });
  // }
}

export default new AuthService();