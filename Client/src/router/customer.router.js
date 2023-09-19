export default [
  {
    path: '/c',
    name: 'c',
    title: 'Customer Home',
    icon: 'house',
    showInSideBar: 'c',
    component: () => import('@/views/customer/HomeView.vue')
  },
  {
    path: '/c/signin',
    name: 'c.signin',
    title: 'Customer Signin',
    component: () => import('@/views/customer/authentication/Signin.vue')
  },
  {
    path: '/c/signup',
    name: 'c.signup',
    title: 'Customer Signup',
    component: () => import('@/views/customer/authentication/Signup.vue')
  },
  {
    path: '/c/product/:id',
    name: 'c.product',
    title: 'Product',
    component: () => import('@/views/customer/Product.vue')
  },
]