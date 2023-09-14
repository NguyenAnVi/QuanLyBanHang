import Signin from '@/views/customer/authentication/Signin.vue';
import Signup from '@/views/customer/authentication/Signup.vue';
export default [
  {
    path: '/c',
    name: 'c',
    title: 'Customer Home',
    icon: 'house',
    showInSideBar: 'c',
    component: import('@/views/customer/HomeView.vue')
  },
  {
    path: '/c/signin',
    name: 'c.signin',
    title: 'Customer Signin',
    component: Signin
  },
  {
    path: '/c/signup',
    name: 'c.signup',
    title: 'Customer Signup',
    component: Signup
  },
]