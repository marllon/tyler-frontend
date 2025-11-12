<template>
  <div class="upload-container">
    <div
      class="upload-area"
      :class="uploadAreaClasses"
      @click="selectFiles"
      @drop.prevent="handleDrop"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
    >
      <div class="upload-content">
        <svg
          class="upload-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p class="upload-text">Clique ou arraste imagens aqui</p>
        <p class="upload-subtext">PNG, JPG, WebP até 5MB</p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      @change="handleFileSelect"
      style="display: none"
    />

    <div v-if="files.length" class="preview-grid">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="preview-item group"
      >
        <img :src="file.preview" :alt="file.name" class="preview-image" />
        <button @click="removeFile(index)" class="remove-btn">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface FileWithPreview extends File {
  preview: string;
}

const emit = defineEmits<{
  "files-selected": [files: File[]];
}>();

const fileInput = ref<HTMLInputElement>();
const files = ref<FileWithPreview[]>([]);
const dragOver = ref(false);

const uploadAreaClasses = computed(() => [
  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
  dragOver.value
    ? "border-blue-500 bg-blue-50"
    : "border-gray-300 hover:border-gray-400",
]);

function selectFiles() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    addFiles(Array.from(input.files));
  }
}

function handleDrop(event: DragEvent) {
  dragOver.value = false;
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
}

function addFiles(newFiles: File[]) {
  const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));

  imageFiles.forEach((file) => {
    const fileWithPreview = file as FileWithPreview;
    fileWithPreview.preview = URL.createObjectURL(file);
    files.value.push(fileWithPreview);
  });

  emit("files-selected", files.value);
}

function removeFile(index: number) {
  URL.revokeObjectURL(files.value[index].preview);
  files.value.splice(index, 1);
  emit("files-selected", files.value);
}
</script>

<style scoped>
.upload-container {
  @apply space-y-4;
}

.upload-icon {
  @apply w-12 h-12 mx-auto mb-4 text-gray-400;
}

.upload-text {
  @apply text-lg font-medium text-gray-700 mb-2;
}

.upload-subtext {
  @apply text-sm text-gray-500;
}

.preview-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.preview-item {
  position: relative;
}

.preview-image {
  @apply w-full h-24 object-cover rounded-lg border;
}

.remove-btn {
  @apply absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity;
}
</style>
