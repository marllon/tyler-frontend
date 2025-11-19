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

interface RaffleApiResponse {
  id: string;
  title: string;
  description: string;
  prize: string;
  images: string[]; // API usa 'images'
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  remainingTickets: number;
  progressPercentage: number;
  status: string;
  deadline: string; // API usa 'deadline'
  committedEntropy?: string;
  revealEntropy?: string | null;
  winnerTicketNumber?: number | null;
  goalId?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

interface RafflePageApiResponse {
  raffles: RaffleApiResponse[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

function adaptRaffleFromApi(apiRaffle: RaffleApiResponse): Raffle {
  return {
    id: apiRaffle.id,
    title: apiRaffle.title,
    description: apiRaffle.description,
    prize: apiRaffle.prize,
    imageUrls: apiRaffle.images, // images -> imageUrls
    ticketPrice: apiRaffle.ticketPrice,
    totalTickets: apiRaffle.totalTickets,
    soldTickets: apiRaffle.soldTickets,
    availableTickets: apiRaffle.remainingTickets, // remainingTickets -> availableTickets
    status: apiRaffle.status as any,
    drawDate: apiRaffle.deadline, // deadline -> drawDate
    committedEntropy: apiRaffle.committedEntropy,
    revealEntropy: apiRaffle.revealEntropy || undefined,
    winnerTicketNumber: apiRaffle.winnerTicketNumber || undefined,
    goalId: apiRaffle.goalId || undefined,
    active: apiRaffle.active,
    createdAt: apiRaffle.createdAt,
    updatedAt: apiRaffle.updatedAt,
    createdBy: apiRaffle.createdBy,
  };
}

export async function getRaffles(
  filters?: RaffleFilters
): Promise<RafflePageResponse> {
  const params: Record<string, any> = {
    page: filters?.page ?? 0,
    pageSize: filters?.pageSize ?? 20,
  };

  if (filters?.status) params.status = filters.status;
  if (filters?.activeOnly !== undefined) params.active = filters.activeOnly;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.sortDirection) params.sortDirection = filters.sortDirection;
  if (filters?.searchTerm) params.searchTerm = filters.searchTerm;

  const response = await api.get<RafflePageApiResponse>("/raffles", params);

  return {
    raffles: response.raffles.map(adaptRaffleFromApi),
    page: response.page,
    pageSize: response.pageSize,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    hasNext: response.hasNext,
    hasPrevious: response.hasPrevious,
  };
}

export async function getRaffleById(id: string): Promise<Raffle> {
  const response = await api.get<RaffleApiResponse>(`/raffles/${id}`);
  return adaptRaffleFromApi(response);
}

export async function getRaffleTickets(
  raffleId: string,
  status?: "RESERVED" | "PAID" | "EXPIRED" | "REFUNDED"
): Promise<RaffleTicket[]> {
  const params = status ? { status } : {};
  const response = await api.get<RaffleTicket[]>(
    `/raffles/${raffleId}/tickets`,
    params
  );
  return response;
}

export async function getAvailableTickets(
  raffleId: string
): Promise<AvailableTicketsResponse> {
  const response = await api.get<AvailableTicketsResponse>(
    `/raffles/${raffleId}/tickets/available`
  );
  return response;
}

export async function purchaseTickets(
  raffleId: string,
  data: TicketPurchaseRequest
): Promise<TicketPurchaseResponse> {
  const response = await api.post<TicketPurchaseResponse>(
    `/raffles/${raffleId}/purchase`,
    data
  );
  return response;
}

export async function verifyDraw(
  raffleId: string
): Promise<DrawVerificationResponse> {
  const response = await api.get<DrawVerificationResponse>(
    `/raffles/${raffleId}/verify-draw`
  );
  return response;
}

export async function createRaffle(data: RaffleCreateRequest): Promise<Raffle> {
  const response = await api.post<RaffleApiResponse>("/raffles", data);
  return adaptRaffleFromApi(response);
}

export async function updateRaffle(
  id: string,
  data: RaffleUpdateRequest
): Promise<Raffle> {
  const response = await api.put<RaffleApiResponse>(`/raffles/${id}`, data);
  return adaptRaffleFromApi(response);
}

export async function deleteRaffle(id: string): Promise<void> {
  await api.delete(`/raffles/${id}`);
}

export async function uploadRaffleImages(
  raffleId: string,
  files: File[]
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await api.post<string[]>(
    `/raffles/${raffleId}/upload-images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
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
