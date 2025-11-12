/**
 * Sistema de autenticação fallback para desenvolvimento
 * Usado quando Firebase não está configurado
 */

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
}

export const mockAuthService = {
  /**
   * Mock Google login - simula login com Google
   */
  async signInWithGoogle() {
    console.log("🔧 Usando MOCK Google Auth (Firebase não configurado)");

    // Simular seleção de usuário (baseado nos emails autorizados)
    const authorizedEmails = (
      import.meta.env.VITE_AUTHORIZED_ADMINS || ""
    ).split(",");
    const userEmail =
      authorizedEmails.find((email) => email.includes("marllon.nasser")) ||
      authorizedEmails.find((email) => email.includes("gmail.com")) ||
      "admin@gmail.com";

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockUser: MockUser = {
      uid: "mock-google-user-456",
      email: userEmail.trim(),
      displayName: `${userEmail.split("@")[0]} (Mock)`,
    };

    const mockToken = "mock-google-jwt-token-" + Date.now();

    // Salvar automaticamente no localStorage
    this.saveMockUser(mockUser, mockToken);

    return {
      success: true,
      user: mockUser,
      token: mockToken,
    };
  },

  /**
   * Mock login - sempre sucede para desenvolvimento
   */
  async signIn(email: string, password: string) {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verificação básica para desenvolvimento
    if (email.includes("@") && password.length >= 4) {
      const mockUser: MockUser = {
        uid: "mock-user-123",
        email: email,
        displayName: email.split("@")[0],
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      return {
        success: true,
        user: mockUser,
        token: mockToken,
      };
    }

    return {
      success: false,
      error:
        "Email ou senha inválidos (desenvolvimento: use qualquer email/senha válida)",
    };
  },

  /**
   * Mock logout
   */
  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  /**
   * Mock token
   */
  async getCurrentUserToken(): Promise<string | null> {
    return localStorage.getItem("mock_token");
  },

  /**
   * Mock current user
   */
  getCurrentUser(): MockUser | null {
    const userData = localStorage.getItem("mock_user");
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Mock auth state listener
   */
  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    // Verificar se há usuário mockado no localStorage
    const userData = localStorage.getItem("mock_user");
    const user = userData ? JSON.parse(userData) : null;

    // Chamar callback imediatamente
    setTimeout(() => callback(user), 100);

    // Retornar função de cleanup vazia
    return () => {};
  },

  /**
   * Salvar dados mock no localStorage
   */
  saveMockUser(user: MockUser, token: string) {
    localStorage.setItem("mock_user", JSON.stringify(user));
    localStorage.setItem("mock_token", token);
  },

  /**
   * Limpar dados mock
   */
  clearMockUser() {
    localStorage.removeItem("mock_user");
    localStorage.removeItem("mock_token");
  },
};
