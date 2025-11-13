export type PaymentStatus = 'NEW' | 'WAITING_PAYMENT' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  version: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // em reais (não centavos como estava antes)
  category: string;
  stock: number;
  active: boolean;
  brand?: string;
  model?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  warranty?: string;
  tags?: string[];
  images?: ProductImage[]; // Opcional até API implementar completamente
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  brand?: string;
  model?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  warranty?: string;
  tags?: string[];
}

export interface ProductTraditionalPaginationResponse {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ProductPaginationResponse {
  products: Product[];
  pageSize: number;
  hasNext: boolean;
  nextCursor?: string;
  hasPrevious: boolean;
  previousCursor?: string;
}

export interface ProductFilters {
  limit?: number;
  cursor?: string;
  direction?: 'NEXT' | 'PREVIOUS';
  sortBy?: 'CREATED_AT' | 'NAME' | 'PRICE' | 'STOCK';
  sortDirection?: 'ASC' | 'DESC';
  activeOnly?: boolean;
  category?: string;
}

export interface ImageUploadResponse {
  id: string;
  url: string;
  isPrimary: boolean;
  message: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  name: string;
  email: string;
  document: string;
  phone?: string;
}

export interface Donation {
  id: string;
  amount: number;
  goalId?: string;
  anonymous: boolean;
  message?: string;
  donor: {
    name?: string;
    email?: string;
    document?: string;
  };
  paymentId: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  totalAmount: number;
  status: PaymentStatus;
  paymentId?: string;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PixPaymentRequest {
  amount: number;
  description: string;
  payer: {
    name: string;
    email: string;
    document: string;
  };
}

export interface PixQrCode {
  id: string;
  text: string;
  links: Array<{
    media: string;
    href: string;
  }>;
}

export interface PixPaymentResponse {
  id: string;
  qr_codes: PixQrCode[];
  status: PaymentStatus;
  amount: {
    value: number;
    currency: string;
  };
  created_at: string;
}

export interface PaymentStatusResponse {
  id: string;
  status: PaymentStatus;
  amount: {
    value: number;
    currency: string;
  };
  paid_at?: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl?: string;
  images?: string[];
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
  coverImageUrl?: string;
  gallery?: string[];
  status: "UPCOMING" | "PAST" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface RaffleTicket {
  id: string;
  raffleId: string;
  number: number;
  buyer: Customer;
  purchasedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  participant: Customer;
  ticketType?: string;
  registeredAt: string;
}

export interface DonationRequest {
  amount: number;
  goalId?: string;
  anonymous: boolean;
  message?: string;
  donor: {
    name?: string;
    email?: string;
    document?: string;
  };
}

export interface OrderCheckoutRequest {
  items: OrderItem[];
  customer: Customer;
  goalId?: string;
}

export interface RaffleTicketPurchaseRequest {
  quantity: number;
  buyer: Customer;
}

export interface EventRegistrationRequest {
  participant: Customer;
  ticketType?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface GoalsResponse extends PaginatedResponse<Goal> {
  goals: Goal[];
}

export interface DashboardSummary {
  totalDonations: number;
  totalOrders: number;
  activeGoals: number;
  totalUsers: number;
}

export interface AdminDashboard {
  summary: DashboardSummary;
  recentTransactions: Array<Donation | Order>;
  goalProgress: Goal[];
  topProducts: Product[];
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  activeOnly?: boolean;
  category?: string;
}

export interface GoalFilters {
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}
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
