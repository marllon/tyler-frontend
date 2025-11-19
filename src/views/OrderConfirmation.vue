<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- Sucesso -->
      <div class="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
        <!-- Ícone de Sucesso -->
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
        >
          <svg
            class="w-12 h-12 text-green-600"
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
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-3">
          Pedido Realizado com Sucesso!
        </h1>

        <p class="text-lg text-gray-600 mb-6">
          Seu pedido foi registrado e em breve entraremos em contato.
        </p>

        <!-- Número do Pedido -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <p class="text-sm text-gray-600 mb-2">Número do Pedido</p>
          <p class="text-2xl font-bold text-tyler-blue">{{ orderId }}</p>
        </div>

        <!-- Informações do Pedido -->
        <div class="text-left border-t border-gray-200 pt-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Próximos Passos
          </h2>
          <ol class="space-y-4">
            <li class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-tyler-blue text-white rounded-full flex items-center justify-center font-semibold"
              >
                1
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Confirmação por Email</h3>
                <p class="text-sm text-gray-600">
                  Enviamos um email com os detalhes do seu pedido para
                  <strong>{{ userEmail }}</strong>
                </p>
              </div>
            </li>
            <li class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-tyler-blue text-white rounded-full flex items-center justify-center font-semibold"
              >
                2
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Cálculo do Frete</h3>
                <p class="text-sm text-gray-600">
                  Nossa equipe calculará o frete baseado no seu endereço e
                  enviará as opções disponíveis
                </p>
              </div>
            </li>
            <li class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-tyler-blue text-white rounded-full flex items-center justify-center font-semibold"
              >
                3
              </div>
              <div>
                <h3 class="font-medium text-gray-900">
                  Processamento do Pagamento
                </h3>
                <p class="text-sm text-gray-600">
                  Após a confirmação do frete, processaremos seu pagamento via
                  {{ paymentMethodLabel }}
                </p>
              </div>
            </li>
            <li class="flex gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 bg-tyler-blue text-white rounded-full flex items-center justify-center font-semibold"
              >
                4
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Envio e Entrega</h3>
                <p class="text-sm text-gray-600">
                  Você receberá o código de rastreamento assim que o pedido for
                  enviado
                </p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Ações -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton @click="router.push('/')" variant="secondary" size="lg">
            Voltar para Início
          </BaseButton>
          <BaseButton
            @click="router.push('/products')"
            variant="primary"
            size="lg"
          >
            Continuar Comprando
          </BaseButton>
        </div>

        <!-- Suporte -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            Alguma dúvida sobre seu pedido?
            <RouterLink
              to="/contact"
              class="text-tyler-blue hover:underline font-medium"
            >
              Entre em contato
            </RouterLink>
          </p>
        </div>
      </div>

      <!-- Detalhes (pode ser expandido com dados reais da API) -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Informações de Contato
        </h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Email:</span>
            <span class="font-medium">{{ userEmail }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">WhatsApp:</span>
            <a
              href="https://wa.me/5511999999999"
              class="font-medium text-tyler-blue hover:underline"
              target="_blank"
            >
              (11) 99999-9999
            </a>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Instagram:</span>
            <a
              href="https://instagram.com/tylerlimaeler"
              class="font-medium text-tyler-blue hover:underline"
              target="_blank"
            >
              @tylerlimaeler
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import BaseButton from "@/components/ui/BaseButton.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const orderId = computed(() => (route.params.orderId as string) || "N/A");
const userEmail = computed(() => userStore.user?.email || "não informado");
const paymentMethodLabel = computed(() => {
  const method = (route.query.paymentMethod as string) || "PIX";
  const labels: Record<string, string> = {
    PIX: "PIX",
    CREDIT_CARD: "Cartão de Crédito",
    DEBIT_CARD: "Cartão de Débito",
    BOLETO: "Boleto Bancário",
  };
  return labels[method] || method;
});

onMounted(() => {
  if (!userStore.authInitialized) {
    userStore.initAuth();
  }
});
</script>
