import HomeView from '@/views/employee/HomeView.vue';
import Signin from '@/views/employee/authentication/Signin.vue';
import Signup from '@/views/employee/authentication/Signup.vue';
import ProductList from '@/views/employee/product/ProductList.vue';
import ProductAdd from '@/views/employee/product/ProductAdd.vue';
export default [
  {
    path: '/m',
    name: 'Employee Home',
    icon: 'house',
    showInSideBar: 'm',
    component: HomeView
  },
  {
    path: '/m/signin',
    name: 'Employee Signin',
    component: Signin
  },
  {
    path: '/m/signup',
    name: 'Employee Signup',
    component: Signup
  },
  {
    path: '/m/product',
    name: 'Product List',
    icon: 'house',
    component: ProductList,
    showInSideBar: 'm'
  },
  {
    path: '/m/product/add',
    name: 'Product Add',
    component: ProductAdd,
  },
]