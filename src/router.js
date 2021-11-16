import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import Login from "./components/Login.vue";
import Administracion from "./components/Administracion.vue";
import SignUp from "./components/SignUp.vue";
import Home from "./components/Home.vue";
import Carrito from "./components/Carrito.vue";

const routes = [
  {
    path: "/",
    name: "root",
    component: App,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/administracion",
    name: "administracion",
    component: Administracion,
  },
  {
    path: "/registro",
    name: "registro",
    component: SignUp,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/carrito",
    name: "carrito",
    component: Carrito,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
