import { createRouter, createWebHistory } from 'vue-router'
import CustomerRouter from "./customer.router"
import EmployeeRouter from "./employee.router"
import NotFound from '@/views/NotFound.vue';

export const routes = [
  {
    path: "/",
    redirect: "/c",
  },
  ...CustomerRouter,
  ...EmployeeRouter,
  {
    path: "/:pathMatch(.*)*",
    title: "Page not found",
    component: NotFound
  }
]
console.log(routes);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
