import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios.js";

export const useCartStore = create((set, get) => ({
  cartItems: [],
  isLoadingCart: false,
  isUpdatingCart: false,

  fetchCart: async () => {
    set({ isLoadingCart: true });
    try {
      const res = await axios.get("/cart");
      set({ cartItems: res.data.cart || [] });
    } catch (error) {
      set({ cartItems: [] });
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Failed to load cart");
      }
    } finally {
      set({ isLoadingCart: false });
    }
  },

  addToCart: async (productId) => {
    set({ isUpdatingCart: true });
    try {
      const res = await axios.post("/cart/add", { productId });
      set({ cartItems: res.data.cart || [] });
      toast.success("Added to cart");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
      return false;
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ isUpdatingCart: true });
    try {
      // Ensure quantity is a number
      const qty = Number(quantity);
      if (isNaN(qty)) {
        toast.error("Quantity must be a number");
        return false;
      }

      const res = await axios.put(`/cart/${productId}`, { quantity: qty });
      set({ cartItems: res.data.cart || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      return false;
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ isUpdatingCart: true });
    try {
      const res = await axios.delete("/cart/delete", { data: { productId } });
      set({ cartItems: res.data.cart || [] });
      toast.success("Removed from cart");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product");
      return false;
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  clearCart: () => {
    set({ cartItems: [] });
  },

  getSubtotal: () => {
    return get().cartItems.reduce(
      (sum, item) =>
        sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
      0,
    );
  },

  getTotalItems: () => {
    return get().cartItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );
  },
}));
