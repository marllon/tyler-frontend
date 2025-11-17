<template>
  <BaseModal
    :model-value="show"
    @update:model-value="handleClose"
    :closable="true"
    title="Acesso Não Autorizado"
  >
    <div class="text-center p-6">
      <!-- Ícone de Aviso -->
      <div
        class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4"
      >
        <svg
          class="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <!-- Mensagem Principal -->
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Conta não autorizada
      </h3>

      <p class="text-gray-600 mb-4">
        Sua conta <strong>{{ userEmail }}</strong> foi autenticada com sucesso,
        mas não possui permissão para acessar o painel administrativo.
      </p>

      <!-- Informações Adicionais -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg
            class="w-5 h-5 text-blue-400 mt-0.5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="text-left">
            <h4 class="text-sm font-medium text-blue-900 mb-1">
              Como obter acesso?
            </h4>
            <p class="text-sm text-blue-700">
              Entre em contato com o administrador do sistema para solicitar
              permissão de acesso ao painel administrativo.
            </p>
          </div>
        </div>
      </div>

      <!-- Informações de Contato -->
      <div class="text-left bg-gray-50 rounded-lg p-4 mb-6">
        <h4 class="text-sm font-medium text-gray-900 mb-2">
          📧 Informações para contato:
        </h4>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>
            • Seu email:
            <code class="bg-white px-2 py-1 rounded">{{ userEmail }}</code>
          </li>
          <li>
            • Data/Hora:
            <code class="bg-white px-2 py-1 rounded">{{
              currentDateTime
            }}</code>
          </li>
          <li>• Sistema: Tyler - Painel Administrativo</li>
        </ul>
      </div>

      <!-- Ações -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="handleTryAgain"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          🔄 Tentar Novamente
        </button>
        <button
          @click="handleGoHome"
          class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          🏠 Voltar ao Site
        </button>
      </div>

      <!-- Link de Ajuda -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-xs text-gray-500">
          Precisa de ajuda? Entre em contato através do
          <a
            href="mailto:admin@tylerlimaeler.org"
            class="text-blue-600 hover:underline"
          >
            admin@tylerlimaeler.org
          </a>
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "@/components/ui/BaseModal.vue";

interface Props {
  show: boolean;
  userEmail?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userEmail: "",
});

const emit = defineEmits<{
  close: [];
  tryAgain: [];
}>();

const router = useRouter();

const currentDateTime = computed(() => {
  return new Date().toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
});

function handleClose() {
  emit("close");
}

function handleTryAgain() {
  emit("tryAgain");
  handleClose();
}

function handleGoHome() {
  router.push("/");
  handleClose();
}
</script>
