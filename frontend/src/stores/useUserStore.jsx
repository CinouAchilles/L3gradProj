import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios.js";
import { Navigate } from "react-router-dom";
import { get } from "mongoose";

export const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  checkingAuth: true,

  signup: async (name, lastname, email, password, confirmPassword) => {
    set({ isLoading: true });
    if (password !== confirmPassword) {
      set({ isLoading: false });
      return toast.error("password does not match");
    }
    try {
      const res = await axios.post("/auth/signup", {
        name,
        lastname,
        email,
        password,
      });
      set({ isLoading: false, user: res.data.user });
      toast.success("Account created successfully!");
      return res.data.user;
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
      return null;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ isLoading: false, user: res.data.user });
      toast.success("Logged in successfully!");
      console.log("Logged in user:", res.data.user);
      return { success: true, user: res.data.user };
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
      return { success: false };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post("/auth/logout");
      set({ isLoading: false, user: null });
      toast.success("Logged out successfully!");
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again.",
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile"); // returns the logged-in user
      set({ user: res.data.user });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({ user: null });
    } finally {
      set({ checkingAuth: false });
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) return; // Prevent multiple refresh attempts during initial auth check
    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false, user: res.data.user });
      return res.data.user;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({ checkingAuth: false, user: null });
      toast.error("Session expired. Please log in again.");
      get().logout(); // If refresh fails, log out the user
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
  },
);
