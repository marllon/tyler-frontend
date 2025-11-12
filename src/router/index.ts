import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "products",
        name: "products",
        component: () => import("@/views/Products.vue"),
      },
      {
        path: "goals",
        name: "goals",
        component: () => import("@/views/Goals.vue"),
      },
      {
        path: "raffles",
        name: "raffles",
        component: () => import("@/views/Raffles.vue"),
      },
      {
        path: "events",
        name: "events",
        component: () => import("@/views/Events.vue"),
      },
      {
        path: "about",
        name: "about",
        component: () => import("@/views/About.vue"),
      },
      {
        path: "contact",
        name: "contact",
        component: () => import("@/views/Contact.vue"),
      },
      {
        path: "test-donation",
        name: "test-donation",
        component: () => import("@/views/TestDonation.vue"),
        meta: { title: "Teste de Doação" },
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: () => import("@/views/admin/Dashboard.vue"),
      },
      {
        path: "login",
        name: "admin-login",
        component: () => import("@/views/admin/Login.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "products",
        name: "admin-products",
        component: () => import("@/views/admin/Products.vue"),
      },
      {
        path: "goals",
        name: "admin-goals",
        component: () => import("@/views/admin/Goals.vue"),
      },
      {
        path: "raffles",
        name: "admin-raffles",
        component: () => import("@/views/admin/Raffles.vue"),
      },
      {
        path: "events",
        name: "admin-events",
        component: () => import("@/views/admin/Events.vue"),
      },
      {
        path: "orders",
        name: "admin-orders",
        component: () => import("@/views/admin/Orders.vue"),
      },
      {
        path: "donations",
        name: "admin-donations",
        component: () => import("@/views/admin/Donations.vue"),
      },
      {
        path: "security",
        name: "admin-security",
        component: () => import("@/views/admin/SecuritySettings.vue"),
        meta: { title: "Configurações de Segurança" },
      },
      {
        path: "settings",
        name: "admin-settings",
        component: () => import("@/views/admin/Settings.vue"),
        meta: { title: "Configurações" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "admin-login" });
  } else if (to.name === "admin-login" && authStore.isAuthenticated) {
    next({ name: "admin-dashboard" });
  } else {
    next();
  }
});

export default router;
