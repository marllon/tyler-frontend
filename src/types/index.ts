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
  sortBy?: 'createdAt' | 'name' | 'price' | 'stock';
  sortDirection?: 'ASC' | 'DESC';
  activeOnly?: boolean;
  category?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BOLETO';
export type ShippingMethod = 'COLLECT_ON_DELIVERY' | 'SEDEX' | 'PAC' | 'CUSTOM';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl?: string;
}

export interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'PIX'; // Backend sempre retorna PIX
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  trackingCode?: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  notes?: string;
}

export interface PaymentDetails {
  qrCode: string;
  qrCodeImage: string;
  paymentId: string;
  expiresAt: string;
  amount: number;
  paidAt?: string;
}

export interface CreateOrderResponse {
  order: Order;
  payment: PaymentDetails;
}

export interface OrderDetailsResponse {
  order: Order;
  payment?: PaymentDetails;
}

export interface ListOrdersResponse {
  orders: Order[];
  pagination: {
    nextCursor?: string;
    hasMore: boolean;
  };
}
export interface PublicUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  savedAddresses?: ShippingAddress[];
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: PublicUser;
  token?: string;
  error?: string;
}

export interface ImageUploadResponse {
  id: string;
  url: string;
  isPrimary: boolean;
  message: string;
}

export type GoalStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;        // em reais (não centavos)
  currentAmount: number;        // em reais (não centavos)
  progress: number;             // percentual calculado pelo backend (0-100)
  startDate: string;            // ISO 8601
  endDate?: string;             // ISO 8601, opcional
  status: GoalStatus;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;           // UID do admin que criou (Firebase)
}

export interface GoalCreateRequest {
  title: string;
  description: string;
  targetAmount: number;
  currentAmount?: number;
  startDate?: string;           // Se null, backend usa data atual
  endDate?: string;
  status?: GoalStatus;
  imageUrl?: string;
  active?: boolean;
}

export interface GoalUpdateRequest {
  title?: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  startDate?: string;
  endDate?: string;
  status?: GoalStatus;
  imageUrl?: string;
  active?: boolean;
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
  id: string; // ID interno Firestore
  paymentId: string; // ID PagBank
  qrCode: string;
  qrCodeImage?: string;
  status: string;
  amount?: number;
  expiresAt?: string;

  qr_codes?: PixQrCode[];
  created_at?: string;
}

export interface PaymentStatusResponse {
  id: string; // ID interno Firestore
  paymentId: string; // ID PagBank
  status: string;
  amount: number; // Valor em centavos
  qrCode?: string;
  qrCodeImage?: string;
  expiresAt?: string;
  createdAt?: string;
}
  };
  paid_at?: string;
}

export type RaffleStatus = 'ACTIVE' | 'ENDED' | 'DRAWN' | 'CANCELLED';

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrls: string[];  // Array de URLs de imagens (até 10)
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  availableTickets: number;  // Calculado: totalTickets - soldTickets
  status: RaffleStatus;
  drawDate: string;  // ISO-8601
  expiresAt: string | null;
  committedEntropy?: string;  // Hash SHA-256 público
  revealEntropy?: string;  // Entropia revelada após sorteio
  winnerTicketNumber?: number;
  goalId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface RaffleCreateRequest {
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  deadline: string;
  expiresAt?: string;
  goalId?: string;
  active?: boolean;
}

export interface RaffleUpdateRequest {
  title?: string;
  description?: string;
  prize?: string;
  ticketPrice?: number;
  totalTickets?: number;
  deadline?: string;
  expiresAt?: string;
  status?: RaffleStatus;
  goalId?: string;
  active?: boolean;
}

export interface RafflePageResponse {
  raffles: Raffle[];
  totalElements: number;
  totalPages: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface RaffleTicket {
  id: string;
  raffleId: string;
  ticketNumber: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerDocument?: string;
  paymentId: string;
  status: 'RESERVED' | 'PAID' | 'EXPIRED' | 'REFUNDED';
  purchasedAt: string;
}

export interface TicketPurchaseRequest {
  quantity: number;
  ticketNumbers?: number[];  // Opcional: usuário escolhe números
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerDocument: string;  // CPF
}

export interface TicketPurchaseResponse {
  success: boolean;
  tickets: RaffleTicket[];
  payment: {
    id: string;
    qrCode: string;
    qrCodeImage: string;
    expiresAt: string;
    amount: number;
    status: string;
  };
  reservationExpiresAt: string;
}

export interface AvailableTicketsResponse {
  raffleId: string;
  totalTickets: number;
  availableTickets: number;
  availableNumbers: number[];
}

export interface RaffleDrawRequest {
  revealEntropy: string;
}

export interface RaffleDrawResponse {
  raffleId: string;
  winnerTicketNumber: number;
  winnerName: string;
  winnerEmail: string;
  winnerPhone: string;
  drawnAt: string;
  isVerified: boolean;
}

export interface DrawVerificationResponse {
  raffleId: string;
  committedEntropyHash: string;
  revealedEntropy: string;
  winnerTicketNumber: number;
  verificationPassed: boolean;
  message: string;
}

export interface RaffleFilters {
  page?: number;
  pageSize?: number;
  status?: RaffleStatus;
  activeOnly?: boolean;
  sortBy?: 'createdAt' | 'drawDate' | 'ticketPrice' | 'totalTickets';
  sortDirection?: 'ASC' | 'DESC';
  searchTerm?: string;
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

export interface GoalPageResponse {
  goals: Goal[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GoalsResponse extends PaginatedResponse<Goal> {
  goals: Goal[];
}

export interface GoalFilters {
  page?: number;
  pageSize?: number;
  status?: GoalStatus;
  activeOnly?: boolean;
  sortBy?: 'createdAt' | 'targetAmount' | 'currentAmount' | 'title' | 'endDate';
  sortDirection?: 'ASC' | 'DESC';
  searchTerm?: string;
  cursor?: string;
  direction?: 'NEXT' | 'PREVIOUS';
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
