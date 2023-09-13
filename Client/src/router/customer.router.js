import HomeView from '@/views/customer/HomeView.vue';
import Signin from '@/views/customer/authentication/Signin.vue';
import Signup from '@/views/customer/authentication/Signup.vue';
export default [
  {
    path: '/c',
    name: 'Customer Home',
    icon: 'house',
    showInSideBar: true,
    component: HomeView
  },
  {
    path: '/c/signin',
    name: 'Customer Signin',
    component: Signin
  },
  {
    path: '/c/signup',
    name: 'Customer Signup',
    component: Signup
  },
]