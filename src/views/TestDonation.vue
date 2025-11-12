<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Sistema de Doações - Teste de Integração
        </h1>

        <!-- Status da API -->
        <div
          class="mb-8 p-4 rounded-lg"
          :class="
            healthStatus === 'healthy'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          "
        >
          <div class="flex items-center justify-between">
            <div>
              <h3
                class="font-medium"
                :class="
                  healthStatus === 'healthy' ? 'text-green-800' : 'text-red-800'
                "
              >
                Status da API Tyler
              </h3>
              <p
                class="text-sm mt-1"
                :class="
                  healthStatus === 'healthy' ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ healthMessage }}
              </p>
            </div>
            <button
              @click="checkApiHealth"
              :disabled="checkingHealth"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="
                healthStatus === 'healthy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              "
            >
              {{ checkingHealth ? "Verificando..." : "Verificar" }}
            </button>
          </div>
        </div>

        <!-- Formulário de Doação -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Valor da Doação (R$)
              </label>
              <BaseInput
                v-model="donationForm.amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="10.00"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Meta (opcional)
              </label>
              <select
                v-model="donationForm.goalId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Doação geral</option>
                <option
                  v-for="goal in activeGoals"
                  :key="goal.id"
                  :value="goal.id"
                >
                  {{ goal.title }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <BaseInput
                v-model="donationForm.donor.name"
                :required="!donationForm.anonymous"
                :disabled="donationForm.anonymous"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <BaseInput
                v-model="donationForm.donor.email"
                type="email"
                :required="!donationForm.anonymous"
                :disabled="donationForm.anonymous"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CPF (opcional)
            </label>
            <BaseInput
              v-model="donationForm.donor.document"
              placeholder="000.000.000-00"
              :disabled="donationForm.anonymous"
              @input="formatCpfInput"
            />
          </div>

          <div>
            <label class="flex items-center space-x-2">
              <input
                v-model="donationForm.anonymous"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">Doar anonimamente</span>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mensagem (opcional)
            </label>
            <textarea
              v-model="donationForm.message"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Deixe uma mensagem de apoio..."
            ></textarea>
          </div>

          <!-- Validation Errors -->
          <div
            v-if="validationErrors.length > 0"
            class="bg-red-50 border border-red-200 rounded-md p-4"
          >
            <h4 class="text-red-800 font-medium mb-2">
              Corrija os seguintes erros:
            </h4>
            <ul class="text-red-700 text-sm space-y-1">
              <li v-for="error in validationErrors" :key="error">
                • {{ error }}
              </li>
            </ul>
          </div>

          <div class="flex justify-end">
            <BaseButton
              type="submit"
              :loading="processing"
              :disabled="processing"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              {{ processing ? "Processando..." : "Doar com PIX" }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>

    <!-- PIX Payment Modal -->
    <PixPaymentModal
      v-model="showPaymentModal"
      :amount="donationAmountCents"
      :description="donationDescription"
      :payer="payerData"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import PixPaymentModal from "@/components/PixPaymentModal.vue";
import { useGoalsStore } from "@/stores/goals";
import { useDonations } from "@/composables/useDonations";
import { useToast } from "@/composables/useToast";
import { healthService } from "@/utils/services";
import type { DonationRequest, PaymentStatusResponse } from "@/types";

// Stores e composables
const goalsStore = useGoalsStore();
const {
  createDonation,
  handlePaymentSuccess: processPaymentSuccess,
  validateDonationData,
  formatDocument,
} = useDonations();
const { showToast } = useToast();

// State
const processing = ref(false);
const showPaymentModal = ref(false);
const checkingHealth = ref(false);
const healthStatus = ref<"healthy" | "unhealthy">("unhealthy");
const healthMessage = ref("");

// Form data
const donationForm = reactive<Partial<DonationRequest>>({
  amount: 0,
  goalId: "",
  anonymous: false,
  message: "",
  donor: {
    name: "",
    email: "",
    document: "",
  },
});

// Computed
const activeGoals = computed(() => goalsStore.activeGoals);

const validationErrors = computed(() => {
  if (donationForm.amount) {
    const amountCents = Math.round((donationForm.amount || 0) * 100);
    return validateDonationData({
      ...donationForm,
      amount: amountCents,
    });
  }
  return [];
});

const donationAmountCents = computed(() => {
  return Math.round((donationForm.amount || 0) * 100);
});

const donationDescription = computed(() => {
  const goal = activeGoals.value.find((g) => g.id === donationForm.goalId);
  const base = goal ? `Doação para: ${goal.title}` : "Doação solidária";
  return donationForm.message ? `${base} - ${donationForm.message}` : base;
});

const payerData = computed(() => ({
  name: donationForm.anonymous
    ? "Doador Anônimo"
    : donationForm.donor?.name || "Doador",
  email: donationForm.anonymous
    ? "anonimo@tyler.com"
    : donationForm.donor?.email || "",
  document: donationForm.anonymous
    ? "00000000000"
    : donationForm.donor?.document?.replace(/\D/g, "") || "00000000000",
}));

// Methods
async function checkApiHealth() {
  checkingHealth.value = true;
  try {
    const health = await healthService.checkHealth();
    healthStatus.value = health.status === "healthy" ? "healthy" : "unhealthy";
    healthMessage.value = health.message;
  } catch (error) {
    healthStatus.value = "unhealthy";
    healthMessage.value = "Não foi possível conectar com a API";
  } finally {
    checkingHealth.value = false;
  }
}

async function handleSubmit() {
  // Validate form
  const errors = validationErrors.value;
  if (errors.length > 0) {
    showToast("Corrija os erros no formulário", "error");
    return;
  }

  processing.value = true;
  showPaymentModal.value = true;
}

function handlePaymentSuccess(paymentData: PaymentStatusResponse) {
  processPaymentSuccess(paymentData, donationForm.goalId);
  showPaymentModal.value = false;
  resetForm();
}

function handlePaymentError(error: string) {
  showToast(error, "error");
  showPaymentModal.value = false;
  processing.value = false;
}

function formatCpfInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, "");
  if (value.length <= 11) {
    donationForm.donor!.document = formatDocument(value);
  }
}

function resetForm() {
  Object.assign(donationForm, {
    amount: 0,
    goalId: "",
    anonymous: false,
    message: "",
    donor: {
      name: "",
      email: "",
      document: "",
    },
  });
  processing.value = false;
}

// Lifecycle
onMounted(() => {
  goalsStore.fetchGoals({ active: true });
  checkApiHealth();
});
</script>
