import axios from "../lib/axios.js";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  recommendedProducts: [],
  currentProduct: null,
  isLoadingProducts: false,
  isLoadingFeatured: false,
  isSavingProduct: false,

  fetchProducts: async () => {
    set({ isLoadingProducts: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      set({ isLoadingProducts: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoadingFeatured: true });
    try {
      const res = await axios.get("/products/featured");
      set({ featuredProducts: res.data.products || [] });
    } catch (error) {
      set({ featuredProducts: [] });
      toast.error(
        error.response?.data?.message || "Failed to load featured products",
      );
    } finally {
      set({ isLoadingFeatured: false });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoadingProducts: true });
    try {
      const res = await axios.get(`/products/${id}`);
      set({ currentProduct: res.data.product || null });
      return res.data.product;
    } catch (error) {
      set({ currentProduct: null });
      toast.error(
        error.response?.data?.message || "Failed to load product details",
      );
      return null;
    } finally {
      set({ isLoadingProducts: false });
    }
  },

  fetchRecommendedProducts: async () => {
    try {
      const res = await axios.get("/products/recommended");
      set({ recommendedProducts: res.data.products || [] });
    } catch (error) {
      set({ recommendedProducts: [] });
      toast.error(
        error.response?.data?.message || "Failed to load recommended products",
      );
    }
  },

  createProduct: async (productData) => {
    set({ isSavingProduct: true });
    try {
      const res = await axios.post("/products/createproduct", productData);
      set((state) => ({ products: [...state.products, res.data.product] }));
      toast.success("Product created successfully!");
      return { success: true, product: res.data.product };
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create product. Please try again.",
      );
      return { success: false };
    } finally {
      set({ isSavingProduct: false });
    }
  },

  updateProduct: async (id, updatedData) => {
    set({ isSavingProduct: true });
    try {
      const res = await axios.patch(`/products/${id}`, updatedData);
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? res.data.product || p : p,
        ),
        currentProduct:
          state.currentProduct?._id === id
            ? res.data.product || state.currentProduct
            : state.currentProduct,
      }));
      toast.success("Product updated successfully!");
      return { success: true, product: res.data.product };
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update product. Please try again.",
      );
      return { success: false };
    } finally {
      set({ isSavingProduct: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      await axios.delete(`/products/deleteproduct/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        currentProduct:
          state.currentProduct?._id === id ? null : state.currentProduct,
      }));
      toast.success("Product deleted successfully!");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product. Please try again.",
      );
      return false;
    }
  },

  toggleFeatured: async (id) => {
    try {
      const res = await axios.patch(`/products/featured/${id}`);
      const updated = res.data.product;
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? updated : p)),
      }));
      if (get().featuredProducts.length > 0) {
        get().fetchFeaturedProducts();
      }
      toast.success("Featured status updated");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update featured status",
      );
      return false;
    }
  },
}));
