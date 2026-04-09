import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineSearch, HiOutlineShoppingCart } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";

const MotionDiv = motion.div;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const { products, fetchProducts, isLoadingProducts } = useProductStore();
  const { cartItems, addToCart, isUpdatingCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Extract unique categories
  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products],
  );

  // Filter products locally
  const filtered = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      !categoryFilter ||
      p.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  // Simulate loading (optional, remove if you don't want)
  const isLoading = isLoadingProducts;

  const getItemQty = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.product?._id === productId);
    return Number(item?.quantity || 0);
  };

  return (
    <div className="container-main section-padding">
      {/* Header */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-2">
          <span className="text-gradient">
            {categoryFilter && categoryFilter !== "All"
              ? `${categoryFilter} Collection`
              : "Shop All Products"}
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
        </p>
      </MotionDiv>

      {/* Search & Filters */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={cat === "All" ? "/shop" : `/shop?category=${cat}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                (!categoryFilter && cat === "All") ||
                categoryFilter.toLowerCase() === cat.toLowerCase()
                  ? "bg-linear-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/40"
                  : "border border-white/10 bg-slate-900/40 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-900/60"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </MotionDiv>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-slate-800" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-linear-to-r from-cyan-500/40 to-violet-500/40 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => {
            const inCartQty = getItemQty(p._id);
            const reachedLimit = inCartQty >= 3;
            return (
            <MotionDiv
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/product/${p._id}`}
                className="group block rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                {/* Image */}
                <div className="aspect-square bg-slate-800 overflow-hidden relative">
                  {p.imageFile || p.imageUrl ? (
                    <img
                      src={p.imageFile || p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 border-t border-white/5">
                  <p className="text-xs text-cyan-400 uppercase tracking-wider mb-1 font-semibold">
                    {p.category}
                  </p>
                  <h3 className="font-semibold text-sm text-slate-100 line-clamp-2 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {p.description}
                  </p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-bold bg-linear-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                      {p.price.toLocaleString()} DA
                    </p>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        if (reachedLimit) {
                          toast.error("Maximum quantity is 3 for this product");
                          return;
                        }
                        addToCart(p._id);
                      }}
                      disabled={isUpdatingCart || reachedLimit}
                      title={reachedLimit ? "Maximum quantity reached" : "Add to cart"}
                      className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors disabled:opacity-50"
                    >
                      <HiOutlineShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            </MotionDiv>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center">
            <HiOutlineSearch className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-400 text-lg font-medium mb-2">
            No products found
          </p>
          <p className="text-slate-500 text-sm">
            Try adjusting your search or category filters
          </p>
        </div>
      )}
    </div>
  );
}