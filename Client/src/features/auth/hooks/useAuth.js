import { create } from "zustand";
import {
  loginApi,
  signupApi,
  getProfileApi,
} from "../api/authApi";

export const useAuth = create((set) => ({
  user: null,
  loading: false,

  login: async (data) => {
    set({ loading: true });
    const res = await loginApi(data);

    const token = res.data.token;
    localStorage.setItem("cinera_token", token);

    const profile = await getProfileApi();

    set({
      user: profile.data.user,
      loading: false,
    });
  },

  signup: async (data) => {
    set({ loading: true });
    await signupApi(data);
    set({ loading: false });
  },

  logout: () => {
    localStorage.removeItem("cinera_token");
    set({ user: null });
    window.location.href = "/login";
  },

  fetchProfile: async () => {
    try {
      const res = await getProfileApi();
      set({ user: res.data.user });
    } catch {
      localStorage.removeItem("cinera_token");
      set({ user: null });
    }
  },
}));
