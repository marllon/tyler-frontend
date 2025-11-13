<template>
  <!-- Layout estilo Mercado Livre - TAMANHO REDUZIDO -->
  <div class="flex gap-4 min-h-[300px]">
    <!-- COLUNA ESQUERDA: Thumbnails + Upload -->
    <div class="w-20 flex flex-col space-y-2">
      <!-- Thumbnails das imagens existentes -->
      <div
        v-for="(image, index) in allImages"
        :key="image.id || index"
        class="relative aspect-square bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:border-blue-500"
        :class="{
          'border-blue-500': selectedIndex === index,
          'border-gray-200': selectedIndex !== index,
        }"
        @click="selectImage(index)"
      >
        <img
          :src="image.url"
          :alt="image.alt || `Imagem ${index + 1}`"
          class="w-full h-full object-cover"
        />

        <!-- Badge principal -->
        <div
          v-if="image.isPrimary || image.isMain || index === 0"
          class="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-2 h-2 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>

        <!-- Botão deletar -->
        <button
          @click.stop="deleteImage(index)"
          class="absolute -top-1 -left-1 w-5 h-5 bg-red-600 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700 z-10"
          title="Excluir imagem"
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
      </div>

      <!-- Botão de adicionar imagens -->
      <label
        for="image-upload"
        class="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <svg
          class="w-6 h-6 text-gray-400"
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
      </label>

      <!-- Input file oculto - com limite -->
      <input
        id="image-upload"
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        :max="maxFiles"
        class="hidden"
        @change="handleFileUpload"
      />
    </div>

    <!-- COLUNA DIREITA: Imagem principal - TAMANHO REDUZIDO -->
    <div class="flex-1 max-w-md">
      <!-- Imagem em foco - tamanho mais compacto -->
      <div
        v-if="selectedImage"
        class="relative aspect-[4/3] bg-white border-2 border-gray-200 rounded-lg overflow-hidden"
      >
        <img
          :src="selectedImage.url"
          :alt="selectedImage.alt || 'Imagem principal'"
          class="w-full h-full object-cover"
        />

        <!-- Overlay com informações -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4"
        >
          <div class="text-white">
            <p class="text-sm font-medium">
              Imagem {{ selectedIndex + 1 }} de {{ allImages.length }}
            </p>
            <div class="flex gap-2 mt-2">
              <button
                @click="setAsPrimary(selectedIndex)"
                class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                :class="{
                  'bg-blue-800':
                    selectedImage.isPrimary ||
                    selectedImage.isMain ||
                    selectedIndex === 0,
                }"
              >
                {{
                  selectedImage.isPrimary ||
                  selectedImage.isMain ||
                  selectedIndex === 0
                    ? "Principal"
                    : "Tornar Principal"
                }}
              </button>
              <button
                @click="deleteImage(selectedIndex)"
                class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vazio - tamanho mais compacto -->
      <div
        v-else
        class="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-6"
      >
        <svg
          class="w-12 h-12 text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
          />
        </svg>
        <h4 class="text-md font-medium text-gray-900 mb-2">
          Adicione imagens do produto
        </h4>
        <p class="text-gray-500 text-sm mb-3">
          Clique no botão + à esquerda para adicionar imagens
        </p>
        <label
          for="image-upload"
          class="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2"
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
          Adicionar
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface ImageData {
  id: string;
  url: string;
  isPrimary?: boolean;
  isMain?: boolean;
  alt?: string;
  file?: File;
}

interface Props {
  images: ImageData[];
  maxFiles?: number;
}

interface Emits {
  (e: "update:images", images: ImageData[]): void;
  (e: "primary-changed", imageId: string): void;
  (e: "image-deleted", imageId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 10,
});

const emit = defineEmits<Emits>();
const selectedIndex = ref(0);
const allImages = ref<ImageData[]>([...props.images]);
const isUploading = ref(false);
const selectedImage = computed(() => {
  return allImages.value[selectedIndex.value] || null;
});
watch(
  () => props.images,
  (newImages) => {
    allImages.value = [...newImages];
    if (selectedIndex.value >= allImages.value.length) {
      selectedIndex.value = Math.max(0, allImages.value.length - 1);
    }
  },
  { deep: true }
);
function selectImage(index: number) {
  selectedIndex.value = index;
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  isUploading.value = true;
  const newImages: ImageData[] = [];

  Array.from(files)
    .slice(0, Math.min(5, props.maxFiles - allImages.value.length))
    .forEach((file, index) => {
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `new-${Date.now()}-${index}`,
        url,
        alt: file.name,
        file,
        isPrimary: allImages.value.length === 0 && index === 0,
      });
    });

  allImages.value.push(...newImages);
  emit("update:images", allImages.value);
  if (newImages.length > 0) {
    selectedIndex.value = allImages.value.length - newImages.length;
  }
  target.value = "";
  isUploading.value = false;
}

function deleteImage(index: number) {
  const imageToDelete = allImages.value[index];
  if (!imageToDelete) return;
  allImages.value.splice(index, 1);
  if (selectedIndex.value >= allImages.value.length) {
    selectedIndex.value = Math.max(0, allImages.value.length - 1);
  }
  if (
    (imageToDelete.isPrimary || imageToDelete.isMain) &&
    allImages.value.length > 0
  ) {
    allImages.value[0].isPrimary = true;
    allImages.value[0].isMain = true;
    emit("primary-changed", allImages.value[0].id);
  }

  emit("image-deleted", imageToDelete.id);
  emit("update:images", allImages.value);
}

function setAsPrimary(index: number) {
  if (!allImages.value[index]) return;
  allImages.value.forEach((img) => {
    img.isPrimary = false;
    img.isMain = false;
  });
  allImages.value[index].isPrimary = true;
  allImages.value[index].isMain = true;

  emit("primary-changed", allImages.value[index].id);
  emit("update:images", allImages.value);
}
</script>

<style scoped>
.thumbnail-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.thumbnail-scroll::-webkit-scrollbar {
  width: 4px;
}

.thumbnail-scroll::-webkit-scrollbar-track {
  background: #f7fafc;
}

.thumbnail-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}
</style>
