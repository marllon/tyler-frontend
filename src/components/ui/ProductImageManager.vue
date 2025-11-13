<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Gerenciar Imagens do Produto
      </h3>
      <div class="text-sm text-gray-500">
        {{ images.length }} {{ images.length === 1 ? "imagem" : "imagens" }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="images.length === 0" class="text-center py-8">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
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
      <p class="mt-2 text-gray-500">Nenhuma imagem adicionada ao produto</p>
    </div>

    <!-- Images Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(image, index) in images"
        :key="image.id || index"
        class="image-item relative group rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200"
        :class="{ 'ring-2 ring-blue-500': image.isMain }"
        @dragstart="onDragStart($event, index)"
        @dragover="onDragOver"
        @drop="onDrop($event, index)"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        draggable="true"
      >
        <!-- Image -->
        <div class="aspect-square relative">
          <img
            :src="getImageUrl(image)"
            :alt="image.alt || `Imagem ${index + 1}`"
            class="w-full h-full object-cover"
            @error="onImageError"
            @load="onImageLoad"
          />

          <!-- Loading Overlay -->
          <div
            v-if="loadingStates[index]"
            class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
          >
            <div class="spinner"></div>
          </div>

          <!-- Primary Badge -->
          <div v-if="image.isMain" class="absolute top-2 left-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              Principal
            </span>
          </div>

          <!-- Drag Handle -->
          <div
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div class="bg-white bg-opacity-75 rounded p-1">
              <svg
                class="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 8V4m0 0h4M4 4l4 4m8-8h4m0 0v4m0-4l-4 4M4 16v4m0 0h4m0-4l-4 4m16 0h-4m0 0v-4m4 4l-4-4"
                />
              </svg>
            </div>
          </div>

          <!-- Position Indicator -->
          <div class="absolute bottom-2 left-2">
            <span
              class="inline-block bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <div class="flex gap-2">
            <!-- Set as Primary -->
            <button
              v-if="!image.isMain"
              type="button"
              @click="setAsPrimary(index)"
              class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Definir como principal"
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>

            <!-- View Fullscreen -->
            <button
              type="button"
              @click="openImageViewer(index)"
              class="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Visualizar"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>

            <!-- Delete -->
            <button
              type="button"
              @click="confirmDelete(index)"
              class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Remover"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div
      v-if="images.length > 0"
      class="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div class="flex items-start">
        <svg
          class="w-5 h-5 text-blue-600 mt-0.5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="text-sm text-blue-800">
          <p class="font-medium">Dicas para gerenciar imagens:</p>
          <ul class="mt-1 space-y-1">
            <li>• Arraste e solte para reordenar as imagens</li>
            <li>
              • Clique no ícone de estrela para definir como imagem principal
            </li>
            <li>
              • A imagem principal aparecerá primeiro na galeria do produto
            </li>
            <li>• Use o ícone de visualização para ver em tela cheia</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-if="showDeleteModal" @close="cancelDelete">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900">Confirmar Remoção</h3>
      </template>

      <template #body>
        <p class="text-gray-600">
          Tem certeza que deseja remover esta imagem? Esta ação não pode ser
          desfeita.
        </p>

        <div v-if="imageToDelete !== null" class="mt-4">
          <img
            :src="getImageUrl(images[imageToDelete])"
            :alt="`Imagem ${imageToDelete + 1}`"
            class="w-32 h-32 object-cover rounded-lg mx-auto"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="cancelDelete"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="deleteImage"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Remover
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Image Viewer Modal -->
    <ImageGallery
      v-if="showImageViewer"
      :images="galleryImages"
      :initial-index="viewerIndex"
      @close="closeImageViewer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import type { ProductImage } from "@/types";
import BaseModal from "./BaseModal.vue";
import ImageGallery from "./ImageGallery.vue";

interface Props {
  images: ProductImage[];
  baseUrl?: string;
}

interface Emits {
  (e: "update:images", images: ProductImage[]): void;
  (e: "primary-changed", imageId: string | number): void;
  (e: "image-deleted", imageId: string | number): void;
  (e: "images-reordered", newOrder: ProductImage[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  baseUrl: "",
});

const emit = defineEmits<Emits>();

const loadingStates = reactive<Record<number, boolean>>({});
const showDeleteModal = ref(false);
const imageToDelete = ref<number | null>(null);
const showImageViewer = ref(false);
const viewerIndex = ref(0);
const draggedIndex = ref<number | null>(null);

const galleryImages = computed(() =>
  props.images.map((image) => ({
    id: image.id,
    url: getImageUrl(image),
    alt: image.alt || "Imagem do produto",
  }))
);

const getImageUrl = (image: ProductImage): string => {
  if (!image.url) return "";
  if (image.url.startsWith("http")) {
    return image.url;
  }
  if (props.baseUrl) {
    return `${props.baseUrl}${image.url.startsWith("/") ? "" : "/"}${
      image.url
    }`;
  }
  return image.url;
};

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTQwQzEyMi4wOTEgMTQwIDE0MCAxMjIuMDkxIDE0MCAxMDBDMTQwIDc3LjkwODYgMTIyLjA5MSA2MCAxMDAgNjBDNzcuOTA4NiA2MCA2MCA3Ny45MDg2IDYwIDEwMEM2MCAxMjIuMDkxIDc3LjkwODYgMTQwIDEwMCAxNDBaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iNCIvPgo8cGF0aCBkPSJNODUgOTVMMTAwIDExMEwxMTUgOTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==";
};

const onImageLoad = (event: Event) => {
};

const setAsPrimary = (index: number) => {
  const newImages = [...props.images];
  newImages.forEach((image) => (image.isMain = false));
  newImages[index].isMain = true;

  emit("update:images", newImages);
  emit("primary-changed", newImages[index].id);
};

const confirmDelete = (index: number) => {
  imageToDelete.value = index;
  showDeleteModal.value = true;
};

const deleteImage = () => {
  if (imageToDelete.value === null) return;

  const newImages = [...props.images];
  const deletedImage = newImages.splice(imageToDelete.value, 1)[0];
  if (deletedImage.isMain && newImages.length > 0) {
    newImages[0].isMain = true;
  }

  emit("update:images", newImages);
  emit("image-deleted", deletedImage.id);

  cancelDelete();
};

const cancelDelete = () => {
  imageToDelete.value = null;
  showDeleteModal.value = false;
};

const openImageViewer = (index: number) => {
  viewerIndex.value = index;
  showImageViewer.value = true;
};

const closeImageViewer = () => {
  showImageViewer.value = false;
  viewerIndex.value = 0;
};

const onDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", index.toString());
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const onDragEnter = (event: DragEvent) => {
  event.preventDefault();
};

const onDragLeave = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();

  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    draggedIndex.value = null;
    return;
  }

  const newImages = [...props.images];
  const draggedImage = newImages.splice(draggedIndex.value, 1)[0];
  newImages.splice(dropIndex, 0, draggedImage);

  emit("update:images", newImages);
  emit("images-reordered", newImages);

  draggedIndex.value = null;
};
</script>

<style scoped>

.image-item {
  transition: all 0.2s ease;
  cursor: grab;
}

.image-item:active {
  cursor: grabbing;
}

.image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-item.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.image-item.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .image-item .absolute.inset-0 {
    background-opacity: 20;
  }

  .image-item .absolute.inset-0 .flex {
    gap: 1rem;
  }

  .image-item .absolute.inset-0 button {
    padding: 0.75rem;
  }
}

.image-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.image-item button:focus {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
</style>
