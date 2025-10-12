import { defineStore } from "pinia";
import type { AuthTokenResponse } from "~/pages/hooks";

export type User = {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  interested_services: any[]; // or string[] if you know the type of services
  date_created: string; // ISO date string
  date_updated: string; // ISO date string
};

interface Auth {
  tokens: AuthTokenResponse | null;
  user: User | null;
}

export const useAuthStore = defineStore("Auth", {
  state: (): Auth => ({
    tokens: null,
    user: null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
    setTokens(tokens: AuthTokenResponse) {
      this.tokens = tokens;
    },
    clearTokens() {
      this.tokens = null;
    },
    logout() {
      this.clearUser();
      this.clearTokens();
    }
  },
  persist: true,
});
