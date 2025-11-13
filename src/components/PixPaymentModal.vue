<template>
  <BaseModal v-model="isOpen" :title="modalTitle" @close="handleClose">
    <div class="space-y-6">
      <!-- Forma de Pagamento -->
      <div v-if="step === 'payment-method'" class="text-center">
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Como você gostaria de contribuir?
          </h3>
          <p class="text-gray-600">
            Valor:
            <span class="font-semibold text-green-600">{{
              formatCurrency(amount)
            }}</span>
          </p>
        </div>

        <div class="grid gap-4">
          <button
            @click="initiatePixPayment"
            :disabled="loading"
            class="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <div class="text-center">
              <div class="text-2xl mb-2">📱</div>
              <div class="font-medium">PIX</div>
              <div class="text-sm text-gray-600">Pagamento instantâneo</div>
            </div>
          </button>

          <!-- Futuras opções de pagamento -->
          <button
            disabled
            class="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
          >
            <div class="text-center">
              <div class="text-2xl mb-2">💳</div>
              <div class="font-medium">Cartão de Crédito</div>
              <div class="text-sm text-gray-600">Em breve</div>
            </div>
          </button>
        </div>
      </div>

      <!-- PIX Payment -->
      <div v-else-if="step === 'pix-payment'" class="text-center">
        <div v-if="pixData" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">
            Escaneie o QR Code PIX
          </h3>

          <div class="bg-white p-4 rounded-lg border">
            <img
              v-if="qrCodeUrl"
              :src="qrCodeUrl"
              alt="QR Code PIX"
              class="mx-auto max-w-64 w-full"
            />
            <div
              v-else
              class="w-64 h-64 mx-auto bg-gray-100 rounded flex items-center justify-center"
            >
              <Spinner />
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-sm text-gray-600">Ou copie o código PIX:</p>
            <div class="flex gap-2">
              <input
                :value="pixData.qr_codes[0]?.text"
                readonly
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
              />
              <button
                @click="copyPixCode"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Copiar
              </button>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Status:</strong> {{ getStatusMessage(paymentStatus) }}
            </p>
            <div
              v-if="paymentStatus === 'WAITING_PAYMENT'"
              class="flex items-center justify-center mt-2"
            >
              <Spinner class="w-4 h-4 mr-2" />
              <span class="text-sm">Aguardando pagamento...</span>
            </div>
          </div>
        </div>

        <div v-else-if="loading" class="flex flex-col items-center py-8">
          <Spinner class="w-8 h-8 mb-4" />
          <p>Gerando PIX...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="initiatePixPayment"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>

      <!-- Success -->
      <div v-else-if="step === 'success'" class="text-center py-8">
        <div class="text-6xl mb-4">✅</div>
        <h3 class="text-xl font-semibold text-green-600 mb-2">
          Pagamento Confirmado!
        </h3>
        <p class="text-gray-600 mb-4">
          Obrigado pela sua contribuição de {{ formatCurrency(amount) }}
        </p>
        <button
          @click="handleClose"
          class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Fechar
        </button>
      </div>

      <!-- Error -->
      <div v-else-if="step === 'error'" class="text-center py-8">
        <div class="text-6xl mb-4">❌</div>
        <h3 class="text-xl font-semibold text-red-600 mb-2">
          Pagamento não realizado
        </h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <div class="flex gap-4 justify-center">
          <button
            @click="resetPayment"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
          <button
            @click="handleClose"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { paymentService } from "@/utils/services";
import { useCurrency } from "@/composables/useCurrency";
import { useToast } from "@/composables/useToast";
import type {
  PixPaymentRequest,
  PixPaymentResponse,
  PaymentStatusResponse,
  PaymentStatus,
} from "@/types";

interface Props {
  modelValue: boolean;
  amount: number; // em centavos
  description: string;
  payer: {
    name: string;
    email: string;
    document: string;
  };
  goalId?: string;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success", data: PaymentStatusResponse): void;
  (e: "error", error: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { formatCurrency } = useCurrency();
const { showToast } = useToast();
const step = ref<"payment-method" | "pix-payment" | "success" | "error">(
  "payment-method"
);
const loading = ref(false);
const error = ref<string | null>(null);
const pixData = ref<PixPaymentResponse | null>(null);
const paymentStatus = ref<PaymentStatus>("NEW");
const pollInterval = ref<number | null>(null);
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const modalTitle = computed(() => {
  switch (step.value) {
    case "payment-method":
      return "Escolha a forma de pagamento";
    case "pix-payment":
      return "Pagamento PIX";
    case "success":
      return "Pagamento realizado!";
    case "error":
      return "Erro no pagamento";
    default:
      return "";
  }
});

const qrCodeUrl = computed(() => {
  if (pixData.value?.qr_codes?.[0]?.links?.[0]?.href) {
    return pixData.value.qr_codes[0].links[0].href;
  }
  return null;
});
async function initiatePixPayment() {
  loading.value = true;
  error.value = null;

  try {
    const paymentRequest: PixPaymentRequest = {
      amount: props.amount,
      description: props.description,
      payer: props.payer,
    };

    pixData.value = await paymentService.createPixCheckout(paymentRequest);
    paymentStatus.value = pixData.value.status;
    step.value = "pix-payment";
    startStatusPolling();
  } catch (err: any) {
    error.value = err.message || "Erro ao gerar PIX";
    step.value = "error";
  } finally {
    loading.value = false;
  }
}

function startStatusPolling() {
  if (!pixData.value) return;

  const maxAttempts = 60; // 5 minutes
  const interval = 5000; // 5 seconds

  paymentService
    .pollPaymentStatus(
      pixData.value.id,
      (status) => {
        paymentStatus.value = status.status;
      },
      maxAttempts,
      interval
    )
    .then((finalStatus) => {
      if (finalStatus.status === "PAID") {
        step.value = "success";
        emit("success", finalStatus);
        showToast(
          "Pagamento confirmado! Obrigado pela sua contribuição.",
          "success"
        );
      }
    })
    .catch((err) => {
      error.value = err.message;
      step.value = "error";
      emit("error", err.message);
    });
}

function stopStatusPolling() {
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
    pollInterval.value = null;
  }
}

async function copyPixCode() {
  if (pixData.value?.qr_codes?.[0]?.text) {
    try {
      await navigator.clipboard.writeText(pixData.value.qr_codes[0].text);
      showToast("Código PIX copiado!", "success");
    } catch (err) {
      showToast("Erro ao copiar código", "error");
    }
  }
}

function getStatusMessage(status: PaymentStatus): string {
  const messages = {
    NEW: "Iniciando pagamento...",
    WAITING_PAYMENT: "Aguardando pagamento PIX",
    PAID: "Pagamento confirmado",
    FAILED: "Pagamento falhou",
    CANCELLED: "Pagamento cancelado",
    EXPIRED: "PIX expirado",
  };
  return messages[status] || status;
}

function resetPayment() {
  step.value = "payment-method";
  error.value = null;
  pixData.value = null;
  paymentStatus.value = "NEW";
  stopStatusPolling();
}

function handleClose() {
  stopStatusPolling();
  resetPayment();
  emit("update:modelValue", false);
}
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      stopStatusPolling();
    }
  }
);
</script>
