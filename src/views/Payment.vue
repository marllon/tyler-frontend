<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <Spinner class="w-12 h-12 text-tyler-blue mb-4" />
        <p class="text-gray-600">Carregando informações do pagamento...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-white rounded-lg shadow-md p-8 text-center"
      >
        <svg
          class="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
          Erro ao carregar pagamento
        </h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <BaseButton @click="router.push('/')" variant="primary">
          Voltar para Início
        </BaseButton>
      </div>

      <!-- Payment Content -->
      <div v-else-if="order && payment" class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-tyler-blue/10 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-tyler-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Pagamento via PIX
              </h1>
              <p class="text-gray-600">Pedido: {{ order.orderNumber }}</p>
            </div>
          </div>

          <!-- Status Badge -->
          <div
            v-if="order.paymentStatus === 'PAID'"
            class="bg-green-100 border border-green-300 rounded-lg p-4 flex items-center gap-3"
          >
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="font-semibold text-green-900">Pagamento Confirmado!</p>
              <p class="text-sm text-green-700">
                Seu pedido está sendo processado
              </p>
            </div>
          </div>
        </div>

        <!-- QR Code Section -->
        <div
          v-if="order.paymentStatus === 'PENDING'"
          class="bg-white rounded-lg shadow-md p-8"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">
            Escaneie o QR Code para pagar
          </h2>

          <div class="flex flex-col items-center">
            <div class="bg-white p-4 rounded-lg border-2 border-gray-200 mb-6">
              <img
                v-if="payment.qrCodeImage"
                :src="payment.qrCodeImage"
                alt="QR Code PIX"
                class="w-64 h-64"
              />
              <div
                v-else
                class="w-64 h-64 bg-gray-100 flex items-center justify-center"
              >
                <p class="text-gray-500">QR Code não disponível</p>
              </div>
            </div>

            <p class="text-center text-gray-600 mb-6">
              Abra o app do seu banco e escaneie o QR Code acima para pagar
            </p>

            <!-- PIX Copia e Cola -->
            <div class="w-full max-w-md">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ou copie o código PIX:
              </label>
              <div class="flex gap-2">
                <input
                  type="text"
                  :value="payment.qrCode"
                  readonly
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <BaseButton
                  @click="copyPixCode"
                  variant="primary"
                  class="whitespace-nowrap"
                >
                  {{ copied ? "Copiado!" : "Copiar" }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-gray-900 mb-4">
            Informações do Pagamento
          </h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Valor:</span>
              <span class="font-semibold text-gray-900">{{
                formatCurrency(payment.amount)
              }}</span>
            </div>

            <div
              v-if="order.paymentStatus === 'PENDING'"
              class="flex justify-between"
            >
              <span class="text-gray-600">Expira em:</span>
              <span class="font-semibold text-gray-900">{{
                formatExpiration(payment.expiresAt)
              }}</span>
            </div>

            <div v-if="order.paidAt" class="flex justify-between">
              <span class="text-gray-600">Pago em:</span>
              <span class="font-semibold text-gray-900">{{
                formatDate(order.paidAt)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>

          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.productId"
              class="flex gap-4"
            >
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.productName"
                class="w-16 h-16 object-cover rounded"
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ item.productName }}</p>
                <p class="text-sm text-gray-600">
                  {{ item.quantity }}x {{ formatCurrency(item.unitPrice) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">
                  {{ formatCurrency(item.subtotal) }}
                </p>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{{ formatCurrency(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Frete:</span>
                <span>{{ formatCurrency(order.shippingCost) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>{{ formatCurrency(order.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Check -->
        <div
          v-if="order.paymentStatus === 'PENDING'"
          class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3"
        >
          <Spinner class="w-5 h-5 text-blue-600" />
          <p class="text-blue-900">Aguardando confirmação do pagamento...</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <BaseButton
            v-if="order.paymentStatus === 'PAID'"
            @click="router.push('/my-orders')"
            variant="primary"
            class="flex-1"
          >
            Ver Meus Pedidos
          </BaseButton>
          <BaseButton
            @click="router.push('/')"
            variant="secondary"
            class="flex-1"
          >
            Voltar para Início
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useCurrency, useDate } from "@/composables";
import { BaseButton, Spinner } from "@/components/ui";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { formatCurrency } = useCurrency();
const { formatDate } = useDate();

const loading = ref(true);
const error = ref("");
const order = ref<any>(null);
const payment = ref<any>(null);
const copied = ref(false);
let checkInterval: NodeJS.Timeout | null = null;

onMounted(async () => {
  await loadOrderDetails();
  startPaymentCheck();
});

onUnmounted(() => {
  if (checkInterval) clearInterval(checkInterval);
});

const loadOrderDetails = async () => {
  try {
    loading.value = true;
    error.value = "";

    const authToken = userStore.token;
    if (!authToken) {
      throw new Error("Você precisa estar autenticado");
    }

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
    const response = await fetch(
      `${API_BASE_URL}/orders/${route.params.orderId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!response.ok) {
      throw new Error("Pedido não encontrado");
    }

    const data = await response.json();
    order.value = data.order;
    payment.value = data.payment;
  } catch (err: any) {
    error.value = err.message || "Erro ao carregar dados do pagamento";
    console.error("Erro ao carregar pedido:", err);
  } finally {
    loading.value = false;
  }
};

const copyPixCode = () => {
  if (payment.value?.qrCode) {
    navigator.clipboard.writeText(payment.value.qrCode);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

const formatExpiration = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 0) return "Expirado";
  if (minutes < 60) return `${minutes} minutos`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}min`;
};

const startPaymentCheck = () => {
  checkInterval = setInterval(async () => {
    if (order.value?.paymentStatus === "PAID") {
      if (checkInterval) clearInterval(checkInterval);
      return;
    }

    await loadOrderDetails();

    if (order.value?.paymentStatus === "PAID") {
      if (checkInterval) clearInterval(checkInterval);
      router.push(`/order-confirmation/${order.value.orderNumber}`);
    }
  }, 5000); // Verifica a cada 5 segundos
};
</script>
