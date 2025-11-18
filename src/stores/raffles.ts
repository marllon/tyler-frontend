import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  Raffle,
  RaffleFilters,
  RaffleCreateRequest,
  RaffleUpdateRequest,
  RaffleDrawRequest,
  RaffleDrawResponse,
} from "@/types";
import * as raffleService from "@/services/raffles";
import { useToast } from "@/composables/useToast";

export const useRafflesStore = defineStore("raffles", () => {
  const { success, error: showError } = useToast();

  const raffles = ref<Raffle[]>([]);
  const currentRaffle = ref<Raffle | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const activeRaffles = computed(() =>
    raffles.value.filter((r) => r.status === "ACTIVE" && r.active)
  );

  const endedRaffles = computed(() =>
    raffles.value.filter((r) => r.status === "ENDED")
  );

  const drawnRaffles = computed(() =>
    raffles.value.filter((r) => r.status === "DRAWN")
  );

  async function fetchRaffles(filters?: RaffleFilters) {
    loading.value = true;
    error.value = null;

    try {
      const response = await raffleService.getRaffles(filters);

      if (!response) {
        throw new Error("Resposta vazia do servidor");
      }

      raffles.value = response.raffles || [];

      pagination.value = {
        page: response.page ?? 0,
        pageSize: response.pageSize ?? 20,
        totalElements: response.totalElements ?? 0,
        totalPages: response.totalPages ?? 0,
        hasNext: response.hasNext ?? false,
        hasPrevious: response.hasPrevious ?? false,
      };

      return response;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar rifas";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchRaffleById(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const raffle = await raffleService.getRaffleById(id);
      currentRaffle.value = raffle;
      return raffle;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar rifa";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createRaffle(data: RaffleCreateRequest) {
    loading.value = true;
    error.value = null;

    try {
      const raffle = await raffleService.createRaffle(data);
      raffles.value.unshift(raffle);
      success("Rifa criada com sucesso!");
      return raffle;
    } catch (err: any) {
      error.value = err.message || "Erro ao criar rifa";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateRaffle(id: string, data: RaffleUpdateRequest) {
    loading.value = true;
    error.value = null;

    try {
      const updated = await raffleService.updateRaffle(id, data);
      const index = raffles.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        raffles.value[index] = updated;
      }
      if (currentRaffle.value?.id === id) {
        currentRaffle.value = updated;
      }
      success("Rifa atualizada com sucesso!");
      return updated;
    } catch (err: any) {
      error.value = err.message || "Erro ao atualizar rifa";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRaffle(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await raffleService.deleteRaffle(id);
      raffles.value = raffles.value.filter((r) => r.id !== id);
      if (currentRaffle.value?.id === id) {
        currentRaffle.value = null;
      }
      success("Rifa excluída com sucesso!");
    } catch (err: any) {
      error.value = err.message || "Erro ao excluir rifa";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function uploadImages(raffleId: string, files: File[]) {
    loading.value = true;
    error.value = null;

    try {
      const imageUrls = await raffleService.uploadRaffleImages(raffleId, files);
      const urlsArray = Array.isArray(imageUrls) ? imageUrls : [];

      const raffle = raffles.value.find((r) => r.id === raffleId);
      if (raffle) {
        raffle.imageUrls = [...(raffle.imageUrls || []), ...urlsArray];
      }
      if (currentRaffle.value?.id === raffleId) {
        currentRaffle.value.imageUrls = [
          ...(currentRaffle.value.imageUrls || []),
          ...urlsArray,
        ];
      }
      if (urlsArray.length > 0) {
        success(`${urlsArray.length} imagem(ns) enviada(s) com sucesso!`);
      }

      return urlsArray;
    } catch (err: any) {
      error.value = err.message || "Erro ao enviar imagens";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeImage(raffleId: string, imageIndex: number) {
    loading.value = true;
    error.value = null;

    try {
      await raffleService.deleteRaffleImage(raffleId, imageIndex);
      const raffle = raffles.value.find((r) => r.id === raffleId);
      if (raffle) {
        raffle.imageUrls.splice(imageIndex, 1);
      }
      if (currentRaffle.value?.id === raffleId) {
        currentRaffle.value.imageUrls.splice(imageIndex, 1);
      }
      success("Imagem removida com sucesso!");
    } catch (err: any) {
      error.value = err.message || "Erro ao remover imagem";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function drawRaffle(raffleId: string, revealEntropy: string) {
    loading.value = true;
    error.value = null;

    try {
      const request: RaffleDrawRequest = { revealEntropy };
      const result = await raffleService.drawRaffle(raffleId, request);

      await fetchRaffleById(raffleId);
      await fetchRaffles();

      success(
        `Sorteio realizado! Vencedor: Bilhete #${result.winnerTicketNumber}`
      );
      return result;
    } catch (err: any) {
      error.value = err.message || "Erro ao realizar sorteio";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function cancelRaffle(raffleId: string) {
    loading.value = true;
    error.value = null;

    try {
      await raffleService.cancelRaffle(raffleId);
      const raffle = raffles.value.find((r) => r.id === raffleId);
      if (raffle) {
        raffle.status = "CANCELLED";
        raffle.active = false;
      }
      if (currentRaffle.value?.id === raffleId) {
        currentRaffle.value.status = "CANCELLED";
        currentRaffle.value.active = false;
      }
      success("Rifa cancelada com sucesso!");
    } catch (err: any) {
      error.value = err.message || "Erro ao cancelar rifa";
      showError(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function getRemainingTickets(raffle: Raffle): number {
    return raffle.availableTickets || raffle.totalTickets - raffle.soldTickets;
  }

  function getProgressPercentage(raffle: Raffle): number {
    const percentage = (raffle.soldTickets / raffle.totalTickets) * 100;
    return Math.min(percentage, 100);
  }

  return {
    raffles,
    currentRaffle,
    loading,
    error,
    pagination,
    activeRaffles,
    endedRaffles,
    drawnRaffles,
    fetchRaffles,
    fetchRaffleById,
    createRaffle,
    updateRaffle,
    deleteRaffle,
    uploadImages,
    removeImage,
    drawRaffle,
    cancelRaffle,
    getRemainingTickets,
    getProgressPercentage,
  };
});
