import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },
  signUp: async (username, password, email, firstName, lastName) => {
    try {
      set({ loading: true });
      //call api
      await authService.signup(username, password, email, firstName, lastName);
      toast.success(
        "Sign up successfully! You will be redirect to sign in page",
      );
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.signIn(username, password);
      get().setAccessToken(accessToken);
      await get().fetchMe();
      toast.success("Welcome back to Moji");
    } catch (error) {
      console.error(error);
      toast.error("Sign in failed");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Sign out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while Signing out");
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Error validate user data. Try again!");
    } finally {
      set({ loading: false });
    }
  },
  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);
      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Expired session. Please sign in again!");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
