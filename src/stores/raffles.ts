import { ref, computed } from 'vue';import { ref, computed } from 'vue';

import { defineStore } from 'pinia';import { defineStore } from "pinia";

import type {import type { Raffle, RaffleFilters, RaffleCreateRequest, RaffleUpdateRequest, RaffleDrawResponse } from '@/types';

  Raffle,import * as raffleService from "@/services/raffles";

  RaffleFilters,import { useToast } from "@/composables/useToast";

  RaffleCreateRequest,

  RaffleUpdateRequest,

  RaffleDrawRequest,

  RaffleDrawResponseexport const useRafflesStore = defineStore("raffles", () => {

} from '@/types';

import * as raffleService from '@/services/raffles';  const { success, showError } = useToast()  // State

import { useToast } from '@/composables/useToast';

  const raffles = ref<Raffle[]>([]);

export const useRafflesStore = defineStore('raffles', () => {  

  const { success, showError } = useToast();  const loading = ref(false);

  const raffles = ref<Raffle[]>([]);  const error = ref<string | null>(null);

  const currentRaffle = ref<Raffle | null>(null);

  const loading = ref(false);  const pagination = ref({

  const error = ref<string | null>(null);

  const pagination = ref({    page: 0,    page: 0,

    page: 0,

    pageSize: 20,    pageSize: 20,    pageSize: 10,

    totalElements: 0,

    totalPages: 0,    totalElements: 0,    totalElements: 0,

    hasNext: false,

    hasPrevious: false    totalPages: 0,    totalPages: 0,

  });

    hasNext: false,    hasNext: false,

  const activeRaffles = computed(() =>    hasPrevious: false,    hasPrevious: false

    raffles.value.filter((r) => r.status === 'ACTIVE' && r.active)

  );  });

  const endedRaffles = computed(() =>

    raffles.value.filter((r) => r.status === 'ENDED')

  );  // Computed  const { success, showError } = useToast();

  const drawnRaffles = computed(() =>  const activeRaffles = computed(() =>

    raffles.value.filter((r) => r.status === 'DRAWN')

  );    raffles.value.filter((r) => r.status === 'ACTIVE' && r.active)  // Computed

  async function fetchRaffles(filters?: RaffleFilters) {  

    loading.value = true;  const endedRaffles = computed(() => 

    error.value = null;

    raffles.value.filter((r) => r.status === 'ENDED')

    try {

      const response = await raffleService.getRaffles(filters);  );

      raffles.value = response.content;

  const drawnRaffles = computed(() =>  

      pagination.value = {    raffles.value.filter((r) => r.status === 'DRAWN')

        page: response.currentPage,

        pageSize: response.pageSize,  );

        totalElements: response.totalElements,

        totalPages: response.totalPages,  async function fetchRaffles(filters: RaffleFilters) {

        hasNext: response.currentPage < response.totalPages - 1,

        hasPrevious: response.currentPage > 0    loading.value = true  // Actions

      };

    error.value = null  async function fetchRaffles(filters?: RaffleFilters) {

      return response;

    } catch (err: any) {    try {    loading.value = true;

      error.value = err.message || 'Erro ao carregar rifas';

      showError(error.value);      const response = await raffleService.getRaffles(filters)    error.value = null;

      throw err;

    } finally {      raffles.value = response.raffles    try {

      loading.value = false;

    }      pagination.value = {      const response = await raffleService.getRaffles(filters);

  }

        page: response.page,      raffles.value = response.content;

  async function fetchRaffleById(id: string) {

    loading.value = true;        pageSize: response.pageSize,      

    error.value = null;

        totalElements: response.totalElements,      pagination.value = {

    try {

      const raffle = await raffleService.getRaffleById(id);        totalPages: response.totalPages,        page: response.currentPage,

      currentRaffle.value = raffle;

      return raffle;        hasNext: response.hasNext,        pageSize: response.pageSize,

    } catch (err: any) {

      error.value = err.message || 'Erro ao carregar rifa';        hasPrevious: response.hasPrevious,        totalElements: response.totalElements,

      showError(error.value);

      throw err;      }        totalPages: response.totalPages,

    } finally {

      loading.value = false;    } catch (err: any) {        hasNext: response.currentPage < response.totalPages - 1,

    }

  }      error.value = err.message || 'Erro ao carregar rifas'        hasPrevious: response.currentPage > 0

  async function createRaffle(data: RaffleCreateRequest) {      showError(error.value)      };

    loading.value = true;

    error.value = null;      throw err

    try {    } finally {      return response;

      const raffle = await raffleService.createRaffle(data);

      raffles.value.unshift(raffle);      loading.value = false    } catch (err: any) {

      success('Rifa criada com sucesso!');

      return raffle;    }      error.value = err.message || "Erro ao carregar rifas";

    } catch (err: any) {

      error.value = err.message || 'Erro ao criar rifa';  }      showError(error.value);

      showError(error.value);

      throw err;      throw err;

    } finally {

      loading.value = false;  async function fetchRaffleById(id: string) {    } finally {

    }

  }    loading.value = true      loading.value = false;

  async function updateRaffle(id: string, data: RaffleUpdateRequest) {    error.value = null    }

    loading.value = true;

    error.value = null;    try {  }

    try {      currentRaffle.value = await raffleService.getRaffleById(id)

      const updated = await raffleService.updateRaffle(id, data);

      const index = raffles.value.findIndex((r) => r.id === id);    } catch (err: any) {  async function fetchRaffleById(id: string) {

      if (index !== -1) {

        raffles.value[index] = updated;      error.value = err.message || 'Erro ao carregar rifa'    loading.value = true;

      }

      if (currentRaffle.value?.id === id) {      showError(error.value)    error.value = null;

        currentRaffle.value = updated;

      }      throw err    try {

      success('Rifa atualizada com sucesso!');

      return updated;    } finally {      const raffle = await raffleService.getRaffleById(id);

    } catch (err: any) {

      error.value = err.message || 'Erro ao atualizar rifa';      loading.value = false      currentRaffle.value = raffle;

      showError(error.value);

      throw err;    }      return raffle;

    } finally {

      loading.value = false;  }    } catch (err: any) {

    }

  }      error.value = err.message || "Erro ao carregar rifa";

  async function deleteRaffle(id: string) {  async function createRaffle(data: RaffleCreateRequest) {      showError(error.value);

    loading.value = true;

    error.value = null;    loading.value = true      throw err;

    try {    error.value = null    } finally {

      await raffleService.deleteRaffle(id);

      raffles.value = raffles.value.filter((r) => r.id !== id);    try {      loading.value = false;

      if (currentRaffle.value?.id === id) {

        currentRaffle.value = null;      const newRaffle = await raffleService.createRaffle(data)    }

      }

      success('Rifa excluída com sucesso!');      raffles.value.unshift(newRaffle)  }

    } catch (err: any) {

      error.value = err.message || 'Erro ao excluir rifa';      success('Rifa criada com sucesso!')

      showError(error.value);

      throw err;      return newRaffle  async function createRaffle(data: RaffleCreateRequest) {

    } finally {

      loading.value = false;    } catch (err: any) {    loading.value = true;

    }

  }      error.value = err.message || 'Erro ao criar rifa'    error.value = null;

  async function uploadImages(raffleId: string, files: File[]) {      showError(error.value)    try {

    loading.value = true;

    error.value = null;      throw err      const newRaffle = await raffleService.createRaffle(data);

    try {    } finally {      raffles.value.unshift(newRaffle);

      const imageUrls = await raffleService.uploadRaffleImages(raffleId, files);

      const raffle = raffles.value.find((r) => r.id === raffleId);      loading.value = false      success("Rifa criada com sucesso!");

      if (raffle) {

        raffle.imageUrls = [...raffle.imageUrls, ...imageUrls];    }      return newRaffle;

      }

      if (currentRaffle.value?.id === raffleId) {  }    } catch (err: any) {

        currentRaffle.value.imageUrls = [...currentRaffle.value.imageUrls, ...imageUrls];

      }      error.value = err.message || "Erro ao criar rifa";

      success(`${imageUrls.length} imagem(ns) enviada(s) com sucesso!`);

      return imageUrls;  async function updateRaffle(id: string, data: RaffleUpdateRequest) {      showError(error.value);

    } catch (err: any) {

      error.value = err.message || 'Erro ao enviar imagens';    loading.value = true      throw err;

      showError(error.value);

      throw err;    error.value = null    } finally {

    } finally {

      loading.value = false;    try {      loading.value = false;

    }

  }      const updatedRaffle = await raffleService.updateRaffle(id, data)    }

  async function removeImage(raffleId: string, imageIndex: number) {      const index = raffles.value.findIndex((r) => r.id === id)  }

    loading.value = true;

    error.value = null;      if (index !== -1) {

    try {        raffles.value[index] = updatedRaffle  async function updateRaffle(id: string, data: RaffleUpdateRequest) {

      await raffleService.deleteRaffleImage(raffleId, imageIndex);

      const raffle = raffles.value.find((r) => r.id === raffleId);      }    loading.value = true;

      if (raffle) {

        raffle.imageUrls.splice(imageIndex, 1);      if (currentRaffle.value?.id === id) {    error.value = null;

      }

      if (currentRaffle.value?.id === raffleId) {        currentRaffle.value = updatedRaffle    try {

        currentRaffle.value.imageUrls.splice(imageIndex, 1);

      }      }      const updatedRaffle = await raffleService.updateRaffle(id, data);

      success('Imagem removida com sucesso!');

    } catch (err: any) {      success('Rifa atualizada com sucesso!')      

      error.value = err.message || 'Erro ao remover imagem';

      showError(error.value);      return updatedRaffle      const index = raffles.value.findIndex(r => r.id === id);

      throw err;

    } finally {    } catch (err: any) {      if (index !== -1) {

      loading.value = false;

    }      error.value = err.message || 'Erro ao atualizar rifa'        raffles.value[index] = updatedRaffle;

  }

      showError(error.value)      }

  async function drawRaffle(raffleId: string, revealEntropy: string) {

    loading.value = true;      throw err      

    error.value = null;

    } finally {      if (currentRaffle.value?.id === id) {

    try {

      const request: RaffleDrawRequest = { revealEntropy };      loading.value = false        currentRaffle.value = updatedRaffle;

      const result = await raffleService.drawRaffle(raffleId, request);

          }      }

      await fetchRaffleById(raffleId);  }

      await fetchRaffles();

        async function deleteRaffle(id: string) {      return updatedRaffle;

      success(`Sorteio realizado! Vencedor: Bilhete #${result.winnerTicketNumber}`);

      return result;    loading.value = true    } catch (err: any) {

    } catch (err: any) {

      error.value = err.message || 'Erro ao realizar sorteio';    error.value = null      error.value = err.message || "Erro ao atualizar rifa";

      showError(error.value);

      throw err;    try {      showError(error.value);

    } finally {

      loading.value = false;      await raffleService.deleteRaffle(id)      throw err;

    }

  }      raffles.value = raffles.value.filter((r) => r.id !== id)    } finally {

  async function cancelRaffle(raffleId: string) {      if (currentRaffle.value?.id === id) {      loading.value = false;

    loading.value = true;

    error.value = null;        currentRaffle.value = null    }

    try {      }  }

      await raffleService.cancelRaffle(raffleId);

      const raffle = raffles.value.find((r) => r.id === raffleId);      success('Rifa excluída com sucesso!')

      if (raffle) {

        raffle.status = 'CANCELLED';    } catch (err: any) {  async function deleteRaffle(id: string) {

        raffle.active = false;

      }      error.value = err.message || 'Erro ao excluir rifa'    loading.value = true;

      if (currentRaffle.value?.id === raffleId) {

        currentRaffle.value.status = 'CANCELLED';      showError(error.value)    error.value = null;

        currentRaffle.value.active = false;

      }      throw err    try {

      success('Rifa cancelada com sucesso!');

    } catch (err: any) {    } finally {      await raffleService.deleteRaffle(id);

      error.value = err.message || 'Erro ao cancelar rifa';

      showError(error.value);      loading.value = false      raffles.value = raffles.value.filter(r => r.id !== id);

      throw err;

    } finally {    }      

      loading.value = false;

    }  }      if (currentRaffle.value?.id === id) {

  }

        currentRaffle.value = null;

  function getRemainingTickets(raffle: Raffle): number {  async function uploadImages(raffleId: string, files: File[]) {      }

    return raffle.availableTickets || raffle.totalTickets - raffle.soldTickets;

  }    loading.value = true

  function getProgressPercentage(raffle: Raffle): number {    error.value = null      success("Rifa deletada com sucesso!");

    const percentage = (raffle.soldTickets / raffle.totalTickets) * 100;

    return Math.min(percentage, 100);    try {    } catch (err: any) {

  }

      const urls = await raffleService.uploadRaffleImages(raffleId, files)      error.value = err.message || "Erro ao deletar rifa";

  return {

    raffles,

    currentRaffle,      if (raffle) {      throw err;

    loading,

    error,        raffle.imageUrls = [...(raffle.imageUrls || []), ...urls]    } finally {

    pagination,

    activeRaffles,

    endedRaffles,      if (currentRaffle.value?.id === raffleId) {    }

    drawnRaffles,

    fetchRaffles,

    fetchRaffleById,      }

    createRaffle,

    updateRaffle,      success('Imagens enviadas com sucesso!')  async function uploadImages(raffleId: string, files: File[]) {

    deleteRaffle,

    uploadImages,      return urls    loading.value = true;

    removeImage,

    drawRaffle,    } catch (err: any) {    error.value = null;

    cancelRaffle,

    getRemainingTickets,

    getProgressPercentage      showError(error.value)      const result = await raffleService.uploadRaffleImages(raffleId, files);

  };

});      throw err      

    } finally {      // Atualizar rifa com novas imagens

      loading.value = false      const index = raffles.value.findIndex(r => r.id === raffleId);

    }      if (index !== -1) {

  }        raffles.value[index].imageUrls = result.uploadedImages;

      }

  async function removeImage(raffleId: string, imageIndex: number) {      

    loading.value = true      if (currentRaffle.value?.id === raffleId) {

    error.value = null        currentRaffle.value.imageUrls = result.uploadedImages;

    try {      }

      await raffleService.deleteRaffleImage(raffleId, imageIndex)

      const raffle = raffles.value.find((r) => r.id === raffleId)      success(`${files.length} imagem(ns) enviada(s) com sucesso!`);

      if (raffle && raffle.imageUrls) {      return result;

        raffle.imageUrls.splice(imageIndex, 1)    } catch (err: any) {

      }      error.value = err.message || "Erro ao fazer upload de imagens";

      if (currentRaffle.value?.id === raffleId && currentRaffle.value.imageUrls) {      showError(error.value);

        currentRaffle.value.imageUrls.splice(imageIndex, 1)      throw err;

      }    } finally {

      success('Imagem removida com sucesso!')      loading.value = false;

    } catch (err: any) {    }

      error.value = err.message || 'Erro ao remover imagem'  }

      showError(error.value)

      throw err  async function removeImage(raffleId: string, imageIndex: number) {

    } finally {    loading.value = true;

      loading.value = false    error.value = null;

    }    try {

  }      await raffleService.deleteRaffleImage(raffleId, imageIndex);

  async function drawRaffle(raffleId: string, revealEntropy: string): Promise<RaffleDrawResponse> {      // Remover imagem do array local

    loading.value = true      const raffle = raffles.value.find(r => r.id === raffleId);

    error.value = null      if (raffle) {

    try {        raffle.imageUrls.splice(imageIndex, 1);

      const result = await raffleService.drawRaffle(raffleId, { revealEntropy })      }

      await fetchRaffleById(raffleId)      

      await fetchRaffles({ page: pagination.value.page, pageSize: pagination.value.pageSize })      if (currentRaffle.value?.id === raffleId) {

      success(`Sorteio realizado! Vencedor: Bilhete #${result.winnerTicketNumber}`)        currentRaffle.value.imageUrls.splice(imageIndex, 1);

      return result      }

    } catch (err: any) {

      error.value = err.message || 'Erro ao realizar sorteio'      success("Imagem removida com sucesso!");

      showError(error.value)    } catch (err: any) {

      throw err      error.value = err.message || "Erro ao remover imagem";

    } finally {      showError(error.value);

      loading.value = false      throw err;

    }    } finally {

  }      loading.value = false;

    }

  async function cancelRaffle(raffleId: string) {  }

    loading.value = true

    error.value = null  async function drawRaffle(raffleId: string, revealEntropy: string) {

    try {    loading.value = true;

      await raffleService.cancelRaffle(raffleId)    error.value = null;

      const raffle = raffles.value.find((r) => r.id === raffleId)    try {

      if (raffle) {      const result = await raffleService.drawRaffle(raffleId, { revealEntropy });

        raffle.status = 'CANCELLED'      

        raffle.active = false      // Atualizar rifa com resultado do sorteio

      }      await fetchRaffleById(raffleId);

      if (currentRaffle.value?.id === raffleId) {      await fetchRaffles(); // Recarregar lista

        currentRaffle.value.status = 'CANCELLED'

        currentRaffle.value.active = false      success(`Sorteio realizado! Vencedor: Bilhete #${result.winnerTicketNumber}`);

      }      return result;

      success('Rifa cancelada com sucesso!')    } catch (err: any) {

    } catch (err: any) {      error.value = err.message || "Erro ao realizar sorteio";

      error.value = err.message || 'Erro ao cancelar rifa'      showError(error.value);

      showError(error.value)      throw err;

      throw err    } finally {

    } finally {      loading.value = false;

      loading.value = false    }

    }  }

  }

  async function cancelRaffle(raffleId: string) {

  function getRemainingTickets(raffle: Raffle): number {    error.value = null;

    return raffle.availableTickets || raffle.totalTickets - raffle.soldTickets    try {

  }      await raffleService.cancelRaffle(raffleId);

  function getProgressPercentage(raffle: Raffle): number {      // Atualizar status local

    if (raffle.totalTickets === 0) return 0      const raffle = raffles.value.find(r => r.id === raffleId);

    return Math.min((raffle.soldTickets / raffle.totalTickets) * 100, 100)      if (raffle) {

  }        raffle.status = "CANCELLED";

        raffle.active = false;

  return {      }

    raffles,      if (currentRaffle.value?.id === raffleId) {

    currentRaffle,        currentRaffle.value.status = "CANCELLED";

    loading,        currentRaffle.value.active = false;

    error,      }

    pagination,

      success("Rifa cancelada com sucesso!");

    activeRaffles,      error.value = err.message || "Erro ao cancelar rifa";

    endedRaffles,      showError(error.value);

    drawnRaffles,      throw err;

    } finally {

    fetchRaffles,    }

    fetchRaffleById,  }

    createRaffle,

    updateRaffle,  // Utility functions

    deleteRaffle,  function getRemainingTickets(raffle: Raffle): number {

    uploadImages,    return raffle.availableTickets;

    removeImage,  }

    drawRaffle,

    cancelRaffle,  function getProgressPercentage(raffle: Raffle): number {

    if (raffle.totalTickets === 0) return 0;

    getRemainingTickets,  }

    getProgressPercentage,

  }  return {

})    // State

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

  {
    id: "1",
    title: "Rifa Especial - Smartphone Galaxy S24",
    description: "Concorra a um Samsung Galaxy S24 Ultra 256GB novinho em folha!",
    prize: "Samsung Galaxy S24 Ultra 256GB",
    ticketPrice: 10.00,
    totalTickets: 1000,
    soldTickets: 687,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"
    ],
    deadline: new Date(2024, 10, 30).toISOString(), // 30/11/2024
    committedEntropy: "abc123...",
    revealEntropy: null,
    winnerTicketNumber: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Rifa do Bem - Vale Compras R$ 1.000",
    description: "Vale compras de R$ 1.000 para usar em qualquer loja!",
    prize: "Vale Compras R$ 1.000",
    ticketPrice: 5.00,
    totalTickets: 500,
    soldTickets: 423,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
      "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=600",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
    ],
    deadline: new Date(2024, 11, 15).toISOString(), // 15/12/2024
    committedEntropy: "def456...",
    revealEntropy: null,
    winnerTicketNumber: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Mega Rifa - Notebook Gamer",
    description: "Notebook Gamer Acer Nitro 5 com RTX 3060 e 16GB RAM!",
    prize: "Notebook Gamer Acer Nitro 5",
    ticketPrice: 15.00,
    totalTickets: 800,
    soldTickets: 245,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600"
    ],
    deadline: new Date(2025, 0, 20).toISOString(), // 20/01/2025
    committedEntropy: "ghi789...",
    revealEntropy: null,
    winnerTicketNumber: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Rifa - Smart TV 50\"",
    description: "Smart TV Samsung 50\" 4K com tecnologia Crystal UHD!",
    prize: "Smart TV Samsung 50\" 4K",
    ticketPrice: 8.00,
    totalTickets: 600,
    soldTickets: 600,
    status: "ENDED",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600"
    ],
    deadline: new Date(2024, 9, 15).toISOString(), // 15/10/2024
    committedEntropy: "jkl012...",
    revealEntropy: "xyz999...",
    winnerTicketNumber: 347,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Rifa Tyler - Kit Supermercado",
    description: "Cesta completa de supermercado avaliada em R$ 500!",
    prize: "Kit Supermercado R$ 500",
    ticketPrice: 3.00,
    totalTickets: 300,
    soldTickets: 189,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600",
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=600"
    ],
    deadline: new Date(2024, 10, 25).toISOString(), // 25/11/2024
    committedEntropy: "mno345...",
    revealEntropy: null,
    winnerTicketNumber: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Super Rifa - iPhone 15 Pro",
    description: "iPhone 15 Pro 256GB Titânio Natural lacrado!",
    prize: "iPhone 15 Pro 256GB",
    ticketPrice: 20.00,
    totalTickets: 1500,
    soldTickets: 892,
    status: "ACTIVE",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
      "https://images.unsplash.com/photo-1695048133729-26a4df2f4d82?w=600",
      "https://images.unsplash.com/photo-1678652197950-75aadb12a4e9?w=600",
      "https://images.unsplash.com/photo-1592286927505-b95638b1b6e6?w=600",
      "https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=600"
    ],
    deadline: new Date(2025, 1, 14).toISOString(), // 14/02/2025
    committedEntropy: "pqr678...",
    revealEntropy: null,
    winnerTicketNumber: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useRafflesStore = defineStore("raffles", () => {
  const raffles = ref<Raffle[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRaffles() {
    loading.value = true;
    error.value = null;
    try {

      await new Promise(resolve => setTimeout(resolve, 700));

      raffles.value = DUMMY_RAFFLES;

    } catch (err: any) {
      error.value = err.message || "Erro ao carregar rifas";
    } finally {
      loading.value = false;
    }
  }

  function getRemainingTickets(raffle: Raffle): number {
    return raffle.totalTickets - raffle.soldTickets;
  }

  function getProgressPercentage(raffle: Raffle): number {
    if (raffle.totalTickets === 0) return 0;
    return Math.min((raffle.soldTickets / raffle.totalTickets) * 100, 100);
  }

  return {
    raffles,
    loading,
    error,
    fetchRaffles,
    getRemainingTickets,
    getProgressPercentage,
  };
});
