<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Breadcrumb -->
      <nav class="mb-8 text-sm text-gray-600">
        <RouterLink to="/" class="hover:text-tyler-blue">Início</RouterLink>
        <span class="mx-2">/</span>
        <span class="text-gray-900 font-medium">Checkout</span>
      </nav>

      <!-- Título -->
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      <!-- Verificar carrinho vazio -->
      <div
        v-if="cartStore.isEmpty"
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
          Seu carrinho está vazio
        </h2>
        <p class="text-gray-600 mb-6">
          Adicione produtos para continuar com a compra
        </p>
        <BaseButton @click="router.push('/products')" variant="primary">
          Ver Produtos
        </BaseButton>
      </div>

      <!-- Checkout Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulários -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Autenticação -->
          <div
            v-if="!userStore.isAuthenticated"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-2">
                  Entre ou cadastre-se para continuar
                </h3>
                <p class="text-sm text-gray-600 mb-4">
                  Para finalizar sua compra, você precisa estar autenticado.
                </p>
                <BaseButton @click="showLoginModal = true" variant="primary">
                  Entrar ou Criar Conta
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Dados de Entrega -->
          <div v-else class="bg-white rounded-lg shadow-md p-6">
            <h2
              class="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Dados de Entrega
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Nome e Telefone -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="shippingAddress.name"
                  label="Nome Completo"
                  placeholder="Seu nome completo"
                  required
                />
                <BaseInput
                  v-model="shippingAddress.phone"
                  label="Telefone/WhatsApp"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BaseInput
                  v-model="shippingAddress.zipCode"
                  label="CEP"
                  placeholder="00000-000"
                  required
                  @blur="searchZipCode"
                />
                <div class="md:col-span-2">
                  <BaseInput
                    v-model="shippingAddress.street"
                    label="Endereço"
                    placeholder="Rua, Avenida..."
                    required
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BaseInput
                  v-model="shippingAddress.number"
                  label="Número"
                  placeholder="123"
                  required
                />
                <div class="md:col-span-2">
                  <BaseInput
                    v-model="shippingAddress.complement"
                    label="Complemento"
                    placeholder="Apartamento, bloco..."
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BaseInput
                  v-model="shippingAddress.neighborhood"
                  label="Bairro"
                  placeholder="Centro"
                  required
                />
                <BaseInput
                  v-model="shippingAddress.city"
                  label="Cidade"
                  placeholder="São Paulo"
                  required
                />
                <BaseInput
                  v-model="shippingAddress.state"
                  label="Estado"
                  placeholder="SP"
                  maxlength="2"
                  required
                />
              </div>

              <BaseInput
                v-model="notes"
                label="Observações (opcional)"
                placeholder="Deixe alguma observação sobre sua compra..."
                :is-textarea="true"
                rows="3"
              />
            </form>
          </div>

          <!-- Informações de Frete -->
          <div
            v-if="userStore.isAuthenticated"
            class="bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <svg
                class="w-6 h-6 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="flex-1">
                <h3 class="font-semibold text-blue-900 mb-2">Sobre o Frete</h3>
                <p class="text-sm text-blue-800 mb-3">
                  O frete será pago no momento da entrega. Após a confirmação do
                  seu pedido, entraremos em contato para combinar o melhor
                  método de envio e calcular o valor final do frete.
                </p>
                <details class="text-sm">
                  <summary
                    class="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Como funciona?
                  </summary>
                  <ul
                    class="mt-3 space-y-2 text-blue-800 list-disc list-inside"
                  >
                    <li>Você finaliza o pedido sem pagar o frete</li>
                    <li>
                      Nossa equipe calcula o frete baseado no seu endereço
                    </li>
                    <li>Enviamos as opções de envio disponíveis</li>
                    <li>Você escolhe a melhor opção</li>
                    <li>O frete é pago no recebimento da mercadoria</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>

          <!-- Forma de Pagamento -->
          <div
            v-if="userStore.isAuthenticated"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h2
              class="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2"
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
              Forma de Pagamento
            </h2>

            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="
                  paymentMethod === method.value
                    ? 'border-tyler-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  type="radio"
                  :value="method.value"
                  v-model="paymentMethod"
                  class="mt-1"
                />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">
                    {{ method.label }}
                  </div>
                  <div class="text-sm text-gray-600 mt-1">
                    {{ method.description }}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Resumo do Pedido -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">
              Resumo do Pedido
            </h2>

            <!-- Produtos -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartStore.items"
                :key="item.product.id"
                class="flex gap-3"
              >
                <div
                  class="flex-shrink-0 w-16 h-16 rounded bg-gray-100 overflow-hidden"
                >
                  <img
                    v-if="getPrimaryImage(item.product)"
                    :src="getPrimaryImage(item.product)"
                    :alt="item.product.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    Qtd: {{ item.quantity }} ×
                    {{ formatCurrency(item.product.price) }}
                  </p>
                  <p class="text-sm font-semibold text-tyler-blue">
                    {{ formatCurrency(item.product.price * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="border-t pt-4 space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cartStore.itemCount }} itens)</span>
                <span>{{ formatCurrency(cartStore.summary.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Frete</span>
                <span class="text-sm">A pagar na entrega</span>
              </div>
              <div
                class="border-t pt-3 flex justify-between text-xl font-bold text-gray-900"
              >
                <span>Total</span>
                <span class="text-tyler-blue">
                  {{ formatCurrency(cartStore.summary.total) }}
                </span>
              </div>
            </div>

            <BaseButton
              v-if="userStore.isAuthenticated"
              @click="handleSubmit"
              variant="primary"
              size="lg"
              class="w-full mt-6"
              :disabled="submitting || !isFormValid"
            >
              <Spinner v-if="submitting" size="sm" class="mr-2" />
              Finalizar Pedido
            </BaseButton>

            <p class="text-xs text-gray-500 text-center mt-4">
              Ao finalizar o pedido, você concorda com nossos
              <a href="#" class="text-tyler-blue hover:underline"
                >termos e condições</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal
      :is-open="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useUserStore } from "@/stores/user";
import { useCurrency } from "@/composables/useCurrency";
import { useToast } from "@/composables/useToast";
import type { ShippingAddress, PaymentMethod, Product } from "@/types";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import Spinner from "@/components/ui/Spinner.vue";
import LoginModal from "@/components/LoginModal.vue";

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const { formatCurrency } = useCurrency();
const toast = useToast();

const showLoginModal = ref(false);
const submitting = ref(false);
const notes = ref("");

const shippingAddress = ref({
  name: "",
  phone: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
});

const paymentMethod = ref<PaymentMethod>("PIX");

const paymentMethods = [
  {
    value: "PIX" as PaymentMethod,
    label: "PIX",
    description: "Pagamento instantâneo via QR Code",
  },
  {
    value: "CREDIT_CARD" as PaymentMethod,
    label: "Cartão de Crédito",
    description: "Parcelamento em até 12x",
  },
  {
    value: "BOLETO" as PaymentMethod,
    label: "Boleto Bancário",
    description: "Vencimento em 3 dias úteis",
  },
];

const isFormValid = computed(() => {
  return (
    shippingAddress.value.name &&
    shippingAddress.value.phone &&
    shippingAddress.value.zipCode &&
    shippingAddress.value.street &&
    shippingAddress.value.number &&
    shippingAddress.value.neighborhood &&
    shippingAddress.value.city &&
    shippingAddress.value.state
  );
});

const getPrimaryImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const primary = product.images.find((img) => img.isPrimary);
    return primary?.url || product.images[0].url;
  }
  return `https://placehold.co/100x100/e5e7eb/6b7280?text=${encodeURIComponent(
    product.name.substring(0, 20)
  )}`;
};

const searchZipCode = async () => {
  const zipCode = shippingAddress.value.zipCode.replace(/\D/g, "");
  if (zipCode.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
    const data = await response.json();

    if (!data.erro) {
      shippingAddress.value.street = data.logradouro || "";
      shippingAddress.value.neighborhood = data.bairro || "";
      shippingAddress.value.city = data.localidade || "";
      shippingAddress.value.state = data.uf || "";
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
  }
};

const handleLoginSuccess = () => {
  toast.success("Login realizado com sucesso!");
};

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  if (!userStore.isAuthenticated) {
    toast.error("Você precisa estar autenticado para continuar");
    showLoginModal.value = true;
    return;
  }

  submitting.value = true;

  try {
    const authToken = userStore.token;

    if (!authToken) {
      throw new Error("Token de autenticação não encontrado");
    }

    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

    const orderData = {
      items: cartStore.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        name:
          shippingAddress.value.name ||
          userStore.user?.displayName ||
          "Cliente",
        phone: shippingAddress.value.phone,
        street: shippingAddress.value.street,
        number: shippingAddress.value.number,
        complement: shippingAddress.value.complement || undefined,
        neighborhood: shippingAddress.value.neighborhood,
        city: shippingAddress.value.city,
        state: shippingAddress.value.state,
        zipCode: shippingAddress.value.zipCode.replace(/\D/g, ""),
      },
      paymentMethod: paymentMethod.value,
      shippingMethod: "COLLECT_ON_DELIVERY",
      notes: notes.value || undefined,
    };

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao criar pedido");
    }

    const data = await response.json();
    cartStore.clearCart();
    router.push({
      name: "Payment",
      params: { orderId: data.order.id },
    });

    toast.success("Pedido criado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error);
    toast.error(error.message || "Erro ao processar pedido");
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  if (!userStore.authInitialized) {
    userStore.initAuth();
  }
});
</script>
