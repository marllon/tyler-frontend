import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Goal,
  GoalCreateRequest,
  GoalUpdateRequest,
  GoalFilters,
  GoalPageResponse,
  ApiError,
} from "@/types";
import {
  getGoals,
  getGoalById,
  createGoal as createGoalApi,
  updateGoal as updateGoalApi,
  deleteGoal as deleteGoalApi,
  uploadGoalImage,
  deleteGoalImage as deleteGoalImageApi,
  addAmountToGoal,
} from "@/services/goals";
import { useToast } from "@/composables";

export const useGoalsStore = defineStore("goals", () => {
  const goals = ref<Goal[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const pagination = ref({
    page: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
    nextCursor: null as string | null,
    previousCursor: null as string | null,
  });

  const { success: showSuccess, error: showError } = useToast();

  async function fetchGoals(filters?: GoalFilters): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response: GoalPageResponse = await getGoals(filters);

      goals.value = response.goals || [];

      pagination.value = {
        page: response.page,
        pageSize: response.pageSize,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious,
        nextCursor: null,
        previousCursor: null,
      };
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao carregar metas";
      console.error("Erro ao buscar metas:", apiError);
      showError("Erro ao carregar metas");
    } finally {
      loading.value = false;
    }
  }

  async function fetchGoalById(id: string): Promise<Goal | null> {
    const existingGoal = goals.value.find((goal) => goal.id === id);
    if (existingGoal) return existingGoal;

    try {
      const goal = await getGoalById(id);
      return goal;
    } catch (err) {
      console.error(`Erro ao buscar meta ${id}:`, err);
      return null;
    }
  }

  async function createGoal(data: GoalCreateRequest): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const newGoal = await createGoalApi(data);
      goals.value.unshift(newGoal);
      showSuccess("Meta criada com sucesso!");
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao criar meta";
      showError(error.value);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateGoal(
    id: string,
    data: GoalUpdateRequest
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const updatedGoal = await updateGoalApi(id, data);

      const index = goals.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        goals.value[index] = updatedGoal;
      }

      showSuccess("Meta atualizada com sucesso!");
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao atualizar meta";
      showError(error.value);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteGoal(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await deleteGoalApi(id);

      goals.value = goals.value.filter((g) => g.id !== id);

      showSuccess("Meta excluída com sucesso!");
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao excluir meta";
      showError(error.value);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function uploadImage(id: string, file: File): Promise<string | null> {
    loading.value = true;
    error.value = null;

    try {
      const result = await uploadGoalImage(id, file);

      const goal = goals.value.find((g) => g.id === id);
      if (goal) {
        goal.imageUrl = result.imageUrl;
      }

      showSuccess("Imagem enviada com sucesso!");
      return result.imageUrl;
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao fazer upload da imagem";
      showError(error.value);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function removeImage(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await deleteGoalImageApi(id);

      const goal = goals.value.find((g) => g.id === id);
      if (goal) {
        goal.imageUrl = undefined;
      }

      showSuccess("Imagem removida com sucesso!");
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao remover imagem";
      showError(error.value);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function addAmount(id: string, amount: number): Promise<boolean> {
    try {
      const updatedGoal = await addAmountToGoal(id, amount);

      const index = goals.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        goals.value[index] = updatedGoal;
      }

      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao adicionar valor à meta";
      return false;
    }
  }

  const activeGoals = computed(() =>
    goals.value.filter((goal) => goal.status === "ACTIVE" && goal.active)
  );

  const completedGoals = computed(() =>
    goals.value.filter((goal) => goal.status === "COMPLETED")
  );

  const pausedGoals = computed(() =>
    goals.value.filter((goal) => goal.status === "PAUSED")
  );

  function getProgressPercentage(goal: Goal): number {
    if (goal.targetAmount === 0) return 0;
    return Math.min(
      Math.round((goal.currentAmount / goal.targetAmount) * 100),
      100
    );
  }

  return {
    goals,
    loading,
    error,
    pagination,

    activeGoals,
    completedGoals,
    pausedGoals,

    fetchGoals,
    fetchGoalById,
    createGoal,
    updateGoal,
    deleteGoal,
    uploadImage,
    removeImage,
    addAmount,

    getProgressPercentage,
  };
});
