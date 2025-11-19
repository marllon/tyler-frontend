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
        path: "image-system-demo",
        name: "image-system-demo",
        component: () => import("@/views/ImageSystemDemo.vue"),
        meta: { title: "Sistema de Imagens - Demo" },
      },
      {
        path: "test-donation",
        name: "test-donation",
        component: () => import("@/views/TestDonation.vue"),
        meta: { title: "Teste de Doação" },
      },
      {
        path: "donation/:id",
        name: "donation-payment",
        component: () => import("@/views/DonationPayment.vue"),
        meta: { title: "Pagamento da Doação" },
      },
      {
        path: "checkout",
        name: "checkout",
        component: () => import("@/views/Checkout.vue"),
        meta: { title: "Finalizar Compra" },
      },
      {
        path: "payment/:orderId",
        name: "Payment",
        component: () => import("@/views/Payment.vue"),
        meta: { title: "Pagamento", requiresAuth: true },
      },
      {
        path: "my-orders",
        name: "MyOrders",
        component: () => import("@/views/MyOrders.vue"),
        meta: { title: "Meus Pedidos", requiresAuth: true },
      },
      {
        path: "order-confirmation/:orderId",
        name: "OrderConfirmation",
        component: () => import("@/views/OrderConfirmation.vue"),
        meta: { title: "Pedido Confirmado" },
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

router.beforeEach(async (to, from, next) => {
  console.log("🛣️ [ROUTER] Navegando de", from.path, "para", to.path);
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    console.log("🔒 [ROUTER] Rota protegida, verificando autenticação...");

    const isAuth = await authStore.checkAuth();
    console.log(
      "🔒 [ROUTER] Resultado da verificação:",
      isAuth ? "AUTENTICADO" : "NÃO AUTENTICADO"
    );

    if (!authStore.isAuthenticated) {
      console.log("❌ [ROUTER] Não autenticado, redirecionando para login");

      next({ name: "admin-login", query: { redirect: to.fullPath } });
      return;
    }
    console.log("✅ [ROUTER] Autenticado, permitindo acesso");
  }

  if (to.name === "admin-login" && authStore.isAuthenticated) {
    console.log("🔄 [ROUTER] Já autenticado, redirecionando para dashboard");
    next({ name: "admin-dashboard" });
    return;
  }

  console.log("✅ [ROUTER] Navegação permitida");
  next();
});

export default router;
