<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Metas de Arrecadação</h1>
        <p class="text-gray-600 mt-1">Gerencie as metas de arrecadação</p>
      </div>
      <div class="flex gap-2">
        <BaseButton @click="openCreateModal">
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
          Nova Meta
        </BaseButton>
      </div>
    </div>

    <!-- Filtros e Controles -->
    <div class="mb-6 space-y-4">
      <!-- Linha 1: Busca -->
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Campo de Busca -->
        <div class="flex-1">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              v-model="filters.searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="Buscar metas por título ou descrição..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Linha 2: Status, Ordenação e Info -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Filtro por Status -->
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="undefined">Todos os status</option>
            <option value="ACTIVE">Ativas</option>
            <option value="PAUSED">Pausadas</option>
            <option value="COMPLETED">Concluídas</option>
            <option value="CANCELLED">Canceladas</option>
          </select>

          <!-- Filtro Ativo/Inativo -->
          <select
            v-model="filters.activeOnly"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="undefined">Todos</option>
            <option :value="true">Apenas ativos</option>
            <option :value="false">Apenas inativos</option>
          </select>

          <!-- Ordenação -->
          <select
            v-model="filters.sortBy"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Data de criação</option>
            <option value="title">Título</option>
            <option value="targetAmount">Valor alvo</option>
            <option value="currentAmount">Valor arrecadado</option>
            <option value="endDate">Data de término</option>
          </select>
        </div>

        <!-- Info e Refresh -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">
            {{ goalsStore.goals.length }} metas
          </span>
          <BaseButton variant="outline" size="sm" @click="refreshGoals">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="goalsStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando metas..." />
    </div>

    <!-- Error State -->
    <div v-else-if="goalsStore.error" class="text-center py-16">
      <div class="text-red-600 mb-4">
        <svg
          class="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="text-lg font-medium">Erro ao carregar metas</p>
        <p class="text-gray-600 mt-1">{{ goalsStore.error }}</p>
      </div>
      <BaseButton @click="refreshGoals">Tentar Novamente</BaseButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="goalsStore.goals.length === 0" class="text-center py-16">
      <svg
        class="w-16 h-16 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Nenhuma meta encontrada
      </h3>
      <p class="text-gray-600 mb-6">
        Comece criando sua primeira meta de arrecadação.
      </p>
      <BaseButton @click="openCreateModal">Criar Primeira Meta</BaseButton>
    </div>

    <!-- Goals Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Meta
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Valor Alvo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Arrecadado
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Progresso
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prazo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="goal in goalsStore.goals"
              :key="goal.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <!-- Thumbnail da Imagem -->
                  <div
                    class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center shadow-sm"
                  >
                    <img
                      v-if="goal.imageUrl"
                      :src="goal.imageUrl"
                      :alt="goal.title"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else
                      class="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>

                  <!-- Info da Meta -->
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900">
                      {{ goal.title }}
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-md">
                      {{ goal.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(goal.targetAmount) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-tyler-blue"
              >
                {{ formatCurrency(goal.currentAmount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all"
                      :class="getProgressColor(goal.progress)"
                      :style="{ width: `${Math.min(goal.progress, 100)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-900 font-medium"
                    >{{ goal.progress }}%</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ goal.endDate ? formatDate(goal.endDate) : "Sem prazo" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getStatusVariant(goal.status)">
                  {{ getStatusLabel(goal.status) }}
                </Badge>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="editGoal(goal)"
                  class="text-tyler-blue hover:text-blue-700 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="deleteGoal(goal)"
                  class="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Rodapé de Paginação -->
    <div v-if="!goalsStore.loading && goalsStore.goals.length > 0" class="mt-6">
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <!-- Info de Metas -->
          <div class="text-sm text-gray-600">
            <span class="font-medium text-gray-900">{{
              goalsStore.goals.length
            }}</span>
            {{
              goalsStore.goals.length === 1
                ? "meta encontrada"
                : "metas encontradas"
            }}
            <span v-if="currentPage > 0" class="text-gray-500">
              · Página {{ currentPage + 1 }}
            </span>
          </div>

          <!-- Controles de Paginação -->
          <div class="flex items-center gap-2">
            <!-- Botão Anterior -->
            <BaseButton
              v-if="goalsStore.pagination.hasPrevious"
              variant="outline"
              size="sm"
              @click="goToPreviousPage"
              :disabled="goalsStore.loading"
            >
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Anterior
            </BaseButton>

            <!-- Botão Próximo -->
            <BaseButton
              v-if="goalsStore.pagination.hasNext"
              variant="outline"
              size="sm"
              @click="goToNextPage"
              :disabled="goalsStore.loading"
            >
              Próximo
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </BaseButton>
          </div>

          <!-- Tamanho da Página -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">Por página:</label>
            <select
              v-model.number="filters.pageSize"
              @change="changePageSize"
              class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal
      v-model="showModal"
      size="xl"
      scrollable
      :close-on-backdrop="false"
      :title="editingGoal ? 'Editar Meta' : 'Nova Meta'"
    >
      <div style="max-height: 70vh; overflow-y: auto; padding-right: 10px">
        <GoalFormNew
          ref="goalFormRef"
          :initial-data="editingGoal"
          :loading="saving"
          @submit="handleGoalSubmit"
          @cancel="closeModal"
          @form-change="onFormChange"
        />
      </div>
    </BaseModal>

    <!-- Modal de Confirmação para Sair -->
    <BaseModal v-model="showConfirmExit" size="sm" title="Confirmar Saída">
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4"
        >
          <svg
            class="h-6 w-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Você tem alterações não salvas
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          Se você sair agora, todas as alterações feitas serão perdidas. Deseja
          continuar?
        </p>
        <div class="flex justify-center gap-3">
          <BaseButton variant="outline" @click="cancelExit">
            Continuar Editando
          </BaseButton>
          <BaseButton variant="danger" @click="forceCloseModal">
            Sair sem Salvar
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Modal de Confirmação de Exclusão -->
    <BaseModal v-model="showDeleteConfirm" size="sm" title="Confirmar Exclusão">
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
        >
          <svg
            class="h-6 w-6 text-red-600"
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
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Excluir Meta</h3>
        <p class="text-sm text-gray-500 mb-2">
          Deseja realmente excluir a meta
        </p>
        <p class="text-sm font-medium text-gray-900 mb-6">
          "{{ goalToDelete?.title }}"?
        </p>
        <p class="text-xs text-gray-500 mb-6">
          Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-center gap-3">
          <BaseButton variant="outline" @click="cancelDelete">
            Cancelar
          </BaseButton>
          <BaseButton
            variant="danger"
            @click="confirmDelete"
            :loading="deleting"
          >
            Excluir Meta
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useGoalsStore } from "@/stores/goals";
import { useCurrency, useDate } from "@/composables";
import {
  BaseButton,
  BaseCard,
  BaseModal,
  Badge,
  Spinner,
} from "@/components/ui";
import GoalFormNew from "@/components/admin/GoalFormNew.vue";
import type {
  Goal,
  GoalCreateRequest,
  GoalUpdateRequest,
  GoalFilters,
  GoalStatus,
} from "@/types";

const goalsStore = useGoalsStore();
const { formatCurrency } = useCurrency();
const { formatDate } = useDate();

const showModal = ref(false);
const saving = ref(false);
const editingGoal = ref<Goal | null>(null);
const hasUnsavedChanges = ref(false);
const showConfirmExit = ref(false);
const goalFormRef = ref<InstanceType<typeof GoalFormNew> | null>(null);
const showDeleteConfirm = ref(false);
const goalToDelete = ref<Goal | null>(null);
const deleting = ref(false);
const currentPage = ref(0);

const filters = reactive<GoalFilters>({
  page: 0,
  pageSize: 20,
  sortBy: "createdAt",
  sortDirection: "DESC",
  activeOnly: undefined,
  status: undefined,
  searchTerm: "",
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
}

function getProgressColor(progress: number): string {
  if (progress >= 100) return "bg-green-600";
  if (progress >= 75) return "bg-blue-600";
  if (progress >= 50) return "bg-yellow-500";
  if (progress >= 25) return "bg-orange-500";
  return "bg-red-500";
}

function getStatusVariant(
  status: GoalStatus
): "success" | "warning" | "default" | "danger" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "PAUSED":
      return "warning";
    case "COMPLETED":
      return "default";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}

function getStatusLabel(status: GoalStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Ativa";
    case "PAUSED":
      return "Pausada";
    case "COMPLETED":
      return "Concluída";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
}

function openCreateModal() {
  editingGoal.value = null;
  hasUnsavedChanges.value = false;
  showModal.value = true;
}

function editGoal(goal: Goal) {
  editingGoal.value = goal;
  hasUnsavedChanges.value = false;
  showModal.value = true;
}

function closeModal() {
  if (hasUnsavedChanges.value) {
    showConfirmExit.value = true;
  } else {
    forceCloseModal();
  }
}

function forceCloseModal() {
  showModal.value = false;
  editingGoal.value = null;
  hasUnsavedChanges.value = false;
  showConfirmExit.value = false;
  goalFormRef.value?.reset();
}

function cancelExit() {
  showConfirmExit.value = false;
}

function onFormChange() {
  hasUnsavedChanges.value = true;
}

async function handleGoalSubmit({
  goalData,
  image,
}: {
  goalData: GoalCreateRequest | GoalUpdateRequest;
  image: File | null;
}) {
  saving.value = true;

  try {
    let success = false;

    if (editingGoal.value) {
      success = await goalsStore.updateGoal(editingGoal.value.id, goalData);

      if (success && image) {
        await goalsStore.uploadImage(editingGoal.value.id, image);
      }
    } else {
      success = await goalsStore.createGoal(goalData as GoalCreateRequest);

      if (success && image && goalsStore.goals[0]) {
        await goalsStore.uploadImage(goalsStore.goals[0].id, image);
      }
    }

    if (success) {
      hasUnsavedChanges.value = false;
      forceCloseModal();
      await refreshGoals();
    }
  } catch (error) {
    console.error("Erro ao salvar meta:", error);
  } finally {
    saving.value = false;
  }
}

async function deleteGoal(goal: Goal) {
  goalToDelete.value = goal;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!goalToDelete.value) return;

  deleting.value = true;
  try {
    await goalsStore.deleteGoal(goalToDelete.value.id);
    showDeleteConfirm.value = false;
    goalToDelete.value = null;
  } catch (error) {
    console.error("Erro ao excluir meta:", error);
  } finally {
    deleting.value = false;
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false;
  goalToDelete.value = null;
}

async function applyFilters() {
  currentPage.value = 0;
  filters.page = 0;
  await goalsStore.fetchGoals(filters);
}

async function refreshGoals() {
  await goalsStore.fetchGoals(filters);
}

async function goToNextPage() {
  if (!goalsStore.pagination.hasNext) return;

  currentPage.value++;
  filters.page = currentPage.value;

  await goalsStore.fetchGoals(filters);
}

async function goToPreviousPage() {
  if (currentPage.value <= 0) return;

  currentPage.value--;
  filters.page = currentPage.value;

  await goalsStore.fetchGoals(filters);
}

function changePageSize() {
  currentPage.value = 0;
  filters.page = 0;
  applyFilters();
}

onMounted(() => {
  goalsStore.fetchGoals(filters);
});
</script>
