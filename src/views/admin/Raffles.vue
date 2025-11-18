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

    <!-- Filtros e Busca -->
    <BaseCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Busca -->
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            v-model="filters.searchTerm"
            type="text"
            placeholder="Título, descrição ou prêmio..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="undefined">Todos</option>
            <option value="ACTIVE">Ativas</option>
            <option value="ENDED">Encerradas</option>
            <option value="DRAWN">Sorteadas</option>
            <option value="CANCELLED">Canceladas</option>
          </select>
        </div>

        <!-- Visibilidade -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Visibilidade
          </label>
          <select
            v-model="filters.active"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="undefined">Todas</option>
            <option :value="true">Apenas Visíveis</option>
            <option :value="false">Apenas Ocultas</option>
          </select>
        </div>

        <!-- Ordenar por -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            v-model="filters.sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
            @change="applyFilters"
          >
            <option value="createdAt">Data de Criação</option>
            <option value="drawDate">Data do Sorteio</option>
            <option value="ticketPrice">Preço do Bilhete</option>
            <option value="totalTickets">Total de Bilhetes</option>
          </select>
        </div>

        <!-- Direção -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Direção
          </label>
          <select
            v-model="filters.sortDirection"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
            @change="applyFilters"
          >
            <option value="DESC">Decrescente</option>
            <option value="ASC">Crescente</option>
          </select>
        </div>

        <!-- Items por página -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Itens por página
          </label>
          <select
            v-model.number="filters.pageSize"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <!-- Botão Limpar Filtros -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </BaseCard>

    <div v-if="rafflesStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando rifas..." />
    </div>

    <BaseCard v-else-if="rafflesStore.raffles.length > 0" padding="none">
      <div class="overflow-x-auto">
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
                Preço/Bilhetes
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Progresso
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Data Sorteio
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Visível
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
              >
                Ações
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
                  <div
                    v-else
                    class="w-12 h-12 rounded-lg bg-gray-200 mr-3 flex items-center justify-center"
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium">{{ raffle.title }}</div>
                    <div class="text-xs text-gray-500">{{ raffle.prize }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  {{ formatCurrency(raffle.ticketPrice) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ raffle.totalTickets }} bilhetes
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  {{ raffle.soldTickets }} / {{ raffle.totalTickets }}
                </div>
                <div class="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    class="bg-tyler-pink h-2 rounded-full"
                    :style="{
                      width: `${
                        (raffle.soldTickets / raffle.totalTickets) * 100
                      }%`,
                    }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">{{ formatDate(raffle.drawDate) }}</div>
              </td>
              <td class="px-6 py-4">
                <Badge :variant="getStatusVariant(raffle.status)">{{
                  raffle.status
                }}</Badge>
              </td>
              <td class="px-6 py-4">
                <Badge :variant="raffle.active ? 'success' : 'secondary'">
                  {{ raffle.active ? "Sim" : "Não" }}
                </Badge>
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
      </div>

      <!-- Paginação -->
      <div
        v-if="rafflesStore.pagination.totalPages > 1"
        class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
      >
        <div class="text-sm text-gray-600">
          Mostrando {{ rafflesStore.raffles.length }} de
          {{ rafflesStore.pagination.totalElements }} rifas
        </div>
        <div class="flex gap-2">
          <button
            @click="previousPage"
            :disabled="!rafflesStore.pagination.hasPrevious"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">
              Página {{ rafflesStore.pagination.page + 1 }} de
              {{ rafflesStore.pagination.totalPages }}
            </span>
          </div>
          <button
            @click="nextPage"
            :disabled="!rafflesStore.pagination.hasNext"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>
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
      :scrollable="true"
      :closable="true"
      :close-on-backdrop="false"
    >
      <RaffleFormNew
        :raffle="editingRaffle"
        @submit="handleFormSubmit"
        @cancel="closeFormModal"
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
import type {
  Raffle,
  RaffleCreateRequest,
  RaffleUpdateRequest,
  RaffleFilters,
  RaffleStatus,
} from "@/types";
import { useToast, useCurrency, useDate } from "@/composables";
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
const { formatCurrency } = useCurrency();
const { formatDate } = useDate();

const showFormModal = ref(false);
const editingRaffle = ref<Raffle | null>(null);
const showDrawModal = ref(false);
const drawingRaffle = ref<Raffle | null>(null);
const showDeleteModal = ref(false);
const deletingRaffle = ref<Raffle | null>(null);
const filters = ref<RaffleFilters>({
  page: 0,
  pageSize: 20,
  sortBy: "createdAt",
  sortDirection: "DESC",
  searchTerm: "",
  status: undefined,
  activeOnly: true, // Por padrão, mostrar apenas rifas ativas
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

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
function applyFilters() {
  filters.value.page = 0; // Reset para primeira página
  rafflesStore.fetchRaffles(filters.value);
}

function debouncedSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
}

function clearFilters() {
  filters.value = {
    page: 0,
    pageSize: 20,
    sortBy: "createdAt",
    sortDirection: "DESC",
    searchTerm: "",
    status: undefined,
    active: undefined,
  };
  rafflesStore.fetchRaffles(filters.value);
}

function nextPage() {
  if (rafflesStore.pagination.hasNext) {
    filters.value.page = (filters.value.page || 0) + 1;
    rafflesStore.fetchRaffles(filters.value);
  }
}

function previousPage() {
  if (rafflesStore.pagination.hasPrevious && filters.value.page! > 0) {
    filters.value.page = filters.value.page! - 1;
    rafflesStore.fetchRaffles(filters.value);
  }
}

async function handleFormSubmit(
  data: RaffleCreateRequest | RaffleUpdateRequest,
  files: File[]
) {
  if (editingRaffle.value) {
    await rafflesStore.updateRaffle(
      editingRaffle.value.id,
      data as RaffleUpdateRequest
    );
    if (files.length > 0) {
      await rafflesStore.uploadImages(editingRaffle.value.id, files);
    }
  } else {
    const newRaffle = await rafflesStore.createRaffle(
      data as RaffleCreateRequest
    );
    if (files.length > 0 && newRaffle) {
      await rafflesStore.uploadImages(newRaffle.id, files);
    }
  }
  closeFormModal();
  await rafflesStore.fetchRaffles(filters.value);
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
  await rafflesStore.fetchRaffles(filters.value);
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
  rafflesStore.fetchRaffles(filters.value);
});
</script>
