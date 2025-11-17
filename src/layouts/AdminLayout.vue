<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Menu lateral apenas se autenticado -->
    <AdminHeader v-if="isAuthenticated" />

    <!-- Conteúdo com margem apenas se autenticado e não for a página de login -->
    <main :class="isAuthenticated && !isLoginPage ? 'ml-64 p-8' : ''">
      <RouterView v-if="!authChecking" />
      <div v-else class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-tyler-blue"
          ></div>
          <p class="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import AdminHeader from "@/components/admin/AdminHeader.vue";

const authStore = useAuthStore();
const route = useRoute();
const authChecking = ref(true);

const isAuthenticated = computed(() => {
  const auth = authStore.isAuthenticated;
  console.log("🎨 [LAYOUT] isAuthenticated:", auth);
  return auth;
});

const isLoginPage = computed(() => {
  const isLogin = route.name === "admin-login";
  console.log("🎨 [LAYOUT] isLoginPage:", isLogin, "| route.name:", route.name);
  return isLogin;
});

onMounted(async () => {
  console.log("🎨 [LAYOUT] AdminLayout montado, verificando autenticação...");
  await authStore.checkAuth();
  authChecking.value = false;
  console.log(
    "🎨 [LAYOUT] Verificação concluída, authChecking:",
    authChecking.value
  );
  console.log("🎨 [LAYOUT] isAuthenticated:", isAuthenticated.value);
});

watch(
  () => route.path,
  (newPath) => {
    console.log("🎨 [LAYOUT] Rota mudou para:", newPath);
  }
);
</script>
