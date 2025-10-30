export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl?: string;
  deadline?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl?: string; // Imagem principal (mantida para retrocompatibilidade)
  images?: string[]; // Múltiplas imagens do prêmio
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  deadline: string;
  status: "ACTIVE" | "ENDED" | "DRAWN" | "CANCELLED";
  committedEntropy?: string;
  winnerTicketNumber?: number;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  coverImageUrl: string;
  gallery: string[];
  status: "UPCOMING" | "PAST" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  paymentProvider: string;
  paymentIntentId: string;
  buyer: BuyerInfo;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Donation {
  id: string;
  userId?: string;
  goalId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  paymentProvider: string;
  paymentIntentId: string;
  donor: DonorInfo;
  message?: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerInfo {
  name: string;
  email: string;
  phone?: string;
  document?: string;
}

export interface DonorInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface AdminInfo {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CheckoutRequest {
  type: "order" | "donation" | "raffle";
  items?: { productId: string; quantity: number }[];
  donationAmount?: number;
  goalId?: string;
  raffleId?: string;
  ticketQuantity?: number;
  buyer: BuyerInfo;
  message?: string;
  anonymous?: boolean;
}

export interface CheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  paymentIntentId?: string;
  orderId?: string;
  donationId?: string;
  ticketNumbers?: number[];
  error?: string;
}

export interface StatsResponse {
  totalRevenue: number;
  totalDonations: number;
  totalOrders: number;
  totalDonationsCount: number;
  activeGoals: number;
  activeRaffles: number;
  upcomingEvents: number;
  recentOrders: Order[];
  recentDonations: Donation[];
  goalProgress: GoalProgress[];
}

export interface GoalProgress {
  goalId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  percentage: number;
}
