export default [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'CustomerHome',
        meta: {
          title: 'Customer Home',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/HomeView.vue'),

      },
      {
        path: 'signin',
        name: 'CustomerSignin',
        meta: {
          title: 'Customer Signin',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/authentication/Signin.vue')
      },
      {
        path: 'signup',
        name: 'CustomerSignup',
        meta: {
          title: 'Customer Signup',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/authentication/Signup.vue')
      },
      {
        path: 'product/:id',
        name: 'CustomerProductDetail',
        meta: {
          title: 'Product',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/Product.vue')
      },
      {
        path: 'checkout',
        name: 'CustomerCheckout',
        meta: {
          title: 'Checkout',
          requiresAuth: true,
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/Checkout.vue')
      },
      {
        path: 'order/success',
        name: 'CustomerOrderSuccess',
        meta: {
          title: 'Order success',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/OrderSuccess.vue')
      },
      {
        path: 'order/list',
        name: 'CustomerOrdersList',
        meta: {
          title: 'My Orders',
          userType: 'CUSTOMER'
        },
        component: () => import('@/views/customer/OrdersList.vue')
      },
    ]
  }
]