import { defineStore } from "pinia";
import { ref } from "vue";
import type { Raffle, ApiResponse } from "@/types";
import { api } from "@/utils/api";

// Dados dummy para demonstração
const DUMMY_RAFFLES: Raffle[] = [
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
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Usar dados dummy por enquanto
      raffles.value = DUMMY_RAFFLES;
      
      // TODO: Quando o backend estiver pronto, descomentar:
      // const response = await api.get<ApiResponse<Raffle[]>>("/raffles");
      // if (response.success && response.data) {
      //   raffles.value = response.data;
      // }
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
