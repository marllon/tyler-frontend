import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiError } from "@/types";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
      timeout: 30000, // 30 segundos
    });
    this.client.interceptors.request.use(
      async (config) => {
        if (
          !config.headers["Content-Type"] &&
          !(config.data instanceof FormData)
        ) {
          config.headers["Content-Type"] = "application/json";
        }
        if (config.headers["Content-Type"] === undefined) {
          delete config.headers["Content-Type"];
        }
        let token = localStorage.getItem("admin_token");
        if (!token) {
          const { firebaseService } = await import("./firebase");
          token = await firebaseService.getCurrentUserToken();
          if (token) {
            localStorage.setItem("admin_token", token);
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data instanceof FormData ? "FormData" : config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
    this.client.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(
            `✅ ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`,
            response.data
          );
        }
        return response;
      },
      (error: AxiosError) => {
        if (import.meta.env.DEV) {
          console.error(
            `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            {
              status: error.response?.status,
              data: error.response?.data,
            }
          );
        }
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_token");
          if (
            window.location.pathname.startsWith("/admin") &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/admin/login";
          }
        }
        const apiError: ApiError = {
          status: error.response?.status || 500,
          code: error.code || "unknown_error",
          message: this.extractErrorMessage(error),
        };

        return Promise.reject(apiError);
      }
    );
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (typeof data === "string") return data;
    }

    if (error.message) return error.message;
    return "Ocorreu um erro inesperado";
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const api = new ApiClient();
