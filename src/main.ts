import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");
async function initializeServices() {
  try {
    const { initRemoteConfig } = await import("@/utils/remoteConfig");
    await initRemoteConfig();
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Remote Config:", error);
  }
  const { useAuthStore } = await import("@/stores/auth");
  const authStore = useAuthStore();
  authStore.initializeAuth();
}

initializeServices();
