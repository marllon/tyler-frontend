<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Administradores Autorizados
      </h3>
      <p class="text-sm text-gray-600">
        Apenas emails nesta lista podem acessar o painel administrativo.
      </p>
    </div>

    <!-- Lista de emails autorizados -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-gray-800 mb-3">Emails Autorizados</h4>

      <div class="space-y-2">
        <div
          v-for="(email, index) in authorizedEmails"
          :key="index"
          class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ email }}</p>
              <p class="text-xs text-gray-500">
                {{ getRoleDisplayName(email) }}
              </p>
            </div>
          </div>

          <button
            v-if="canRemoveEmail(email)"
            @click="removeEmail(email)"
            class="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remover
          </button>
        </div>
      </div>

      <!-- Adicionar novo email -->
      <div v-if="isSuperAdmin" class="mt-4">
        <div class="flex gap-2">
          <input
            v-model="newEmail"
            type="email"
            placeholder="novo-admin@example.com"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="addEmail"
          />
          <button
            @click="addEmail"
            :disabled="!newEmail || loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Apenas super-admins podem adicionar novos administradores
        </p>
      </div>
    </div>

    <!-- Configuração atual -->
    <div class="border-t pt-4">
      <h4 class="text-md font-medium text-gray-800 mb-3">
        Status da Configuração
      </h4>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Total de administradores:</span>
          <span class="text-sm font-medium">{{ authorizedEmails.length }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Seu nível de acesso:</span>
          <span
            class="text-sm font-medium"
            :class="
              currentUser?.role === 'super-admin'
                ? 'text-purple-600'
                : 'text-blue-600'
            "
          >
            {{ getRoleDisplayName(currentUser?.email || "") }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Configuração válida:</span>
          <span
            class="text-sm font-medium"
            :class="configStatus.valid ? 'text-green-600' : 'text-red-600'"
          >
            {{ configStatus.valid ? "Sim" : "Não" }}
          </span>
        </div>
      </div>

      <!-- Issues de configuração -->
      <div
        v-if="configStatus.issues.length > 0"
        class="mt-3 p-3 bg-red-50 border border-red-200 rounded-md"
      >
        <h5 class="text-sm font-medium text-red-800 mb-1">
          Problemas encontrados:
        </h5>
        <ul class="text-sm text-red-700 space-y-1">
          <li v-for="issue in configStatus.issues" :key="issue">
            • {{ issue }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Aviso de segurança -->
    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Importante</h3>
          <p class="text-sm text-yellow-700 mt-1">
            Tenha cuidado ao remover administradores. Certifique-se de que
            sempre há pelo menos um super-admin ativo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { authorizationService } from "@/utils/authorization";
import { useToast } from "@/composables/useToast";

const authStore = useAuthStore();
const { showToast } = useToast();

// State
const loading = ref(false);
const newEmail = ref("");
const authorizedEmails = ref<string[]>([]);

// Computed
const currentUser = computed(() => authStore.admin);
const isSuperAdmin = computed(() => currentUser.value?.role === "super-admin");

const configStatus = ref({ valid: true, issues: [] });

// Atualizar status da configuração
async function updateConfigStatus() {
  try {
    configStatus.value = await authorizationService.validateConfiguration();
  } catch (error) {
    configStatus.value = {
      valid: false,
      issues: ["Erro ao validar configuração"],
    };
  }
}

// Methods
async function loadAuthorizedEmails() {
  if (currentUser.value) {
    loading.value = true;
    try {
      const emails = await authorizationService.getAuthorizedEmails(
        currentUser.value.role
      );
      authorizedEmails.value = emails.map((item) => item.email);
    } catch (error) {
      console.error("Erro ao carregar emails autorizados:", error);
      showToast("Erro ao carregar lista de emails", "error");
    } finally {
      loading.value = false;
    }
  }
}

function getRoleDisplayName(email: string): string {
  // Determinar role baseado no email (lógica simples para o frontend)
  const role =
    email.includes("tyler") || email.includes("admin@tylerlimaeler.org")
      ? "super-admin"
      : "admin";

  const roleNames = {
    "super-admin": "Super Administrador",
    admin: "Administrador",
  };
  return roleNames[role] || "Usuário";
}

function canRemoveEmail(email: string): boolean {
  if (!isSuperAdmin.value) return false;
  if (email === currentUser.value?.email) return false; // Não pode remover a si mesmo
  return true;
}

async function addEmail() {
  if (!newEmail.value || !isSuperAdmin.value) return;

  loading.value = true;

  try {
    // Verificar se email é válido
    const authResult = await authorizationService.checkEmailAuthorization(
      newEmail.value
    );

    const success = await authorizationService.addAuthorizedEmail(
      newEmail.value,
      currentUser.value!.role
    );

    if (success) {
      showToast(`Email ${newEmail.value} adicionado com sucesso`, "success");
      await loadAuthorizedEmails();
      newEmail.value = "";
    } else {
      showToast("Email já estava na lista ou erro ao adicionar", "warning");
    }
  } catch (error) {
    showToast("Erro ao adicionar email", "error");
  } finally {
    loading.value = false;
  }
}

async function removeEmail(email: string) {
  if (!canRemoveEmail(email)) return;

  if (
    !confirm(
      `Tem certeza que deseja remover ${email} da lista de administradores?`
    )
  ) {
    return;
  }

  loading.value = true;

  try {
    const success = await authorizationService.removeAuthorizedEmail(
      email,
      currentUser.value!.role
    );

    if (success) {
      showToast(`Email ${email} removido com sucesso`, "success");
      await loadAuthorizedEmails();
    } else {
      showToast("Erro ao remover email", "error");
    }
  } catch (error) {
    showToast("Erro ao remover email", "error");
  } finally {
    loading.value = false;
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadAuthorizedEmails(), updateConfigStatus()]);
});
</script>
