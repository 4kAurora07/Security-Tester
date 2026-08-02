export interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  company?: string | null;
  oauth_provider?: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface PasswordStrength {
  isValid: boolean;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  score: number; // 0 to 3
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  return {
    isValid: hasMinLength && hasNumber && hasSymbol,
    hasMinLength,
    hasNumber,
    hasSymbol,
    score,
  };
}

const getBackendUrl = (): string => {
  const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.origin) {
    const hostname = window.location.hostname || "localhost";
    return `${window.location.protocol}//${hostname}:8000`;
  }
  return "http://localhost:8000";
};

const API_BASE_URL = `${getBackendUrl()}/api/auth`;

class AuthApi {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem("solvane_access_token", token);
    } else {
      localStorage.removeItem("solvane_access_token");
    }
  }

  getToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem("solvane_access_token");
    }
    return this.accessToken;
  }

  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let res = await fetch(url, { ...options, headers, credentials: "include" });

    // Handle 401 token refresh automatically
    if (res.status === 401 && !url.includes("/login") && !url.includes("/refresh")) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers.set("Authorization", `Bearer ${this.getToken()}`);
        res = await fetch(url, { ...options, headers, credentials: "include" });
      }
    }

    return res;
  }

  async signup(data: { name: string; email: string; password: string; company?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Signup failed" }));
      throw new Error(err.detail || "Signup failed");
    }

    const json: AuthResponse = await res.json();
    this.setToken(json.access_token);
    return json;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Invalid email or password" }));
      throw new Error(err.detail || "Login failed");
    }

    const json: AuthResponse = await res.json();
    this.setToken(json.access_token);
    return json;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const json: AuthResponse = await res.json();
        this.setToken(json.access_token);
        return true;
      }
    } catch {
      // Ignore
    }
    this.setToken(null);
    return false;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore
    }
    this.setToken(null);
  }

  async getMe(): Promise<User> {
    const res = await this.fetchWithAuth(`${API_BASE_URL}/me`);
    if (!res.ok) {
      throw new Error("Not authenticated");
    }
    return res.json();
  }

  async verifyEmail(token: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Verification failed" }));
      throw new Error(err.detail || "Email verification failed");
    }
    const json = await res.json();
    return json.message;
  }

  async resendVerification(): Promise<string> {
    const res = await this.fetchWithAuth(`${API_BASE_URL}/resend-verification`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Resend failed" }));
      throw new Error(err.detail || "Failed to resend verification");
    }
    const json = await res.json();
    return json.message;
  }

  async forgotPassword(email: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Forgot password request failed");
    }
    const json = await res.json();
    return json.message;
  }

  async resetPassword(token: string, new_password: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Reset failed" }));
      throw new Error(err.detail || "Password reset failed");
    }
    const json = await res.json();
    return json.message;
  }

  /**
   * Initiates real OAuth flow — redirects browser to the backend OAuth redirect endpoint,
   * which then redirects to the provider (GitHub/Google).
   */
  triggerOAuth(provider: "github" | "google") {
    window.location.href = `${API_BASE_URL}/oauth/${provider}`;
  }

  /**
   * Called on app startup to handle the ?token= query param that the backend
   * injects into the redirect URL after a successful OAuth callback.
   * Returns the user if a token was found, null otherwise.
   */
  async handleOAuthCallback(): Promise<User | null> {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return null;

    // Store the token and clean the URL
    this.setToken(token);
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);

    // Fetch the real user from the backend
    try {
      const user = await this.getMe();
      return user;
    } catch {
      this.setToken(null);
      return null;
    }
  }

  /**
   * Tries to restore session from localStorage token or httpOnly refresh cookie.
   * Returns the user if session is valid, null otherwise.
   */
  async restoreSession(): Promise<User | null> {
    const token = this.getToken();
    if (token) {
      try {
        const user = await this.getMe();
        return user;
      } catch {
        // Access token expired — try refresh
      }
    }

    // Attempt refresh via httpOnly cookie
    const refreshed = await this.refreshToken();
    if (refreshed) {
      try {
        const user = await this.getMe();
        return user;
      } catch {
        // ignore
      }
    }

    this.setToken(null);
    return null;
  }
}

export const authApi = new AuthApi();
