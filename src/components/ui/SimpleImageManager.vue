<template>
  <div class="space-y-4">
    <!-- Header com botão somente se há imagens -->
    <div v-if="images.length > 0" class="flex items-center justify-between">
      <h4 class="text-md font-medium text-gray-700">
        {{ images.length }} {{ images.length === 1 ? "imagem" : "imagens" }}
      </h4>
      <button
        @click="$emit('add-images')"
        class="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Adicionar Mais
      </button>
    </div>

    <!-- Empty State - mais compacto -->
    <div
      v-if="images.length === 0"
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
    >
      <svg
        class="mx-auto h-10 w-10 text-gray-400 mb-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p class="text-gray-500 text-lg mb-1">Nenhuma imagem adicionada</p>
      <p class="text-gray-400 text-sm">
        Use a seção abaixo para adicionar imagens
      </p>
    </div>

    <!-- Images Layout -->
    <div v-if="images.length > 0" class="space-y-4">
      <!-- Main Image - Tamanho mais compacto -->
      <div class="relative">
        <div
          class="relative aspect-[4/3] max-w-md bg-white rounded-lg border-2 border-gray-200 overflow-hidden group"
        >
          <img
            :src="primaryImage.url"
            :alt="primaryImage.alt || 'Imagem principal'"
            class="w-full h-full object-cover"
            @dragover.prevent
            @drop="handleDrop($event, 0)"
          />

          <!-- Primary Badge -->
          <div class="absolute top-3 left-3">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              Principal
            </span>
          </div>

          <!-- Delete Button - Melhor área clicável -->
          <button
            @click.stop="deleteImage(primaryImageIndex)"
            class="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 z-10"
            title="Excluir imagem"
          >
            <svg
              class="w-4 h-4 pointer-events-none"
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

          <!-- Drag Indicator -->
          <div
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200"
          >
            <div
              class="opacity-0 group-hover:opacity-100 text-white text-center"
            >
              <svg
                class="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <p class="text-sm">
                Arraste outra imagem aqui para torná-la principal
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Thumbnail Images -->
      <div v-if="otherImages.length > 0" class="space-y-2">
        <p class="text-sm font-medium text-gray-700">
          Outras imagens ({{ otherImages.length }})
        </p>
        <div class="grid grid-cols-6 gap-3">
          <div
            v-for="(image, index) in otherImages"
            :key="image.id || index"
            class="relative aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden group cursor-pointer"
            :draggable="true"
            @dragstart="handleDragStart($event, index + 1)"
            @dragover.prevent
            @drop="handleDrop($event, index + 1)"
            @click="setAsPrimary(index + 1)"
          >
            <img
              :src="image.url"
              :alt="image.alt || `Imagem ${index + 2}`"
              class="w-full h-full object-cover"
            />

            <!-- Delete Button - Melhor área clicável -->
            <button
              @click.stop="deleteImage(index + 1)"
              class="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 z-10"
              title="Excluir"
            >
              <svg
                class="w-3 h-3 pointer-events-none"
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

            <!-- Hover Overlay -->
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200"
            >
              <div
                class="opacity-0 group-hover:opacity-100 text-white text-center"
              >
                <svg
                  class="w-5 h-5 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <p class="text-xs mt-1">Tornar principal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ImageData {
  id: string;
  url: string;
  isPrimary?: boolean;
  isMain?: boolean;
  alt?: string;
}

interface Props {
  images: ImageData[];
}

interface Emits {
  (e: "update:images", images: ImageData[]): void;
  (e: "primary-changed", imageId: string): void;
  (e: "image-deleted", imageId: string): void;
  (e: "add-images"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed
const primaryImageIndex = computed(() => {
  return props.images.findIndex((img) => img.isPrimary || img.isMain) || 0;
});

const primaryImage = computed(() => {
  return props.images[primaryImageIndex.value] || props.images[0];
});

const otherImages = computed(() => {
  return props.images.filter((_, index) => index !== primaryImageIndex.value);
});

// Methods
function setAsPrimary(newIndex: number) {
  const newImages = [...props.images];

  // Remove primary from all images
  newImages.forEach((img) => {
    img.isPrimary = false;
    img.isMain = false;
  });

  // Set new primary
  if (newImages[newIndex]) {
    newImages[newIndex].isPrimary = true;
    newImages[newIndex].isMain = true;
    emit("primary-changed", newImages[newIndex].id);
  }

  emit("update:images", newImages);
}

function deleteImage(index: number) {
  const imageToDelete = props.images[index];
  if (!imageToDelete) return;

  const newImages = props.images.filter((_, i) => i !== index);

  // If we deleted the primary image, make the first one primary
  if (
    (imageToDelete.isPrimary || imageToDelete.isMain) &&
    newImages.length > 0
  ) {
    newImages[0].isPrimary = true;
    newImages[0].isMain = true;
    emit("primary-changed", newImages[0].id);
  }

  emit("image-deleted", imageToDelete.id);
  emit("update:images", newImages);
}

let draggedIndex = -1;

function handleDragStart(event: DragEvent, index: number) {
  draggedIndex = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
  }
}

function handleDrop(event: DragEvent, targetIndex: number) {
  event.preventDefault();

  if (draggedIndex === -1 || draggedIndex === targetIndex) return;

  // If dropping on the main image area (index 0), make the dragged image primary
  if (targetIndex === 0) {
    setAsPrimary(draggedIndex);
  } else {
    // Otherwise, just reorder
    const newImages = [...props.images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);
    emit("update:images", newImages);
  }

  draggedIndex = -1;
}
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
