import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Goal, GoalFilters, GoalsResponse, ApiError } from "@/types";
import { api } from "@/utils/api";

// Dados dummy para fallback durante desenvolvimento
const DUMMY_GOALS: Goal[] = [
  {
    id: "1",
    title: "Tratamento Médico Especializado",
    description: "Arrecadação para consultas e exames médicos especializados para Tyler.",
    targetAmount: 1500000, // em centavos: R$ 15.000,00
    currentAmount: 875000,  // em centavos: R$ 8.750,00
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    endDate: new Date(2024, 11, 31).toISOString(), // 31/12/2024
    imageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    title: "Equipamento de Fisioterapia",
    description: "Compra de equipamentos para sessões de fisioterapia em casa.",
    targetAmount: 800000, // em centavos: R$ 8.000,00
    currentAmount: 520000, // em centavos: R$ 5.200,00
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    endDate: new Date(2024, 10, 15).toISOString(), // 15/11/2024
    imageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Medicamentos Mensais", 
    description: "Custeio de medicamentos de uso contínuo por 6 meses.",
    targetAmount: 600000, // em centavos: R$ 6.000,00
    currentAmount: 600000, // em centavos: R$ 6.000,00
    status: 'COMPLETED',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    imageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Adaptação da Casa",
    description: "Reformas para tornar a casa mais acessível e segura para Tyler.",
    targetAmount: 2000000, // em centavos: R$ 20.000,00
    currentAmount: 350000,  // em centavos: R$ 3.500,00
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    endDate: new Date(2025, 2, 31).toISOString(), // 31/03/2025
    imageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Material Escolar Adaptado", 
    description: "Aquisição de material pedagógico adaptado para desenvolvimento de Tyler.",
    targetAmount: 400000, // em centavos: R$ 4.000,00
    currentAmount: 280000, // em centavos: R$ 2.800,00
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    endDate: new Date(2025, 0, 31).toISOString(), // 31/01/2025
    imageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Cadeira de Rodas Motorizada",
    description: "Meta especial para aquisição de cadeira de rodas motorizada de última geração.",
    targetAmount: 3500000, // em centavos: R$ 35.000,00
    currentAmount: 1250000, // em centavos: R$ 12.500,00
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    endDate: new Date(2025, 5, 30).toISOString(), // 30/06/2025
    imageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useGoalsStore = defineStore("goals", () => {
  const goals = ref<Goal[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const useDummyData = ref(true); // Flag para controlar uso de dados dummy

  // Fetch goals with filters
  async function fetchGoals(filters: GoalFilters = {}) {
    loading.value = true;
    error.value = null;
    
    try {
      if (useDummyData.value) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Filtrar dados dummy baseado nos filtros
        let filteredGoals = DUMMY_GOALS;
        
        if (filters.active !== undefined) {
          filteredGoals = filteredGoals.filter(goal => 
            filters.active ? goal.status === 'ACTIVE' : goal.status !== 'ACTIVE'
          );
        }
        
        goals.value = filteredGoals;
      } else {
        // Usar API real
        const params = new URLSearchParams();
        if (filters.active !== undefined) params.append('active', filters.active.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
        
        const response = await api.get<GoalsResponse>(`/goals?${params.toString()}`);
        goals.value = response.goals || response.data || [];
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao carregar metas";
      console.error('Erro ao buscar metas:', apiError);
      
      // Em caso de erro, usar dados dummy como fallback
      if (useDummyData.value) {
        goals.value = DUMMY_GOALS;
      }
    } finally {
      loading.value = false;
    }
  }

  // Get goal by ID
  async function getGoalById(id: string): Promise<Goal | null> {
    // First check in current goals array
    const existingGoal = goals.value.find(goal => goal.id === id);
    if (existingGoal) return existingGoal;

    // If not found and using API, fetch from backend
    if (!useDummyData.value) {
      try {
        const goal = await api.get<Goal>(`/goals/${id}`);
        return goal;
      } catch (err) {
        console.error(`Erro ao buscar meta ${id}:`, err);
      }
    }

    // Fallback to dummy data
    return DUMMY_GOALS.find(goal => goal.id === id) || null;
  }

  // Create new goal (admin only)
  async function createGoal(goalData: Partial<Goal>): Promise<Goal | null> {
    if (useDummyData.value) {
      // Simulate API call with dummy data
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: goalData.title || '',
        description: goalData.description || '',
        targetAmount: goalData.targetAmount || 0,
        currentAmount: 0,
        status: 'ACTIVE',
        startDate: new Date().toISOString(),
        endDate: goalData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: goalData.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      goals.value.unshift(newGoal);
      return newGoal;
    } else {
      try {
        const newGoal = await api.post<Goal>('/goals', goalData);
        goals.value.unshift(newGoal);
        return newGoal;
      } catch (err) {
        const apiError = err as ApiError;
        error.value = apiError.message || "Erro ao criar meta";
        return null;
      }
    }
  }

  // Update goal progress (internal use, usually updated by donations)
  function updateGoalProgress(goalId: string, amount: number) {
    const goal = goals.value.find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount += amount;
      goal.updatedAt = new Date().toISOString();
      
      // Check if goal is completed
      if (goal.currentAmount >= goal.targetAmount && goal.status === 'ACTIVE') {
        goal.status = 'COMPLETED';
      }
    }
  }

  function getProgressPercentage(goal: Goal): number {
    if (goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  // Computed getters
  const activeGoals = computed(() => goals.value.filter(goal => goal.status === 'ACTIVE'));
  const completedGoals = computed(() => goals.value.filter(goal => goal.status === 'COMPLETED'));

  return {
    goals,
    loading,
    error,
    useDummyData,
    activeGoals,
    completedGoals,
    fetchGoals,
    getGoalById,
    createGoal,
    updateGoalProgress,
    getProgressPercentage,
  };
});
