<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-tyler-blue to-tyler-pink"
  >
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p class="text-gray-600">Projeto Tyler Lima Eler</p>
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
          v-if="error"
          class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <RouterLink to="/" class="text-sm text-tyler-blue hover:underline">
          ← Voltar para o site
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";

  try {
    const result = await authStore.login(email.value, password.value);

    if (result.success) {
      router.push("/admin");
    } else {
      error.value = result.error || "Erro ao fazer login";
    }
  } catch (err: any) {
    error.value = err.message || "Erro ao fazer login";
  } finally {
    loading.value = false;
  }
}
</script>
