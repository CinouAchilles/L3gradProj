import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiOutlineShoppingCart } from "react-icons/hi2";
import { MdStar } from "react-icons/md";

const MotionDiv = motion.div;

export default function FeaturedProducts() {
  // 🔥 Mock featured products with enhanced data
  const products = [
    {
      _id: "1",
      name: "iPhone 13",
      price: 180000,
      imageUrl: "https://via.placeholder.com/300x300.png?text=iPhone+13",
      category: "Phones",
      description: "Latest iPhone with A15 Bionic chip, ProMotion display, and advanced camera system",
      rating: 4.8,
      reviews: 324,
    },
    {
      _id: "2",
      name: "AirPods Pro",
      price: 35000,
      imageUrl: "https://via.placeholder.com/300x300.png?text=AirPods+Pro",
      category: "Accessories",
      description: "Premium wireless earbuds with active noise cancellation and spatial audio",
      rating: 4.6,
      reviews: 218,
    },
    {
      _id: "3",
      name: "Samsung S22",
      price: 150000,
      imageUrl: "https://via.placeholder.com/300x300.png?text=Samsung+S22",
      category: "Phones",
      description: "Flagship smartphone with Snapdragon processor and stunning AMOLED display",
      rating: 4.7,
      reviews: 456,
    },
    {
      _id: "4",
      name: "PlayStation 5",
      price: 300000,
      imageUrl: "https://via.placeholder.com/300x300.png?text=PS5",
      category: "Consoles",
      description: "Next-gen gaming console with ultra-high speed SSD and ray tracing support",
      rating: 4.9,
      reviews: 892,
    },
  ];

  // simulate loading if you want (set to true to preview skeleton)
  const isLoading = false;

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
            {products.map((p, i) => (
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
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
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

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, j) => (
                          <MdStar
                            key={j}
                            className={`w-3.5 h-3.5 ${
                              j < Math.floor(p.rating)
                                ? "text-yellow-400"
                                : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        ({p.reviews})
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <p className="font-display text-lg font-bold bg-linear-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                        {p.price.toLocaleString()} DA
                      </p>
                      <button className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors">
                        <HiOutlineShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              </MotionDiv>
            ))}
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