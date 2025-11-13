import { ref } from "vue";
import type { DonationRequest, PaymentStatusResponse, ApiError } from "@/types";
import { paymentService } from "@/utils/services";
import { useGoalsStore } from "@/stores/goals";
import { useToast } from "@/composables/useToast";

export function useDonations() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const goalsStore = useGoalsStore();
  const { showToast } = useToast();

  async function createDonation(donationData: DonationRequest) {
    loading.value = true;
    error.value = null;

    try {
      const pixRequest = {
        amount: donationData.amount,
        description: `Doação${donationData.goalId ? " para meta" : ""}: ${
          donationData.message || "Contribuição solidária"
        }`,
        payer: {
          name: donationData.donor.name || "Doador Anônimo",
          email: donationData.donor.email || "anonimo@tyler.com",
          document: donationData.donor.document || "00000000000",
        },
      };

      return await paymentService.createPixCheckout(pixRequest);
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message || "Erro ao processar doação";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function handlePaymentSuccess(
    paymentData: PaymentStatusResponse,
    goalId?: string
  ) {
    if (goalId) {
      goalsStore.updateGoalProgress(goalId, paymentData.amount.value);
    }

    showToast(
      `Doação de R$ ${(paymentData.amount.value / 100).toFixed(
        2
      )} confirmada! Obrigado pela sua contribuição.`,
      "success"
    );
  }

  function validateDonationData(data: Partial<DonationRequest>): string[] {
    const errors: string[] = [];

    if (!data.amount || data.amount <= 0) {
      errors.push("Valor da doação deve ser maior que zero");
    }

    if (data.amount && data.amount < 100) {
      errors.push("Valor mínimo da doação é R$ 1,00");
    }

    if (!data.anonymous && !data.donor?.name) {
      errors.push("Nome é obrigatório para doações não anônimas");
    }

    if (!data.anonymous && !data.donor?.email) {
      errors.push("Email é obrigatório para doações não anônimas");
    }

    if (data.donor?.email && !isValidEmail(data.donor.email)) {
      errors.push("Email inválido");
    }

    if (data.donor?.document && !isValidDocument(data.donor.document)) {
      errors.push("CPF inválido");
    }

    return errors;
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidDocument(doc: string): boolean {
    const cleanDoc = doc.replace(/\D/g, "");
    if (cleanDoc.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanDoc)) return false;

    return true; // Validação básica - implementar algoritmo completo se necessário
  }

  function formatDocument(doc: string): string {
    const cleanDoc = doc.replace(/\D/g, "");
    return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return {
    loading,
    error,
    createDonation,
    handlePaymentSuccess,
    validateDonationData,
    isValidEmail,
    isValidDocument,
    formatDocument,
  };
}
