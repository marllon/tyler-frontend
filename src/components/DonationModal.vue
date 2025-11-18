<template>
  <BaseModal
    v-model="isOpen"
    title="Faça sua Doação"
    size="md"
    :closable="!processing"
  >
    <!-- Passo 1: Valor da Doação -->
    <div v-if="step === 1" class="space-y-6">
      <!-- Valores Sugeridos -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Escolha um valor
        </label>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="amount in suggestedAmounts"
            :key="amount"
            @click="selectAmount(amount)"
            :class="[
              'px-3 py-3 rounded-lg border-2 transition-all font-semibold text-sm',
              selectedAmount === amount
                ? 'border-tyler-pink bg-tyler-pink text-white'
                : 'border-gray-300 hover:border-tyler-pink hover:bg-pink-50',
            ]"
          >
            {{ formatCurrency(amount) }}
          </button>
        </div>
      </div>

      <!-- Valor Personalizado -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Ou digite um valor personalizado
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            R$
          </span>
          <input
            v-model="customAmountDisplay"
            type="text"
            placeholder="0,00"
            class="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
            @focus="selectedAmount = null"
            @input="handleCustomAmountInput"
          />
        </div>
        <p v-if="amountError" class="text-red-600 text-sm mt-1">
          {{ amountError }}
        </p>
      </div>

      <!-- Mensagem Opcional -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Mensagem (opcional)
        </label>
        <textarea
          v-model="formData.message"
          rows="3"
          placeholder="Deixe uma mensagem de apoio..."
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent resize-none"
          maxlength="500"
        ></textarea>
        <p class="text-gray-500 text-xs mt-1">
          {{ formData.message?.length || 0 }}/500
        </p>
      </div>

      <!-- Botões -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <BaseButton variant="secondary" full-width @click="closeModal">
          Cancelar
        </BaseButton>
        <BaseButton variant="primary" full-width @click="goToStep2">
          Continuar
        </BaseButton>
      </div>
    </div>

    <!-- Passo 2: Dados do Doador -->
    <div v-if="step === 2" class="space-y-6">
      <!-- Toggle Anônimo -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="formData.anonymous"
            type="checkbox"
            class="w-5 h-5 text-tyler-pink rounded focus:ring-2 focus:ring-tyler-pink"
          />
          <div>
            <span class="font-medium text-gray-900">Doar anonimamente</span>
            <p class="text-sm text-gray-600">
              Sua identidade não será divulgada publicamente
            </p>
          </div>
        </label>
      </div>

      <!-- Campos de Dados (apenas se não for anônimo) -->
      <div v-if="!formData.anonymous" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome completo *
          </label>
          <input
            v-model="formData.donor.name"
            type="text"
            placeholder="Seu nome"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            v-model="formData.donor.email"
            type="email"
            placeholder="seu@email.com"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            CPF (opcional)
          </label>
          <input
            v-model="formData.donor.document"
            @input="formatCPF"
            type="text"
            placeholder="000.000.000-00"
            maxlength="14"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
          />
        </div>
      </div>

      <!-- Resumo -->
      <div class="bg-gradient-to-r from-tyler-pink/10 to-tyler-blue/10 rounded-lg p-4 border border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600 font-medium">Valor da doação:</span>
          <span class="text-2xl font-bold text-tyler-pink">
            {{ formatCurrency(finalAmount) }}
          </span>
        </div>
        <p v-if="formData.message" class="text-sm text-gray-600 mt-2 italic">
          "{{ formData.message }}"
        </p>
      </div>

      <!-- Erros de Validação -->
      <div
        v-if="validationErrors.length > 0"
        class="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <ul class="text-sm text-red-600 space-y-1">
          <li v-for="(error, index) in validationErrors" :key="index">
            • {{ error }}
          </li>
        </ul>
      </div>

      <!-- Botões -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <BaseButton variant="secondary" full-width @click="step = 1">
          Voltar
        </BaseButton>
        <BaseButton
          variant="primary"
          full-width
          @click="processDonation"
          :disabled="processing"
        >
          <Spinner v-if="processing" class="w-5 h-5 mr-2" />
          {{ processing ? "Processando..." : "Confirmar Doação" }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { BaseModal, BaseButton, Spinner } from "@/components/ui";
import { useDonations, useCurrency } from "@/composables";
import type { DonationRequest } from "@/types";

interface Props {
  modelValue: boolean;
  goalId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const router = useRouter();
const { createDonation, validateDonationData, loading: processing } = useDonations();
const { formatCurrency } = useCurrency();
const step = ref(1);
const suggestedAmounts = [10, 25, 50, 100, 200, 500]; // Valores em reais
const selectedAmount = ref<number | null>(null);
const customAmount = ref<number | null>(null); // Valor em reais
const customAmountDisplay = ref<string>(""); // Valor formatado para exibição
const validationErrors = ref<string[]>([]);
const amountError = ref<string | null>(null);

const formData = ref<DonationRequest>({
  amount: 0,
  goalId: props.goalId,
  anonymous: false,
  message: "",
  donor: {
    name: "",
    email: "",
    document: "",
  },
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const finalAmount = computed(() => {
  if (customAmount.value !== null && customAmount.value > 0) {
    return customAmount.value;
  }
  return selectedAmount.value || 0;
});
watch([selectedAmount, customAmount], () => {
  amountError.value = null;
  if (selectedAmount.value && selectedAmount.value >= 1) {
    return;
  }
  if (customAmount.value !== null && customAmount.value !== undefined) {
    if (finalAmount.value > 0 && finalAmount.value < 1) {
      amountError.value = "Valor mínimo da doação é R$ 1,00";
    }
  }
});

function selectAmount(amount: number) {
  selectedAmount.value = amount;
  customAmount.value = null;
  customAmountDisplay.value = "";
  amountError.value = null;
}

function handleCustomAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  
  if (!value) {
    customAmount.value = null;
    customAmountDisplay.value = "";
    return;
  }
  value = value.replace(/\s/g, '');
  
  let numericValue: number;
  if (value.includes(',')) {
    const normalized = value.replace(/\./g, '').replace(',', '.');
    numericValue = parseFloat(normalized);
  } 
  else if (value.includes('.')) {
    const parts = value.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      numericValue = parseFloat(value);
    } 
    else {
      numericValue = parseFloat(value.replace(/\./g, ''));
    }
  }
  else {
    numericValue = parseFloat(value);
  }
  
  if (isNaN(numericValue)) {
    customAmount.value = null;
    customAmountDisplay.value = "";
    return;
  }
  customAmount.value = numericValue;
  
  console.log('Valor digitado:', input.value, '→ Valor numérico:', numericValue);
  customAmountDisplay.value = input.value;
}

function formatCPF(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  
  if (value.length > 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
  } else if (value.length > 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else if (value.length > 3) {
    value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  }
  
  formData.value.donor.document = value;
}

function goToStep2() {
  if (!finalAmount.value || finalAmount.value < 1) {
    amountError.value = "Selecione ou digite um valor válido (mínimo R$ 1,00)";
    return;
  }
  
  console.log('Valor final antes de salvar:', finalAmount.value);
  formData.value.amount = finalAmount.value;
  step.value = 2;
}

async function processDonation() {
  validationErrors.value = validateDonationData(formData.value);
  
  if (validationErrors.value.length > 0) {
    return;
  }

  try {
    const response = await createDonation(formData.value);
    router.push({
      name: "donation-payment",
      params: { id: response.id },
    });
    
    closeModal();
  } catch (error) {
    console.error("Erro ao processar doação:", error);
  }
}

function closeModal() {
  isOpen.value = false;
  setTimeout(() => {
    step.value = 1;
    selectedAmount.value = null;
    customAmount.value = null;
    customAmountDisplay.value = "";
    validationErrors.value = [];
    amountError.value = null;
    formData.value = {
      amount: 0,
      goalId: props.goalId,
      anonymous: false,
      message: "",
      donor: {
        name: "",
        email: "",
        document: "",
      },
    };
  }, 300);
}
</script>
