export default [
  {
    path: '/c',
    name: 'c',
    meta: {
      title: 'Customer Home',
      sidebarIcon: 'house',
      showInSidebar: 'c',
    },
    component: () => import('@/views/customer/HomeView.vue')
  },
  {
    path: '/c/signin',
    name: 'c.signin',
    meta: {
      title: 'Customer Signin',
    },
    component: () => import('@/views/customer/authentication/Signin.vue')
  },
  {
    path: '/c/signup',
    name: 'c.signup',
    meta: {
      title: 'Customer Signup',
    },
    component: () => import('@/views/customer/authentication/Signup.vue')
  },
  {
    path: '/c/product/:id',
    name: 'c.product',
    meta: {
      title: 'Product',
    },
    component: () => import('@/views/customer/Product.vue')
  },
  {
    path: '/c/checkout',
    name: 'c.checkout',
    meta: {
      title: 'Checkout',
      requiresAuth: true
    },
    component: () => import('@/views/customer/Checkout.vue')
  },
  {
    path: '/c/order/success',
    name: 'c.order.success',
    meta: {
      title: 'Order success',
    },
    component: () => import('@/views/customer/OrderSuccess.vue')
  },
]