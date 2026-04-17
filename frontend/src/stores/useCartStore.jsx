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
      const status = error.response?.status;
      if (status !== 401 && status !== 403) {
        toast.error(error.response?.data?.message || "Failed to load cart");
      }
    } finally {
      set({ isLoadingCart: false });
    }
  },

  addToCart: async (productId) => {
    set({ isUpdatingCart: true });
    try {
      await axios.post("/cart/add", { productId });
      await get().fetchCart();
      toast.success("Added to cart");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
      return false;
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  addManyToCart: async (productIds = []) => {
    const validIds = Array.from(new Set(productIds.filter(Boolean)));
    if (!validIds.length) return false;

    set({ isUpdatingCart: true });
    try {
      for (const id of validIds) {
        await axios.post("/cart/add", { productId: id });
      }
      await get().fetchCart();
      toast.success("Selected AI build added to cart");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add AI build to cart");
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

      await axios.put(`/cart/${productId}`, { quantity: qty });
      await get().fetchCart();
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
      await axios.delete("/cart/delete", { data: { productId } });
      await get().fetchCart();
      toast.success("Removed from cart");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product");
      return false;
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  clearCartServer: async () => {
    set({ isUpdatingCart: true });
    try {
      await axios.delete("/cart/delete-all");
      set({ cartItems: [] });
      toast.success("Cart cleared successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
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
