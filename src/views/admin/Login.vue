<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-tyler-blue to-tyler-pink"
  >
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p class="text-gray-600">Projeto Tyler Lima Eler</p>
        
        <!-- Modo de desenvolvimento -->
        <div v-if="!isFirebaseConfigured" class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-left">
          <p class="text-sm font-medium text-orange-800 mb-1">� Modo Mock (Firebase não configurado)</p>
          <p class="text-xs text-orange-700 mb-2">Credenciais de teste:</p>
          <div class="text-xs text-orange-600 space-y-1">
            <p><span class="font-mono">admin@tyler.com</span> / <span class="font-mono">admin123</span></p>
            <p>Google OAuth simulará: <span class="font-mono">marllon.nasser@gmail.com</span></p>
          </div>
          <p class="text-xs text-orange-500 mt-2 italic">
            Para usar Firebase real, configure as variáveis no .env
          </p>
        </div>
        
        <div v-else class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-left">
          <p class="text-sm font-medium text-green-800 mb-1">🔥 Firebase Configurado</p>
          <p class="text-xs text-green-700">Use suas credenciais Google reais</p>
        </div>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2" for="email">
            E-mail
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input-field"
            placeholder="admin@tylerlimaeler.org"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2" for="password">
            Senha
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <div
          v-if="error && !showUnauthorizedModal"
          class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full mb-4">
          {{ loading ? "Entrando..." : "Entrar com Email" }}
        </button>

        <div class="relative mb-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <button 
          type="button" 
          @click="handleGoogleLogin"
          :disabled="loading" 
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ loading ? "Entrando..." : "Continuar com Google" }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <RouterLink to="/" class="text-sm text-tyler-blue hover:underline">
          ← Voltar para o site
        </RouterLink>
      </div>
    </div>

    <!-- Modal de Não Autorizado -->
    <UnauthorizedModal
      :show="showUnauthorizedModal"
      :user-email="unauthorizedEmail"
      @close="handleCloseUnauthorizedModal"
      @try-again="handleTryAgainUnauthorized"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import UnauthorizedModal from "@/components/admin/UnauthorizedModal.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const showUnauthorizedModal = ref(false);
const unauthorizedEmail = ref("");

// Verificar se Firebase está configurado
const isFirebaseConfigured = computed(() => {
  return !!(import.meta.env.VITE_FIREBASE_API_KEY && 
           import.meta.env.VITE_FIREBASE_PROJECT_ID &&
           !import.meta.env.VITE_FIREBASE_API_KEY.startsWith('AIzaSy...'));
});

async function handleLogin() {
  loading.value = true;
  error.value = "";
  showUnauthorizedModal.value = false;

  try {
    const result = await authStore.login(email.value, password.value);

    if (result.success) {
      router.push("/admin");
    } else {
      if (result.error?.includes("não autorizado") || result.error?.includes("unauthorized")) {
        unauthorizedEmail.value = email.value;
        showUnauthorizedModal.value = true;
        error.value = "";
      } else {
        error.value = result.error || "Erro ao fazer login";
      }
    }
  } catch (err: any) {
    error.value = err.message || "Erro ao fazer login";
  } finally {
    loading.value = false;
  }
}

async function handleGoogleLogin() {
  loading.value = true;
  error.value = "";
  showUnauthorizedModal.value = false;

  try {
    const result = await authStore.loginWithGoogle();

    if (result.success) {
      router.push("/admin");
    } else {
      if (result.error?.includes("não autorizado") || result.error?.includes("unauthorized")) {
        // Pegar o email do usuário que tentou fazer login
        const user = authStore.getCurrentFirebaseUser();
        unauthorizedEmail.value = user?.email || "email desconhecido";
        showUnauthorizedModal.value = true;
        error.value = "";
      } else {
        error.value = result.error || "Erro ao fazer login com Google";
      }
    }
  } catch (err: any) {
    error.value = err.message || "Erro ao fazer login com Google";
  } finally {
    loading.value = false;
  }
}

function handleCloseUnauthorizedModal() {
  showUnauthorizedModal.value = false;
  unauthorizedEmail.value = "";
}

function handleTryAgainUnauthorized() {
  // Limpar dados e permitir nova tentativa
  email.value = "";
  password.value = "";
  error.value = "";
}
</script>
