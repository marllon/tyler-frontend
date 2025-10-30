import { defineStore } from "pinia";
import { ref } from "vue";
import type { Goal, ApiResponse } from "@/types";
import { api } from "@/utils/api";

// Dados dummy para demonstração
const DUMMY_GOALS: Goal[] = [
  {
    id: "1",
    title: "Tratamento Médico Especializado",
    description: "Arrecadação para consultas e exames médicos especializados para Tyler.",
    targetAmount: 15000,
    currentAmount: 8750,
    active: true,
    deadline: new Date(2024, 11, 31).toISOString(), // 31/12/2024
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Equipamento de Fisioterapia",
    description: "Compra de equipamentos para sessões de fisioterapia em casa.",
    targetAmount: 8000,
    currentAmount: 5200,
    active: true,
    deadline: new Date(2024, 10, 15).toISOString(), // 15/11/2024
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Medicamentos Mensais",
    description: "Custeio de medicamentos de uso contínuo por 6 meses.",
    targetAmount: 6000,
    currentAmount: 6000,
    active: true,
    deadline: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Adaptação da Casa",
    description: "Reformas para tornar a casa mais acessível e segura para Tyler.",
    targetAmount: 20000,
    currentAmount: 3500,
    active: true,
    deadline: new Date(2025, 2, 31).toISOString(), // 31/03/2025
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Material Escolar Adaptado",
    description: "Aquisição de material pedagógico adaptado para desenvolvimento de Tyler.",
    targetAmount: 4000,
    currentAmount: 2800,
    active: true,
    deadline: new Date(2025, 0, 31).toISOString(), // 31/01/2025
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Cadeira de Rodas Motorizada",
    description: "Meta especial para aquisição de cadeira de rodas motorizada de última geração.",
    targetAmount: 35000,
    currentAmount: 12500,
    active: true,
    deadline: new Date(2025, 5, 30).toISOString(), // 30/06/2025
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useGoalsStore = defineStore("goals", () => {
  const goals = ref<Goal[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchGoals() {
    loading.value = true;
    error.value = null;
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Usar dados dummy por enquanto
      goals.value = DUMMY_GOALS;
      
      // TODO: Quando o backend estiver pronto, descomentar:
      // const response = await api.get<ApiResponse<Goal[]>>("/goals");
      // if (response.success && response.data) {
      //   goals.value = response.data;
      // }
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar metas";
    } finally {
      loading.value = false;
    }
  }

  function getProgressPercentage(goal: Goal): number {
    if (goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  return {
    goals,
    loading,
    error,
    fetchGoals,
    getProgressPercentage,
  };
});
