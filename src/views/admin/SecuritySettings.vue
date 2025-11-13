<template>
  <div class="p-6">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Configurações de Segurança
          </h1>
          <p class="text-gray-600 mt-1">
            Gerencie autorizações e permissões do sistema
          </p>
        </div>

        <!-- User Info -->
        <div class="text-right">
          <p class="text-sm text-gray-500">Logado como:</p>
          <p class="font-medium text-gray-900">{{ currentUser?.email }}</p>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="
              currentUser?.role === 'super-admin'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            "
          >
            {{ getRoleDisplayName(currentUser?.role || "") }}
          </span>
        </div>
      </div>
    </div>

    <!-- Status de Autenticação -->
    <div class="grid gap-6 mb-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Status da Autenticação
        </h2>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Sistema de Auth
                </h3>
                <p class="text-sm text-gray-600">
                  {{ useFirebase ? "Firebase Ativo" : "Modo Desenvolvimento" }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Usuário Atual</h3>
                <p class="text-sm text-gray-600">{{ currentUser?.email }}</p>
                <p
                  class="text-xs font-medium"
                  :class="
                    currentUser?.role === 'super-admin'
                      ? 'text-purple-600'
                      : 'text-blue-600'
                  "
                >
                  {{ getRoleDisplayName(currentUser?.role || "") }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-8 w-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Autorização</h3>
                <p class="text-sm text-gray-600">Lista Restritiva Ativa</p>
                <p class="text-xs text-green-600 font-medium">✓ Protegido</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gerenciador de Administradores -->
    <AdminAuthorizationManager />

    <!-- Configurações Avançadas -->
    <div class="mt-8 bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Configurações Avançadas
      </h2>

      <div class="space-y-6">
        <!-- Firebase Config Status -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Configuração Firebase
          </h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium">Project ID:</span>
                <span class="ml-2 text-gray-600">{{
                  firebaseConfig.projectId || "Não configurado"
                }}</span>
              </div>
              <div>
                <span class="font-medium">Auth Domain:</span>
                <span class="ml-2 text-gray-600">{{
                  firebaseConfig.authDomain || "Não configurado"
                }}</span>
              </div>
              <div>
                <span class="font-medium">API Key:</span>
                <span class="ml-2 text-gray-600">{{
                  firebaseConfig.apiKey ? "••••••••" : "Não configurado"
                }}</span>
              </div>
              <div>
                <span class="font-medium">Status:</span>
                <span
                  class="ml-2"
                  :class="useFirebase ? 'text-green-600' : 'text-yellow-600'"
                >
                  {{ useFirebase ? "Conectado" : "Modo Mock" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Variáveis de Ambiente -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Variáveis de Ambiente
          </h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="font-medium">VITE_AUTHORIZED_ADMINS:</span>
                <span class="text-gray-600">{{
                  authorizedAdminsEnv ? "✓ Configurado" : "✗ Não configurado"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">VITE_AUTHORIZED_DOMAINS:</span>
                <span class="text-gray-600">{{
                  authorizedDomainsEnv ? "✓ Configurado" : "✗ Não configurado"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">VITE_API_BASE_URL:</span>
                <span class="text-gray-600">{{ apiBaseUrl }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Logs de Segurança (Mock) -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Logs de Segurança
          </h3>
          <div class="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <div class="space-y-1 text-sm font-mono">
              <div
                v-for="log in securityLogs"
                :key="log.id"
                class="flex justify-between"
              >
                <span
                  :class="
                    log.level === 'success'
                      ? 'text-green-600'
                      : log.level === 'warning'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  "
                >
                  {{ log.timestamp }} - {{ log.message }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import AdminAuthorizationManager from "@/components/admin/AdminAuthorizationManager.vue";

const authStore = useAuthStore();
const currentUser = computed(() => authStore.admin);
const useFirebase = computed(() => authStore.useFirebase);
const firebaseConfig = computed(() => ({
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
}));
const authorizedAdminsEnv = computed(
  () => !!import.meta.env.VITE_AUTHORIZED_ADMINS
);
const authorizedDomainsEnv = computed(
  () => !!import.meta.env.VITE_AUTHORIZED_DOMAINS
);
const apiBaseUrl = computed(
  () => import.meta.env.VITE_API_BASE_URL || "Não configurado"
);
const securityLogs = ref([
  {
    id: 1,
    timestamp: "2024-11-11 22:15:32",
    message: "Login successful: admin@gmail.com",
    level: "success",
  },
  {
    id: 2,
    timestamp: "2024-11-11 21:45:12",
    message: "Authorization check passed",
    level: "success",
  },
  {
    id: 3,
    timestamp: "2024-11-11 20:30:45",
    message: "Unauthorized access attempt blocked",
    level: "warning",
  },
  {
    id: 4,
    timestamp: "2024-11-11 19:15:23",
    message: "Firebase connection established",
    level: "success",
  },
]);
function getRoleDisplayName(role: string): string {
  const roleNames = {
    "super-admin": "Super Administrador",
    admin: "Administrador",
  };
  return roleNames[role as keyof typeof roleNames] || "Usuário";
}
</script>
