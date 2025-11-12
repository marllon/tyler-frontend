import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Inicializar Firebase Auth e Remote Config após montar o app
app.mount("#app");

// Inicializar serviços depois que o app estiver montado
async function initializeServices() {
  // Inicializar Remote Config
  try {
    const { initRemoteConfig } = await import("@/utils/remoteConfig");
    await initRemoteConfig();
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Remote Config:", error);
  }

  // Inicializar auth
  const { useAuthStore } = await import("@/stores/auth");
  const authStore = useAuthStore();
  authStore.initializeAuth();
}

initializeServices();
