<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Rifas</h1>
        <p class="text-gray-600 mt-1">
          Gerencie as rifas e sorteios verificaveis
        </p>
      </div>
      <BaseButton @click="openCreateModal" variant="primary">
        <svg
          class="w-5 h-5 mr-2"
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
        Nova Rifa
      </BaseButton>
    </div>

    <div v-if="rafflesStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando rifas..." />
    </div>

    <BaseCard v-else-if="rafflesStore.raffles.length > 0" padding="none">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Rifa
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
            >
              Acoes
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="raffle in rafflesStore.raffles"
            :key="raffle.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img
                  v-if="raffle.imageUrls?.[0]"
                  :src="raffle.imageUrls[0]"
                  :alt="raffle.title"
                  class="w-12 h-12 rounded-lg object-cover mr-3"
                />
                <div>
                  <div class="text-sm font-medium">{{ raffle.title }}</div>
                  <div class="text-xs text-gray-500">{{ raffle.prize }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <Badge :variant="getStatusVariant(raffle.status)">{{
                raffle.status
              }}</Badge>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                v-if="raffle.status === 'ENDED'"
                @click="openDrawModal(raffle)"
                class="text-green-600 hover:text-green-800"
              >
                Sortear
              </button>
              <button
                @click="editRaffle(raffle)"
                class="text-blue-600 hover:text-blue-800"
              >
                Editar
              </button>
              <button
                @click="confirmDelete(raffle)"
                class="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </BaseCard>

    <div v-else class="text-center py-16">
      <p class="text-gray-600">Nenhuma rifa encontrada</p>
      <BaseButton @click="openCreateModal" variant="primary" class="mt-4"
        >Criar Primeira Rifa</BaseButton
      >
    </div>

    <BaseModal
      v-model="showFormModal"
      :title="editingRaffle ? 'Editar Rifa' : 'Nova Rifa'"
      size="xl"
    >
      <RaffleFormNew
        :raffle="editingRaffle"
        @submit="handleFormSubmit"
        @cancel="closeFormModal"
        @upload-images="handleImageUpload"
        @delete-image="handleImageDelete"
      />
    </BaseModal>

    <BaseModal v-model="showDrawModal" title="Sortear Rifa" size="md">
      <div v-if="drawingRaffle" class="space-y-4">
        <p class="text-sm">
          <span class="font-semibold">Rifa:</span> {{ drawingRaffle.title }}
        </p>
        <div class="flex justify-end gap-3">
          <BaseButton @click="showDrawModal = false" variant="secondary"
            >Cancelar</BaseButton
          >
          <BaseButton @click="performDraw" variant="primary"
            >Confirmar Sorteio</BaseButton
          >
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="showDeleteModal" title="Excluir Rifa" size="sm">
      <div v-if="deletingRaffle" class="space-y-4">
        <p class="text-sm">
          Excluir <span class="font-semibold">{{ deletingRaffle.title }}</span
          >?
        </p>
        <div class="flex justify-end gap-3">
          <BaseButton @click="showDeleteModal = false" variant="secondary"
            >Cancelar</BaseButton
          >
          <BaseButton @click="performDelete" variant="danger"
            >Excluir</BaseButton
          >
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRafflesStore } from "@/stores/raffles";
import type { Raffle, RaffleCreateRequest, RaffleUpdateRequest } from "@/types";
import { useToast } from "@/composables";
import {
  BaseButton,
  BaseCard,
  BaseModal,
  Badge,
  Spinner,
} from "@/components/ui";
import RaffleFormNew from "@/components/admin/RaffleFormNew.vue";

const rafflesStore = useRafflesStore();
const { success } = useToast();

const showFormModal = ref(false);
const editingRaffle = ref<Raffle | null>(null);
const showDrawModal = ref(false);
const drawingRaffle = ref<Raffle | null>(null);
const showDeleteModal = ref(false);
const deletingRaffle = ref<Raffle | null>(null);

function openCreateModal() {
  editingRaffle.value = null;
  showFormModal.value = true;
}

function editRaffle(raffle: Raffle) {
  editingRaffle.value = raffle;
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
  editingRaffle.value = null;
}

async function handleFormSubmit(
  data: RaffleCreateRequest | RaffleUpdateRequest
) {
  if (editingRaffle.value) {
    await rafflesStore.updateRaffle(
      editingRaffle.value.id,
      data as RaffleUpdateRequest
    );
  } else {
    await rafflesStore.createRaffle(data as RaffleCreateRequest);
  }
  closeFormModal();
  await rafflesStore.fetchRaffles({});
}

async function handleImageUpload(files: File[]) {
  if (!editingRaffle.value) return;
  await rafflesStore.uploadImages(editingRaffle.value.id, files);
  await rafflesStore.fetchRaffleById(editingRaffle.value.id);
  editingRaffle.value = rafflesStore.currentRaffle;
}

async function handleImageDelete(index: number) {
  if (!editingRaffle.value || !confirm("Remover imagem?")) return;
  await rafflesStore.removeImage(editingRaffle.value.id, index);
  await rafflesStore.fetchRaffleById(editingRaffle.value.id);
  editingRaffle.value = rafflesStore.currentRaffle;
}

function openDrawModal(raffle: Raffle) {
  drawingRaffle.value = raffle;
  showDrawModal.value = true;
}

async function performDraw() {
  if (!drawingRaffle.value) return;
  const result = await rafflesStore.drawRaffle(
    drawingRaffle.value.id,
    drawingRaffle.value.committedEntropy || ""
  );
  success(`Vencedor: Bilhete #${result.winnerTicketNumber}`);
  showDrawModal.value = false;
  drawingRaffle.value = null;
  await rafflesStore.fetchRaffles({});
}

function confirmDelete(raffle: Raffle) {
  deletingRaffle.value = raffle;
  showDeleteModal.value = true;
}

async function performDelete() {
  if (!deletingRaffle.value) return;
  await rafflesStore.deleteRaffle(deletingRaffle.value.id);
  showDeleteModal.value = false;
  deletingRaffle.value = null;
  await rafflesStore.fetchRaffles({});
}

function getStatusVariant(status: string) {
  const map: Record<string, string> = {
    ACTIVE: "success",
    ENDED: "warning",
    DRAWN: "info",
    CANCELLED: "danger",
  };
  return map[status] || "default";
}

onMounted(() => {
  rafflesStore.fetchRaffles({});
});
</script>
