import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios.js";

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
    }}

}));
