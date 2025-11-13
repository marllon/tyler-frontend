import { defineStore } from "pinia";
import { ref } from "vue";
import type { Event, ApiResponse } from "@/types";
import { api } from "@/utils/api";
const DUMMY_EVENTS: Event[] = [
  {
    id: "1",
    title: "Bazar Beneficente de Natal",
    description: "Grande bazar com roupas, brinquedos e artigos diversos. Toda renda será revertida para o Projeto Tyler. Venha participar e ajudar!",
    date: new Date(2024, 11, 10, 14, 0).toISOString(), // 10/12/2024 14:00
    location: "Centro Comunitário do Bairro - Rua das Flores, 123",
    coverImageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600",
    gallery: [],
    status: "UPCOMING",
    maxParticipants: 200,
    registeredParticipants: 87,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Caminhada Tyler",
    description: "Caminhada de 5km no parque com o objetivo de conscientizar e arrecadar fundos. Inscrições abertas!",
    date: new Date(2024, 10, 20, 8, 0).toISOString(), // 20/11/2024 08:00
    location: "Parque Municipal - Portão Principal",
    coverImageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600",
    gallery: [],
    status: "UPCOMING",
    maxParticipants: 500,
    registeredParticipants: 342,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Show Beneficente",
    description: "Noite de música e solidariedade com apresentações de artistas locais. Ingressos solidários a partir de R$ 20.",
    date: new Date(2025, 0, 15, 20, 0).toISOString(), // 15/01/2025 20:00
    location: "Teatro Municipal - Av. Central, 456",
    coverImageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600",
    gallery: [],
    status: "UPCOMING",
    maxParticipants: 300,
    registeredParticipants: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Festa Junina 2024",
    description: "Nossa festa junina foi um sucesso! Mais de 400 pessoas participaram e arrecadamos R$ 8.500 para o projeto. Confira as fotos!",
    date: new Date(2024, 5, 15, 18, 0).toISOString(), // 15/06/2024 18:00
    location: "Quadra da Escola Municipal",
    coverImageUrl: "https://images.unsplash.com/photo-1561489413-985b06da5bee?w=600",
    gallery: [
      "https://images.unsplash.com/photo-1561489396-888724a1543d?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"
    ],
    status: "COMPLETED",
    maxParticipants: 500,
    registeredParticipants: 437,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Palestra sobre Inclusão",
    description: "Palestra gratuita sobre inclusão e acessibilidade ministrada por especialistas. Aberto ao público.",
    date: new Date(2024, 11, 5, 19, 0).toISOString(), // 05/12/2024 19:00
    location: "Auditório da Biblioteca Municipal",
    coverImageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600",
    gallery: [],
    status: "UPCOMING",
    maxParticipants: 100,
    registeredParticipants: 68,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Aniversário do Tyler - Festa 5 Anos",
    description: "Festa de aniversário do Tyler com muita diversão e alegria! Foi um dia inesquecível com amigos e familiares.",
    date: new Date(2024, 7, 20, 15, 0).toISOString(), // 20/08/2024 15:00
    location: "Salão de Festas Alegria",
    coverImageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
    gallery: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400"
    ],
    status: "COMPLETED",
    maxParticipants: 80,
    registeredParticipants: 75,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
    title: "Feijoada Beneficente",
    description: "Almoço especial com feijoada completa. Ingressos antecipados R$ 35 por pessoa.",
    date: new Date(2025, 1, 22, 12, 0).toISOString(), // 22/02/2025 12:00
    location: "Clube Recreativo - Salão Nobre",
    coverImageUrl: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600",
    gallery: [],
    status: "UPCOMING",
    maxParticipants: 150,
    registeredParticipants: 43,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useEventsStore = defineStore("events", () => {
  const events = ref<Event[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchEvents() {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      events.value = DUMMY_EVENTS;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar eventos";
    } finally {
      loading.value = false;
    }
  }

  return {
    events,
    loading,
    error,
    fetchEvents,
  };
});
