import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import products from "../views/products.vue";
import Brand from "../views/Brand.vue";
import Ads from "../views/Ads.vue";
import User from "../views/User.vue";
import Order from "../views/Order.vue";
import Routen from "../views/Routen.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requireNotLogin: true,
    }
  },
  {
    path: "/products",
    name: "products",
    component: products,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/brands",
    name: "brand",
    component: Brand,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/adversments",
    name: "adversments",
    component: Ads,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/users",
    name: "User",
    component: User,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/orders",
    name: "Order",
    component: Order,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/routens",
    name: "Routen",
    component: Routen,
    meta: {
      requiresAuth: true,
    }
  },


];


// حتى اول مطب ع رابط يحولك ع لوكن
// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requireNotLogin)) {
//     if (store.getters.isLoggedIn) {
//       next("/");
//     } else {
//       next();
//     }
//   } else if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (store.getters.isLoggedIn) {
//       next();
//       return;
//     }
//     next("/login");
//   } else {
//     next();
//   }
// });



const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
