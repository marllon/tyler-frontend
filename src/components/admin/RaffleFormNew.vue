<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Título -->
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
        Título da Rifa *
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
        placeholder="Ex: Rifa do iPhone 15 Pro Max"
      />
    </div>

    <!-- Descrição -->
    <div>
      <label
        for="description"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Descrição *
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        required
        rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent resize-none"
        placeholder="Descreva detalhadamente o prêmio e as condições..."
      ></textarea>
    </div>

    <!-- Prêmio -->
    <div>
      <label for="prize" class="block text-sm font-medium text-gray-700 mb-1">
        Prêmio *
      </label>
      <input
        id="prize"
        v-model="formData.prize"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
        placeholder="Ex: iPhone 15 Pro Max 256GB"
      />
    </div>

    <!-- Preço e Quantidade -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Preço do Bilhete -->
      <div>
        <label
          for="ticketPrice"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Preço do Bilhete (R$) *
        </label>
        <PriceInput
          id="ticketPrice"
          v-model="formData.ticketPrice"
          placeholder="0,00"
          required
        />
      </div>

      <!-- Total de Bilhetes -->
      <div>
        <label
          for="totalTickets"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Total de Bilhetes *
        </label>
        <NumberInput
          id="totalTickets"
          v-model="formData.totalTickets"
          :min="1"
          placeholder="Ex: 1000"
          required
        />
      </div>
    </div>

    <!-- Datas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Data do Sorteio -->
      <div>
        <label
          for="drawDate"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Data do Sorteio *
        </label>
        <input
          id="drawDate"
          v-model="formData.drawDate"
          type="datetime-local"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
        />
      </div>

      <!-- Data de Expiração (Opcional) -->
      <div>
        <label
          for="expiresAt"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Prazo para Compra (Opcional)
        </label>
        <input
          id="expiresAt"
          v-model="formData.expiresAt"
          type="datetime-local"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
        />
        <p class="text-xs text-gray-500 mt-1">
          Se não informado, expira automaticamente na data do sorteio
        </p>
      </div>
    </div>

    <!-- Status (apenas em edição) -->
    <div v-if="raffle">
      <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
        Status
      </label>
      <select
        id="status"
        v-model="formData.status"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
      >
        <option value="ACTIVE">Ativo</option>
        <option value="ENDED">Encerrado</option>
        <option value="DRAWN">Sorteado</option>
        <option value="CANCELLED">Cancelado</option>
      </select>
    </div>

    <!-- Ativo -->
    <div class="flex items-center">
      <input
        id="active"
        v-model="formData.active"
        type="checkbox"
        class="h-4 w-4 text-tyler-pink focus:ring-tyler-pink border-gray-300 rounded"
      />
      <label for="active" class="ml-2 text-sm text-gray-700">
        Rifa ativa e visível publicamente
      </label>
    </div>

    <!-- Upload de Imagens -->
    <div v-if="raffle">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Imagens (até 10)
      </label>

      <!-- Preview das Imagens Existentes -->
      <div
        v-if="raffle.imageUrls && raffle.imageUrls.length > 0"
        class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4"
      >
        <div
          v-for="(imageUrl, index) in raffle.imageUrls"
          :key="index"
          class="relative group"
        >
          <img
            :src="imageUrl"
            :alt="`Imagem ${index + 1}`"
            class="w-full h-24 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            @click="$emit('deleteImage', index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remover imagem"
          >
            <svg
              class="w-4 h-4"
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
          <div
            class="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded"
          >
            {{ index === 0 ? "Principal" : `#${index + 1}` }}
          </div>
        </div>
      </div>

      <!-- Upload de Novas Imagens -->
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-tyler-pink transition-colors cursor-pointer"
        @click="$refs.fileInput?.click()"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
        <svg
          class="w-12 h-12 mx-auto text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p class="text-sm text-gray-600">Clique ou arraste imagens aqui</p>
        <p class="text-xs text-gray-500 mt-1">
          JPG, PNG ou WebP • Máx 5MB cada • Até 10 imagens
        </p>
      </div>

      <!-- Preview de Novas Imagens Selecionadas -->
      <div v-if="selectedFiles.length > 0" class="mt-4">
        <p class="text-sm font-medium text-gray-700 mb-2">
          Novas imagens selecionadas ({{ selectedFiles.length }}):
        </p>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="relative group"
          >
            <img
              :src="getFilePreview(file)"
              :alt="file.name"
              class="w-full h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              @click="removeSelectedFile(index)"
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                class="w-4 h-4"
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
        </div>
        <button
          type="button"
          @click="uploadNewImages"
          :disabled="uploading"
          class="mt-3 px-4 py-2 bg-tyler-pink text-white rounded-lg hover:bg-tyler-pink-dark disabled:opacity-50"
        >
          {{
            uploading
              ? "Enviando..."
              : `Enviar ${selectedFiles.length} imagem(ns)`
          }}
        </button>
      </div>
    </div>

    <!-- Botões -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        :disabled="!isValid"
        class="px-6 py-2 bg-tyler-pink text-white rounded-lg hover:bg-tyler-pink-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ raffle ? "Atualizar Rifa" : "Criar Rifa" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type {
  Raffle,
  RaffleCreateRequest,
  RaffleUpdateRequest,
  RaffleStatus,
} from "@/types";
import PriceInput from "@/components/ui/PriceInput.vue";
import NumberInput from "@/components/ui/NumberInput.vue";

