import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Order from '../views/Order/index.vue'
// import EquipmentList from '../views/EquipmentList/index.vue'
import Equipment from '../views/Equipment/index.vue'
// import Main from '../views/Main/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Order
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: Equipment,
    // children: [
    //   {
    //     path: 'list',
    //     component: EquipmentList,
    //     name: 'EquipmentList'
    //   }
    // ]
  },
  // {
  //   path: '/order',
  //   nmae: 'Order',
  //   children: [
  //     {
  //       path: '/list',
  //       component: 'OrderList'
  //     }
  //   ]
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
