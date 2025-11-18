<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="bg-white rounded-2xl shadow-xl p-12 text-center"
        >
          <Spinner size="xl" class="mx-auto mb-4" />
          <p class="text-gray-600">Carregando informações da doação...</p>
        </div>

        <!-- Payment Status -->
        <div v-else-if="paymentStatus" class="space-y-6">
          <!-- Status Header -->
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div :class="['p-8 text-center', statusConfig.bgClass]">
              <div
                class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-4"
              >
                <component
                  :is="statusConfig.icon"
                  :class="['w-10 h-10', statusConfig.iconColor]"
                />
              </div>
              <h1 class="text-3xl font-bold text-white mb-2">
                {{ statusConfig.title }}
              </h1>
              <p class="text-white/90 text-lg">
                {{ statusConfig.message }}
              </p>
            </div>

            <!-- Detalhes da Doação -->
            <div class="p-8">
              <dl class="space-y-4">
                <div class="flex justify-between items-center pb-4 border-b">
                  <dt class="text-gray-600 font-medium">Valor da doação:</dt>
                  <dd class="text-3xl font-bold text-tyler-pink">
                    {{ formatCurrency(paymentStatus.amount) }}
                  </dd>
                </div>

                <div class="flex justify-between items-center pb-4 border-b">
                  <dt class="text-gray-600 font-medium">ID da doação:</dt>
                  <dd class="text-gray-900 font-mono text-sm">
                    {{ paymentStatus.id }}
                  </dd>
                </div>

                <div class="flex justify-between items-center pb-4 border-b">
                  <dt class="text-gray-600 font-medium">Status:</dt>
                  <dd>
                    <Badge :variant="statusConfig.badgeVariant">
                      {{ statusConfig.statusLabel }}
                    </Badge>
                  </dd>
                </div>

                <div
                  v-if="
                    paymentStatus.expiresAt &&
                    (paymentStatus.status === 'WAITING' ||
                      paymentStatus.status === 'PENDING')
                  "
                  class="flex justify-between items-center pb-4 border-b"
                >
                  <dt class="text-gray-600 font-medium">Expira em:</dt>
                  <dd class="text-gray-900">
                    {{
                      formatDate(paymentStatus.expiresAt, {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- QR Code PIX (apenas se pendente) -->
          <div
            v-if="
              paymentStatus.status === 'WAITING' ||
              paymentStatus.status === 'PENDING'
            "
            class="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 class="text-2xl font-bold text-center mb-6 text-gray-900">
              {{
                paymentStatus.qrCodeImage
                  ? "Escaneie o QR Code para pagar"
                  : "Copie o código PIX para pagar"
              }}
            </h2>

            <div
              v-if="paymentStatus.qrCodeImage"
              class="bg-white border-4 border-gray-200 rounded-xl p-6 mb-6"
            >
              <img
                :src="paymentStatus.qrCodeImage"
                alt="QR Code PIX"
                class="w-full max-w-sm mx-auto"
              />
            </div>

            <div v-if="paymentStatus.qrCode" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{
                    paymentStatus.qrCodeImage
                      ? "Ou copie o código PIX:"
                      : "Código PIX Copia e Cola:"
                  }}
                </label>
                <div class="flex gap-2">
                  <input
                    :value="paymentStatus.qrCode"
                    readonly
                    class="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                  <BaseButton @click="copyPixCode" variant="primary">
                    <svg
                      v-if="!copied"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="ml-2">{{
                      copied ? "Copiado!" : "Copiar"
                    }}</span>
                  </BaseButton>
                </div>
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> O pagamento é confirmado
                  automaticamente. Esta página será atualizada quando o
                  pagamento for detectado.
                </p>
              </div>

              <!-- Auto-refresh info -->
              <div class="text-center text-sm text-gray-600">
                <div v-if="refreshAttempts < maxRefreshAttempts">
                  Verificando pagamento automaticamente...
                  <div class="flex items-center justify-center gap-2 mt-2">
                    <div
                      class="animate-spin rounded-full h-4 w-4 border-b-2 border-tyler-pink"
                    ></div>
                    <span
                      >Próxima atualização em {{ countdown }}s ({{
                        refreshAttempts + 1
                      }}/{{ maxRefreshAttempts }})</span
                    >
                  </div>
                </div>
                <div v-else class="text-yellow-700 bg-yellow-50 rounded-lg p-3">
                  <strong
                    >⚠️ Limite de verificações automáticas atingido.</strong
                  >
                  <p class="text-xs mt-1">
                    Clique em "Atualizar Status" para verificar manualmente.
                  </p>
                </div>
              </div>
            </div>

            <!-- Mensagem se não tiver QR Code -->
            <div
              v-else
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <p class="text-sm text-yellow-800">
                <strong>⚠️ Aguarde:</strong> O código PIX está sendo gerado...
              </p>
            </div>
          </div>

          <!-- Ações -->
          <div class="flex gap-4">
            <BaseButton
              variant="secondary"
              full-width
              @click="router.push('/')"
            >
              Voltar para Home
            </BaseButton>
            <BaseButton
              v-if="
                paymentStatus.status === 'WAITING' ||
                paymentStatus.status === 'PENDING'
              "
              variant="primary"
              full-width
              @click="checkStatus"
            >
              Atualizar Status
            </BaseButton>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4"
          >
            <svg
              class="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Doação não encontrada
          </h1>
          <p class="text-gray-600 mb-6">
            Não foi possível carregar as informações desta doação.
          </p>
          <BaseButton variant="primary" @click="router.push('/')">
            Voltar para Home
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BaseButton, Spinner, Badge } from "@/components/ui";
import { paymentService } from "@/utils/services";
import { useCurrency, useDate, useToast } from "@/composables";
import type { PaymentStatusResponse } from "@/types";

const route = useRoute();
const router = useRouter();
const { formatCurrency } = useCurrency();
const { formatDate } = useDate();
const { success } = useToast();

const loading = ref(true);
const paymentStatus = ref<PaymentStatusResponse | null>(null);
const copied = ref(false);
const countdown = ref(10);
const refreshAttempts = ref(0);
const maxRefreshAttempts = 10; // Máximo de 10 tentativas
const baseInterval = 10000; // 10 segundos inicial
let intervalId: ReturnType<typeof setInterval> | null = null;
let countdownIntervalId: ReturnType<typeof setInterval> | null = null;

const statusConfig = computed(() => {
  const status = paymentStatus.value?.status;

  const configs: Record<string, any> = {
    PAID: {
      title: "Doação Confirmada! 🎉",
      message: "Muito obrigado pela sua contribuição!",
      statusLabel: "Pago",
      bgClass: "bg-gradient-to-r from-green-500 to-emerald-600",
      iconColor: "text-green-600",
      badgeVariant: "success",
      icon: "svg",
    },
    WAITING: {
      title: "Aguardando Pagamento",
      message: "Complete o pagamento via PIX para confirmar sua doação",
      statusLabel: "Aguardando",
      bgClass: "bg-gradient-to-r from-yellow-500 to-orange-500",
      iconColor: "text-yellow-600",
      badgeVariant: "warning",
      icon: "svg",
    },
    PENDING: {
      title: "Aguardando Pagamento",
      message: "Complete o pagamento via PIX para confirmar sua doação",
      statusLabel: "Pendente",
      bgClass: "bg-gradient-to-r from-yellow-500 to-orange-500",
      iconColor: "text-yellow-600",
      badgeVariant: "warning",
      icon: "svg",
    },
    CANCELLED: {
      title: "Doação Cancelada",
      message: "Esta doação foi cancelada",
      statusLabel: "Cancelada",
      bgClass: "bg-gradient-to-r from-red-500 to-pink-600",
      iconColor: "text-red-600",
      badgeVariant: "danger",
      icon: "svg",
    },
    EXPIRED: {
      title: "Pagamento Expirado",
      message: "O prazo para pagamento expirou",
      statusLabel: "Expirado",
      bgClass: "bg-gradient-to-r from-gray-500 to-gray-600",
      iconColor: "text-gray-600",
      badgeVariant: "secondary",
      icon: "svg",
    },
  };

  return configs[status as string] || configs.PENDING;
});

onMounted(async () => {
  await loadPaymentStatus();
  if (
    paymentStatus.value?.status === "WAITING" ||
    paymentStatus.value?.status === "PENDING"
  ) {
    startAutoRefresh();
  }
});

onUnmounted(() => {
  stopAutoRefresh();
});

async function loadPaymentStatus() {
  try {
    loading.value = true;
    const paymentId = route.params.id as string;
    paymentStatus.value = await paymentService.getPaymentStatus(paymentId);

    console.log("Status do pagamento:", paymentStatus.value);
    if (
      paymentStatus.value.status !== "WAITING" &&
      paymentStatus.value.status !== "PENDING"
    ) {
      stopAutoRefresh();
      if (paymentStatus.value.status === "PAID") {
        success("Pagamento confirmado! Obrigado pela sua doação! ❤️");
      }
    }
  } catch (error) {
    console.error("Erro ao carregar status:", error);
  } finally {
    loading.value = false;
  }
}

async function checkStatus() {
  refreshAttempts.value = 0; // Resetar contador ao verificar manualmente
  await loadPaymentStatus();
  if (
    (paymentStatus.value?.status === "WAITING" ||
      paymentStatus.value?.status === "PENDING") &&
    refreshAttempts.value < maxRefreshAttempts
  ) {
    stopAutoRefresh();
    startAutoRefresh();
  }
}

function startAutoRefresh() {
  if (refreshAttempts.value >= maxRefreshAttempts) {
    console.log("Limite de tentativas de auto-refresh atingido");
    return;
  }
  const currentInterval =
    refreshAttempts.value === 0
      ? baseInterval
      : baseInterval + refreshAttempts.value * 5000;

  countdown.value = Math.floor(currentInterval / 1000);
  intervalId = setInterval(async () => {
    refreshAttempts.value++;
    await loadPaymentStatus();

    if (refreshAttempts.value >= maxRefreshAttempts) {
      stopAutoRefresh();
      return;
    }
    const nextInterval = baseInterval + refreshAttempts.value * 5000;
    countdown.value = Math.floor(nextInterval / 1000);
    stopAutoRefresh();
    startAutoRefresh();
  }, currentInterval);
  countdownIntervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    }
  }, 1000);
}

function stopAutoRefresh() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
}

async function copyPixCode() {
  if (paymentStatus.value?.qrCode) {
    try {
      await navigator.clipboard.writeText(paymentStatus.value.qrCode);
      copied.value = true;
      success("Código PIX copiado!");
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  }
}
</script>
