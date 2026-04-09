import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { HiArrowRight, HiOutlineShoppingCart } from "react-icons/hi2";
import { toast } from "react-hot-toast";
import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";

const MotionDiv = motion.div;

export default function FeaturedProducts() {
  const { featuredProducts, fetchFeaturedProducts, isLoadingFeatured } =
    useProductStore();
  const { cartItems, addToCart, isUpdatingCart } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const products = featuredProducts;
  const isLoading = isLoadingFeatured;
  const carouselProducts = products.length > 1 ? [...products, ...products] : products;

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
          className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
            <div className="max-w-2xl">
              <h2 className="font-display mb-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Featured <span className="text-gradient">Picks</span>
            </h2>
              <p className="text-sm text-slate-400 sm:text-base lg:text-lg">
              Hand-selected top performers just for you
            </p>
          </div>

          <Link
            to="/shop"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-300 transition-all hover:gap-3 hover:bg-cyan-500/30 sm:text-base"
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
          <div className="group overflow-hidden rounded-4xl border border-white/10 bg-slate-950/30 p-2 sm:p-3 lg:p-4">
            <div
              className={`flex items-stretch gap-3 sm:gap-4 lg:gap-6 ${
                products.length > 1
                  ? "w-max py-1 will-change-transform motion-safe:animate-[featured-marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]"
                  : "w-full flex-wrap"
              }`}
            >
              {carouselProducts.map((p, i) => {
              const inCartQty = getItemQty(p._id);
              const reachedLimit = inCartQty >= 3;
              const isGuest = !user;
              return (
              <MotionDiv
                key={`${p._id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % products.length) * 0.08 }}
                className={`shrink-0 ${
                  products.length > 1
                    ? "w-[78vw] max-w-75 sm:w-75 md:w-80 lg:w-85"
                    : "w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                }`}
              >
                <Link
                  to={`/product/${p._id}`}
                  className="group/card block h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/55 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {/* Featured Badge */}
                  <div className="absolute right-3 top-3 z-10 rounded-full bg-linear-to-r from-violet-500 to-cyan-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-cyan-500/10">
                    Featured
                  </div>

                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-800 sm:aspect-square">
                    {p.imageFile || p.imageUrl ? (
                      <img
                        src={p.imageFile || p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="border-t border-white/5 p-4 sm:p-5">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 sm:text-xs">
                      {p.category || "Hardware"}
                    </p>
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-100 sm:text-[15px]">
                      {p.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-xs text-slate-400 sm:text-sm">
                      {p.description}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <p className="font-display text-base font-bold bg-linear-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent sm:text-lg">
                        {p.price.toLocaleString()} DA
                      </p>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          if (isGuest) {
                            toast.error("Please login to add products to cart");
                            return;
                          }
                          if (reachedLimit) {
                            toast.error("Maximum quantity is 3 for this product");
                            return;
                          }
                          addToCart(p._id);
                        }}
                        disabled={isGuest || isUpdatingCart || reachedLimit}
                        title={
                          isGuest
                            ? "Login required"
                            : reachedLimit
                              ? "Maximum quantity reached"
                              : "Add to cart"
                        }
                        className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400 transition-colors hover:bg-cyan-500/40 disabled:opacity-50"
                      >
                        <HiOutlineShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              </MotionDiv>
              );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400">
              Featured products coming soon.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes featured-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

      `}</style>
    </section>
  );
}