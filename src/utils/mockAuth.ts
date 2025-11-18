import { firebaseService } from "./firebase";

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
}

export const mockAuthService = {
  async signInWithGoogle() {
    console.log("🔧 Usando MOCK Google Auth (Firebase não configurado)");
    const authorizedEmails = await firebaseService.getAuthorizedEmails();

    const userEmail =
      authorizedEmails.find((email) => email.includes("marllon.nasser")) ||
      authorizedEmails.find((email) => email.includes("gmail.com")) ||
      authorizedEmails[0] ||
      "admin@gmail.com";

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockUser: MockUser = {
      uid: "mock-google-user-456",
      email: userEmail.trim(),
      displayName: `${userEmail.split("@")[0]} (Mock)`,
    };

    const mockToken = "mock-google-jwt-token-" + Date.now();

    this.saveMockUser(mockUser, mockToken);

    return {
      success: true,
      user: mockUser,
      token: mockToken,
    };
  },

  async signIn(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  async getCurrentUserToken(): Promise<string | null> {
    return localStorage.getItem("mock_token");
  },

  getCurrentUser(): MockUser | null {
    const userData = localStorage.getItem("mock_user");
    return userData ? JSON.parse(userData) : null;
  },

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    const userData = localStorage.getItem("mock_user");
    const user = userData ? JSON.parse(userData) : null;

    setTimeout(() => callback(user), 100);

    return () => {};
  },

  saveMockUser(user: MockUser, token: string) {
    localStorage.setItem("mock_user", JSON.stringify(user));
    localStorage.setItem("mock_token", token);
  },

  clearMockUser() {
    localStorage.removeItem("mock_user");
    localStorage.removeItem("mock_token");
  },
};
