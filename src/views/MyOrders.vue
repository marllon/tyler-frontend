<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>

      <!-- Loading State -->
      <div
        v-if="loading && orders.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <Spinner class="w-12 h-12 text-tyler-blue mb-4" />
        <p class="text-gray-600">Carregando pedidos...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="orders.length === 0"
        class="bg-white rounded-lg shadow-md p-12 text-center"
      >
        <svg
          class="w-24 h-24 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
          Nenhum pedido encontrado
        </h2>
        <p class="text-gray-600 mb-6">Você ainda não realizou nenhuma compra</p>
        <BaseButton @click="router.push('/products')" variant="primary">
          Ver Produtos
        </BaseButton>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <!-- Filter Tabs -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex gap-2 overflow-x-auto">
            <button
              v-for="status in statusFilters"
              :key="status.value"
              @click="filterByStatus(status.value)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
                selectedStatus === status.value
                  ? 'bg-tyler-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <!-- Order Cards -->
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Order Header -->
          <div
            class="bg-gray-50 px-6 py-4 flex items-center justify-between border-b"
          >
            <div>
              <h3 class="font-semibold text-gray-900">
                {{ order.orderNumber }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <Badge :variant="getStatusVariant(order.status)">
              {{ translateStatus(order.status) }}
            </Badge>
          </div>

          <!-- Order Items -->
          <div class="p-6">
            <div class="space-y-4 mb-6">
              <div
                v-for="item in order.items"
                :key="item.productId"
                class="flex gap-4"
              >
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.productName"
                  class="w-20 h-20 object-cover rounded"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">
                    {{ item.productName }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    Quantidade: {{ item.quantity }} ×
                    {{ formatCurrency(item.unitPrice) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">
                    {{ formatCurrency(item.subtotal) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between text-gray-600 mb-2">
                <span>Subtotal:</span>
                <span>{{ formatCurrency(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600 mb-2">
                <span>Frete:</span>
                <span>{{ formatCurrency(order.shippingCost) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>{{ formatCurrency(order.total) }}</span>
              </div>
            </div>

            <!-- Shipping Info -->
            <div
              v-if="order.trackingCode"
              class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
            >
              <p class="text-sm font-medium text-blue-900 mb-1">
                Código de Rastreio:
              </p>
              <p class="font-mono text-blue-700">{{ order.trackingCode }}</p>
            </div>

            <!-- Payment Status -->
            <div class="mb-4">
              <Badge :variant="getPaymentStatusVariant(order.paymentStatus)">
                Pagamento: {{ translatePaymentStatus(order.paymentStatus) }}
              </Badge>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <BaseButton
                @click="viewDetails(order.id)"
                variant="primary"
                class="flex-1"
              >
                Ver Detalhes
              </BaseButton>

              <BaseButton
                v-if="canCancel(order.status)"
                @click="confirmCancel(order.id)"
                variant="danger"
                class="flex-1"
              >
                Cancelar Pedido
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="pagination.hasMore" class="text-center">
          <BaseButton @click="loadMore" :disabled="loading" variant="secondary">
            <Spinner v-if="loading" class="w-4 h-4 mr-2" />
            {{ loading ? "Carregando..." : "Carregar Mais" }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useCurrency, useDate, useToast } from "@/composables";
import { BaseButton, Badge, Spinner } from "@/components/ui";

const router = useRouter();
const userStore = useUserStore();
const { formatCurrency } = useCurrency();
const { formatDate } = useDate();
const { showToast } = useToast();

const orders = ref<any[]>([]);
const pagination = ref({ nextCursor: null as string | null, hasMore: false });
const loading = ref(false);
const selectedStatus = ref<string | null>(null);

const statusFilters = [
  { value: null, label: "Todos" },
  { value: "PENDING", label: "Pendente" },
  { value: "PAID", label: "Pago" },
  { value: "PROCESSING", label: "Processando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
];

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push("/");
    return;
  }
  loadOrders();
});

const loadOrders = async (cursor: string | null = null) => {
  try {
    loading.value = true;

    const token = await userStore.user?.getIdToken();
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

    let url = `${API_BASE_URL}/orders?limit=20`;
    if (cursor) url += `&cursor=${cursor}`;
    if (selectedStatus.value) url += `&status=${selectedStatus.value}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar pedidos");
    }

    const data = await response.json();

    if (cursor) {
      orders.value = [...orders.value, ...data.orders];
    } else {
      orders.value = data.orders;
    }

    pagination.value = data.pagination;
  } catch (error: any) {
    console.error("Erro ao carregar pedidos:", error);
    showToast(error.message || "Erro ao carregar pedidos", "error");
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (pagination.value.nextCursor) {
    loadOrders(pagination.value.nextCursor);
  }
};

const filterByStatus = (status: string | null) => {
  selectedStatus.value = status;
  orders.value = [];
  pagination.value = { nextCursor: null, hasMore: false };
  loadOrders();
};

const viewDetails = (orderId: string) => {
  router.push(`/payment/${orderId}`);
};

const canCancel = (status: string) => {
  return ["PENDING", "PROCESSING", "PAID"].includes(status);
};

const confirmCancel = async (orderId: string) => {
  if (!confirm("Tem certeza que deseja cancelar este pedido?")) {
    return;
  }

  try {
    const token = await userStore.user?.getIdToken();
    if (!token) {
      throw new Error("Você precisa estar autenticado");
    }

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao cancelar pedido");
    }

    showToast("Pedido cancelado com sucesso", "success");
    orders.value = [];
    await loadOrders();
  } catch (error: any) {
    console.error("Erro ao cancelar pedido:", error);
    showToast(error.message || "Erro ao cancelar pedido", "error");
  }
};

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    PENDING: "warning",
    PAID: "success",
    PROCESSING: "info",
    SHIPPED: "info",
    DELIVERED: "success",
    CANCELLED: "danger",
    REFUNDED: "warning",
  };
  return variants[status] || "default";
};

const getPaymentStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    PENDING: "warning",
    PAID: "success",
    FAILED: "danger",
    REFUNDED: "warning",
  };
  return variants[status] || "default";
};

const translateStatus = (status: string) => {
  const translations: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    PROCESSING: "Processando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
  };
  return translations[status] || status;
};

const translatePaymentStatus = (status: string) => {
  const translations: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    FAILED: "Falhou",
    REFUNDED: "Reembolsado",
  };
  return translations[status] || status;
};
</script>
