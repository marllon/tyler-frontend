<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- SEÇÃO DE IMAGEM -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3
        class="text-lg font-medium text-gray-900 mb-6 border-b border-gray-200 pb-3"
      >
        Imagem da Meta
      </h3>

      <div class="space-y-4">
        <!-- Preview da Imagem Atual -->
        <div
          v-if="form.imageUrl || previewUrl"
          class="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100"
        >
          <img
            :src="previewUrl || form.imageUrl"
            alt="Preview da meta"
            class="w-full h-full object-cover"
          />
          <button
            type="button"
            @click="removeImage"
            class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <svg
              class="w-5 h-5"
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
          </button>
        </div>

        <!-- Upload de Imagem -->
        <div
          v-else
          class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors"
        >
          <div class="space-y-1 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label
                for="file-upload"
                class="relative cursor-pointer bg-white rounded-md font-medium text-tyler-blue hover:text-blue-700 focus-within:outline-none"
              >
                <span>Upload uma imagem</span>
                <input
                  id="file-upload"
                  ref="fileInput"
                  type="file"
                  class="sr-only"
                  accept="image/jpeg,image/png,image/webp"
                  @change="handleFileSelect"
                />
              </label>
              <p class="pl-1">ou arraste e solte</p>
            </div>
            <p class="text-xs text-gray-500">PNG, JPG, WebP até 5MB</p>
          </div>
        </div>
      </div>
    </div>

    <!-- INFORMAÇÕES BÁSICAS -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3
        class="text-lg font-medium text-gray-900 mb-6 border-b border-gray-200 pb-3"
      >
        Informações Básicas
      </h3>

      <div class="space-y-6">
        <!-- Título -->
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Título da Meta *
          </label>
          <BaseInput
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Ex: Tratamento Médico Especializado"
            :error="errors.title"
          />
        </div>

        <!-- Descrição -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Descrição *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            placeholder="Descreva detalhadamente o objetivo desta meta..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Valores e Progresso -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Valor Alvo -->
          <div>
            <PriceInput
              v-model="form.targetAmount"
              label="Valor Alvo (R$) *"
              placeholder="0,00"
              :increments="[100, 500, 1000]"
              hint="Meta a ser atingida"
            />
            <p v-if="errors.targetAmount" class="mt-1 text-sm text-red-600">
              {{ errors.targetAmount }}
            </p>
          </div>

          <!-- Valor Arrecadado Atual -->
          <div>
            <PriceInput
              v-model="form.currentAmount"
              label="Valor Arrecadado (R$)"
              placeholder="0,00"
              :increments="[50, 100, 500]"
              hint="Valor já arrecadado (opcional)"
            />
          </div>
        </div>

        <!-- Datas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Data de Início -->
          <div>
            <label
              for="startDate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Data de Início
            </label>
            <input
              id="startDate"
              v-model="form.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="mt-1 text-xs text-gray-500">
              Deixe em branco para usar data atual
            </p>
          </div>

          <!-- Data de Término -->
          <div>
            <label
              for="endDate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Data de Término
            </label>
            <input
              id="endDate"
              v-model="form.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="mt-1 text-xs text-gray-500">
              Deixe em branco se não houver prazo
            </p>
          </div>
        </div>

        <!-- Status e Ativo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Status -->
          <div>
            <label
              for="status"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Status *
            </label>
            <select
              id="status"
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ACTIVE">Ativa (Aceita Doações)</option>
              <option value="PAUSED">Pausada</option>
              <option value="COMPLETED">Concluída</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          <!-- Meta Ativa (Visível) -->
          <div class="flex items-center pt-8">
            <input
              id="active"
              v-model="form.active"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="active" class="ml-2 block text-sm text-gray-900">
              Meta ativa (visível no site)
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <BaseButton type="button" variant="outline" @click="$emit('cancel')">
        Cancelar
      </BaseButton>
      <BaseButton type="submit" :loading="loading">
        {{ isEditing ? "Atualizar Meta" : "Criar Meta" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { BaseButton, BaseInput, PriceInput } from "@/components/ui";
import type { Goal, GoalCreateRequest, GoalUpdateRequest } from "@/types";

interface Props {
  initialData?: Goal | null;
  loading?: boolean;
}

interface Emits {
  (
    e: "submit",
    data: {
      goalData: GoalCreateRequest | GoalUpdateRequest;
      image: File | null;
    }
  ): void;
  (e: "cancel"): void;
  (e: "form-change"): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null,
  loading: false,
});

const emit = defineEmits<Emits>();

const isEditing = computed(() => !!props.initialData);

const form = reactive({
  title: "",
  description: "",
  targetAmount: 0,
  currentAmount: 0,
  startDate: "",
  endDate: "",
  status: "ACTIVE" as "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED",
  imageUrl: "",
  active: true,
});

const errors = reactive({
  title: "",
  targetAmount: "",
});

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.title = newData.title;
      form.description = newData.description;
      form.targetAmount = newData.targetAmount;
      form.currentAmount = newData.currentAmount;
      form.startDate = newData.startDate ? newData.startDate.split("T")[0] : "";
      form.endDate = newData.endDate ? newData.endDate.split("T")[0] : "";
      form.status = newData.status;
      form.imageUrl = newData.imageUrl || "";
      form.active = newData.active;
    }
  },
  { immediate: true }
);

watch(
  form,
  () => {
    emit("form-change");
  },
  { deep: true }
);

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Formato inválido. Use JPG, PNG ou WebP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande. Tamanho máximo: 5 MB");
      return;
    }

    selectedFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    emit("form-change");
  }
}

function removeImage() {
  selectedFile.value = null;
  previewUrl.value = null;
  form.imageUrl = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  emit("form-change");
}

function validate(): boolean {
  let isValid = true;

  if (!form.title.trim()) {
    errors.title = "Título é obrigatório";
    isValid = false;
  } else {
    errors.title = "";
  }

  if (form.targetAmount <= 0) {
    errors.targetAmount = "Valor alvo deve ser maior que zero";
    isValid = false;
  } else {
    errors.targetAmount = "";
  }

  return isValid;
}

function handleSubmit() {
  if (!validate()) {
    return;
  }

  const goalData: GoalCreateRequest | GoalUpdateRequest = {
    title: form.title,
    description: form.description,
    targetAmount: form.targetAmount,
    currentAmount: form.currentAmount || 0,
    startDate: form.startDate || undefined,
    endDate: form.endDate || undefined,
    status: form.status,
    active: form.active,
  };

  emit("submit", {
    goalData,
    image: selectedFile.value,
  });
}

defineExpose({
  reset: () => {
    form.title = "";
    form.description = "";
    form.targetAmount = 0;
    form.currentAmount = 0;
    form.startDate = "";
    form.endDate = "";
    form.status = "ACTIVE";
    form.imageUrl = "";
    form.active = true;
    selectedFile.value = null;
    previewUrl.value = null;
    errors.title = "";
    errors.targetAmount = "";
  },
});
</script>
