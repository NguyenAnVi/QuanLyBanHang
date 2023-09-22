export default [
  {
    path: '/m',
    name: 'm',
    meta:{
      title: 'Employee Home',
      sidebarIcon: 'house',
      showInSidebar: 'm',
      requiresAuth:true
    },
    component: () => import('@/views/employee/HomeView.vue')
  },
  {
    path: '/m/signin',
    name: 'm.signin',
    meta:{
      title: 'Signin',
    },
    component: () => import('@/views/employee/authentication/Signin.vue')
  },
  {
    path: '/m/signup',
    name: 'm.signup',
    meta:{
      title: 'Signup',
    },
    component: () => import('@/views/employee/authentication/Signup.vue')
  },
  {
    path: '/m/product',
    name: 'm.product',
    meta:{
      title: 'Product management',
      sidebarIcon: 'house',
      showInSidebar: 'm',
      requiresAuth:true
    },
    component: () => import('@/views/employee/product/ProductList.vue')
  },
  {
    path: '/m/product/add',
    name: 'm.product.add',
    meta:{
      title: 'Add new product',
      requiresAuth:true
    },
    component: () => import('@/views/employee/product/ProductAdd.vue')
  },
  {
    path: '/m/product/edit/:id',
    name: 'm.product.edit',
    meta:{
      title: 'Edit product',
      requiresAuth:true
    },
    component: () => import('@/views/employee/product/ProductEdit.vue')
  },
  {
    path: '/m/employee',
    name: 'm.employee',
    meta:{
      title: 'Employee management',
      sidebarIcon: 'house',
      showInSidebar: 'm',
      requiresAuth:true
    },
    component: () => import('@/views/employee/employee/EmployeeList.vue')
  },
  {
    path: '/m/employee/add',
    name: 'm.employee.add',
    meta:{
      title: 'Add new employee',
      requiresAuth:true
    },
    component: () => import('@/views/employee/employee/EmployeeAdd.vue')
  },
  {
    path: '/m/employee/edit/:id',
    name: 'm.employee.edit',
    meta:{
      title: 'Edit employee',
      requiresAuth:true
    },
    component: () => import('@/views/employee/employee/EmployeeEdit.vue')
  },
]