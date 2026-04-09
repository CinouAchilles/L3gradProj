import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { HiArrowRight, HiOutlineShoppingCart } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";

const MotionDiv = motion.div;

export default function FeaturedProducts() {
  const { featuredProducts, fetchFeaturedProducts, isLoadingFeatured } =
    useProductStore();
  const { cartItems, addToCart, isUpdatingCart } = useCartStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const products = featuredProducts;
  console.log("Featured products:", products);
  const isLoading = isLoadingFeatured;

  const getItemQty = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.product?._id === productId);
    return Number(item?.quantity || 0);
  };

  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />

      <div className="container-main relative z-10">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-2">
              Featured <span className="text-gradient">Picks</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Hand-selected top performers just for you
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 transition-all hover:gap-3 font-medium"
          >
            View All{" "}
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </MotionDiv>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => {
              const inCartQty = getItemQty(p._id);
              const reachedLimit = inCartQty >= 3;
              return (
              <MotionDiv
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/product/${p._id}`}
                  className="group block rounded-2xl border border-white/10 bg-slate-900/55 backdrop-blur-xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {/* Featured Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-linear-to-r from-violet-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>

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
                      {p.category || "Hardware"}
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
          <div className="text-center py-16">
            <p className="text-slate-400">
              Featured products coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}