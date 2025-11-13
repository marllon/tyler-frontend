import { ref } from "vue";

export function useLoading(initialState = false) {
  const isLoading = ref(initialState);
  const error = ref<string | null>(null);

  const startLoading = () => {
    isLoading.value = true;
    error.value = null;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  const setError = (err: string | Error) => {
    error.value = typeof err === "string" ? err : err.message;
    isLoading.value = false;
  };

  const clearError = () => {
    error.value = null;
  };

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    startLoading();
    try {
      const result = await fn();
      stopLoading();
      return result;
    } catch (err: any) {
      setError(err);
      return null;
    }
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    clearError,
    withLoading,
  };
}
