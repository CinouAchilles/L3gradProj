import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios.js";

export const useUserStore = create((set) =>({
    user: null,
    isLoading: false,
    checkAuth: true,

    signup: async (name, lastname, email, password , confirmPassword) => {
        set({ isLoading: true });
        if(password !== confirmPassword){
            set({isLoading: false})
            return toast.error("password does not match")
        }
        try {
            const res = await axios.post("/auth/signup", { name, lastname, email, password });
            set({ isLoading: false, user: res.data.user });
            toast.success("Account created successfully!");
            return res.data.user;

        } catch (error) {
            set({isLoading: false})
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
            return null;
        }
    }
}))