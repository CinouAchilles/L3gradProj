import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

export const useOrderStore = create((set) => ({
  myOrders: [],
  allOrders: [],
  trackedOrder: null,
  isLoadingOrders: false,
  isCreatingOrder: false,

  createOrder: async (payload) => {
    set({ isCreatingOrder: true });
    try {
      const res = await axios.post("/orders", payload);
      toast.success("Order placed successfully");
      return { success: true, order: res.data.order };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
      return { success: false };
    } finally {
      set({ isCreatingOrder: false });
    }
  },

  fetchMyOrders: async () => {
    set({ isLoadingOrders: true });
    try {
      const res = await axios.get("/orders/myorders");
      set({ myOrders: res.data.orders || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  trackOrder: async (trackingCode) => {
    set({ isLoadingOrders: true, trackedOrder: null });
    try {
      const res = await axios.get(`/orders/track/${trackingCode}`);
      set({ trackedOrder: res.data.order || null });
      return res.data.order || null;
    } catch (error) {
      set({ trackedOrder: null });
      toast.error(error.response?.data?.message || "Order not found");
      return null;
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoadingOrders: true });
    try {
      const res = await axios.get("/orders");
      set({ allOrders: res.data.orders || [] });
    } catch (error) {
      set({ allOrders: [] });
      toast.error(
        error.response?.data?.message || "Failed to load admin orders",
      );
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const res = await axios.patch(`/orders/${id}/status`, { status });
      const updatedOrder = res.data.order;
      set((state) => ({
        allOrders: state.allOrders.map((o) =>
          o._id === id ? (updatedOrder || o) : o,
        ),
        myOrders: state.myOrders.map((o) =>
          o._id === id ? (updatedOrder || o) : o,
        ),
        trackedOrder:
          state.trackedOrder?._id === id
            ? (updatedOrder || state.trackedOrder)
            : state.trackedOrder,
      }));
      toast.success("Order status updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      return false;
    }
  },
}));