const props = defineProps<{
  raffle?: Raffle | null;
}>();

const emit = defineEmits<{
  submit: [data: RaffleCreateRequest | RaffleUpdateRequest];
  cancel: [];
  uploadImages: [files: File[]];
  deleteImage: [index: number];
}>();
const formData = ref<RaffleCreateRequest & { status?: RaffleStatus }>({
  title: "",
  description: "",
  prize: "",
  ticketPrice: 0,
  totalTickets: 100,
  drawDate: "",
  expiresAt: "",
  active: true,
});
const selectedFiles = ref<File[]>([]);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const isValid = computed(() => {
  return (
    formData.value.title.trim() !== "" &&
    formData.value.description.trim() !== "" &&
    formData.value.prize.trim() !== "" &&
    formData.value.ticketPrice > 0 &&
    formData.value.totalTickets >= 1 &&
    formData.value.drawDate !== ""
  );
});
watch(
  () => props.raffle,
  (newRaffle) => {
    if (newRaffle) {
      formData.value = {
        title: newRaffle.title,
        description: newRaffle.description,
        prize: newRaffle.prize,
        ticketPrice: newRaffle.ticketPrice,
        totalTickets: newRaffle.totalTickets,
        drawDate: newRaffle.drawDate ? newRaffle.drawDate.substring(0, 16) : "",
        expiresAt: newRaffle.expiresAt
          ? newRaffle.expiresAt.substring(0, 16)
          : "",
        status: newRaffle.status,
        active: newRaffle.active,
      };
    }
  },
  { immediate: true }
);

function handleSubmit() {
  if (!isValid.value) return;

  const data: RaffleCreateRequest | RaffleUpdateRequest = {
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    prize: formData.value.prize.trim(),
    ticketPrice: formData.value.ticketPrice,
    totalTickets: formData.value.totalTickets,
    drawDate: new Date(formData.value.drawDate).toISOString(),
    expiresAt: formData.value.expiresAt
      ? new Date(formData.value.expiresAt).toISOString()
      : undefined,
    active: formData.value.active,
  };

  if (props.raffle && formData.value.status) {
    (data as RaffleUpdateRequest).status = formData.value.status;
  }

  emit("submit", data);
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    validateAndAddFiles(files);
  }
}

function handleDrop(event: DragEvent) {
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files);
    validateAndAddFiles(files);
  }
}

function validateAndAddFiles(files: File[]) {
  const validFiles = files.filter((file) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert(`Arquivo ${file.name} não é uma imagem válida (JPG, PNG ou WebP)`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(`Arquivo ${file.name} excede o tamanho máximo de 5MB`);
      return false;
    }

    return true;
  });
  const totalImages =
    (props.raffle?.imageUrls?.length || 0) +
    selectedFiles.value.length +
    validFiles.length;
  if (totalImages > 10) {
    alert(
      `Máximo de 10 imagens permitidas. Você já tem ${
        props.raffle?.imageUrls?.length || 0
      } imagens.`
    );
    return;
  }

  selectedFiles.value.push(...validFiles);
}

function removeSelectedFile(index: number) {
  selectedFiles.value.splice(index, 1);
}

function getFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

async function uploadNewImages() {
  if (selectedFiles.value.length === 0) return;

  uploading.value = true;
  try {
    emit("uploadImages", selectedFiles.value);
    selectedFiles.value = [];
  } finally {
    uploading.value = false;
  }
}
defineExpose({
  reset() {
    formData.value = {
      title: "",
      description: "",
      prize: "",
      ticketPrice: 0,
      totalTickets: 100,
      drawDate: "",
      expiresAt: "",
      active: true,
    };
    selectedFiles.value = [];
  },
});
</script>
