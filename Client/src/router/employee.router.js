export default [
  {
    path: '/m',
    name: 'm',
    title: 'Employee Home',
    icon: 'house',
    showInSideBar: 'm',
    component: () => import('@/views/employee/HomeView.vue')
  },
  {
    path: '/m/signin',
    name: 'm.signin',
    title: 'Signin',
    component: () => import('@/views/employee/authentication/Signin.vue')
  },
  {
    path: '/m/signup',
    name: 'm.signup',
    title: 'Signup',
    component: () => import('@/views/employee/authentication/Signup.vue')
  },
  {
    path: '/m/product',
    name: 'm.product',
    title: 'Product management',
    icon: 'house',
    showInSideBar: 'm',
    component: () => import('@/views/employee/product/ProductList.vue')
  },
  {
    path: '/m/product/add',
    name: 'm.product.add',
    title: 'Add new product',
    component: () => import('@/views/employee/product/ProductAdd.vue')
  },
  {
    path: '/m/product/edit/:id',
    name: 'm.product.edit',
    title: 'Edit product',
    component: () => import('@/views/employee/product/ProductEdit.vue')
  },
]