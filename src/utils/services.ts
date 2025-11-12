import { api } from '@/utils/api';
import type { 
  HealthResponse,
  PixPaymentRequest,
  PixPaymentResponse,
  PaymentStatusResponse 
} from '@/types';

// ============================================
// Health Check Service
// ============================================
export const healthService = {
  /**
   * Verifica o status da API
   */
  async checkHealth(): Promise<HealthResponse> {
    return api.get<HealthResponse>('/health');
  },
};

// ============================================
// Payment Service (PIX)
// ============================================
export const paymentService = {
  /**
   * Criar checkout PIX
   */
  async createPixCheckout(data: PixPaymentRequest): Promise<PixPaymentResponse> {
    return api.post<PixPaymentResponse>('/payments/checkout', data);
  },

  /**
   * Consultar status do pagamento
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    return api.get<PaymentStatusResponse>(`/payments/${transactionId}/status`);
  },

  /**
   * Polling para verificar status do pagamento
   * @param transactionId ID da transação
   * @param onStatusUpdate Callback chamado a cada atualização
   * @param maxAttempts Número máximo de tentativas (default: 60)
   * @param interval Intervalo entre tentativas em ms (default: 5000)
   */
  async pollPaymentStatus(
    transactionId: string,
    onStatusUpdate: (status: PaymentStatusResponse) => void,
    maxAttempts: number = 60,
    interval: number = 5000
  ): Promise<PaymentStatusResponse> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const poll = async () => {
        try {
          attempts++;
          const status = await this.getPaymentStatus(transactionId);
          onStatusUpdate(status);
          
          // Payment completed successfully
          if (status.status === 'PAID') {
            resolve(status);
            return;
          }
          
          // Payment failed or cancelled
          if (status.status === 'FAILED' || status.status === 'CANCELLED' || status.status === 'EXPIRED') {
            reject(new Error(`Pagamento ${status.status.toLowerCase()}`));
            return;
          }
          
          // Continue polling if still waiting and under max attempts
          if (attempts < maxAttempts && status.status === 'WAITING_PAYMENT') {
            setTimeout(poll, interval);
          } else if (attempts >= maxAttempts) {
            reject(new Error('Timeout: Pagamento não foi confirmado no tempo esperado'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  },
};