import { api } from "@/utils/api";
import type {
  Raffle,
  RaffleCreateRequest,
  RaffleUpdateRequest,
  RafflePageResponse,
  RaffleTicket,
  TicketPurchaseRequest,
  TicketPurchaseResponse,
  AvailableTicketsResponse,
  RaffleDrawRequest,
  RaffleDrawResponse,
  DrawVerificationResponse,
  RaffleFilters,
} from "@/types";

 ENDPOINTS PÚBLICOS ============

export async function getRaffles(
  filters?: RaffleFilters
): Promise<RafflePageResponse> {
  const params: Record<string, any> = {
    page: filters?.page ?? 0,
    pageSize: filters?.pageSize ?? 10,
  };

  if (filters?.status) params.status = filters.status;
  if (filters?.activeOnly !== undefined) params.activeOnly = filters.activeOnly;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.sortDirection) params.sortDirection = filters.sortDirection;
  if (filters?.searchTerm) params.searchTerm = filters.searchTerm;

  const response = await api.get<RafflePageResponse>("/raffles", { params });
  return response.data;
}

export async function getRaffleById(id: string): Promise<Raffle> {
  const response = await api.get<Raffle>(`/raffles/${id}`);
  return response.data;
}

export async function getRaffleTickets(
  raffleId: string,
  status?: "RESERVED" | "PAID" | "EXPIRED" | "REFUNDED"
): Promise<RaffleTicket[]> {
  const params = status ? { status } : {};
  const response = await api.get<RaffleTicket[]>(
    `/raffles/${raffleId}/tickets`,
    { params }
  );
  return response.data;
}

export async function getAvailableTickets(
  raffleId: string
): Promise<AvailableTicketsResponse> {
  const response = await api.get<AvailableTicketsResponse>(
    `/raffles/${raffleId}/tickets/available`
  );
  return response.data;
}

export async function purchaseTickets(
  raffleId: string,
  data: TicketPurchaseRequest
): Promise<TicketPurchaseResponse> {
  const response = await api.post<TicketPurchaseResponse>(
    `/raffles/${raffleId}/purchase`,
    data
  );
  return response.data;
}

export async function verifyDraw(
  raffleId: string
): Promise<DrawVerificationResponse> {
  const response = await api.get<DrawVerificationResponse>(
    `/raffles/${raffleId}/verify-draw`
  );
  return response.data;
}

 ENDPOINTS ADMIN (requerem autenticação) ============

export async function createRaffle(data: RaffleCreateRequest): Promise<Raffle> {
  const response = await api.post<Raffle>("/raffles", data);
  return response.data;
}

export async function updateRaffle(
  id: string,
  data: RaffleUpdateRequest
): Promise<Raffle> {
  const response = await api.put<Raffle>(`/raffles/${id}`, data);
  return response.data;
}

export async function deleteRaffle(id: string): Promise<void> {
  await api.delete(`/raffles/${id}`);
}

export async function uploadRaffleImages(
  raffleId: string,
  files: File[]
): Promise<{ raffleId: string; uploadedImages: string[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await api.post<{
    raffleId: string;
    uploadedImages: string[];
  }>(`/raffles/${raffleId}/upload-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteRaffleImage(
  raffleId: string,
  imageIndex: number
): Promise<void> {
  await api.delete(`/raffles/${raffleId}/images/${imageIndex}`);
}

export async function drawRaffle(
  raffleId: string,
  data: RaffleDrawRequest
): Promise<RaffleDrawResponse> {
  const response = await api.post<RaffleDrawResponse>(
    `/raffles/${raffleId}/draw`,
    data
  );
  return response.data;
}

export async function cancelRaffle(raffleId: string): Promise<void> {
  await api.post(`/raffles/${raffleId}/cancel`, {});
}
