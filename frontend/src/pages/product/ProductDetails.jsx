import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiOutlineShoppingCart } from "react-icons/hi";
import { FiPackage, FiShield, FiTruck } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";
import axios from "../../lib/axios.js";

const MotionDiv = motion.div;

export default function ProductDetails() {
  const { id } = useParams();

  const {
    currentProduct,
    recommendedProducts,
    isLoadingProducts,
    fetchProductById,
    fetchRecommendedProducts,
  } = useProductStore();
  const { cartItems, addToCart, isUpdatingCart } = useCartStore();
  const { user } = useUserStore();
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [isAskingAI, setIsAskingAI] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id);
    fetchRecommendedProducts();
  }, [id, fetchProductById, fetchRecommendedProducts]);

  const product = currentProduct;

  const relatedProducts = useMemo(
    () => recommendedProducts.filter((item) => item._id !== id).slice(0, 3),
    [recommendedProducts, id],
  );

  const highlights = useMemo(() => {
    if (!product?.description) return [];
    return product.description
      .split(".")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [product]);

  const inCartQty = product?._id
    ? Number(
        cartItems.find((cartItem) => cartItem.product?._id === product._id)
          ?.quantity || 0,
      )
    : 0;

  const reachedLimit = inCartQty >= 3;
  const isGuest = !user;
  const selectedProductIds = useMemo(
    () => cartItems.map((item) => item.product?._id).filter(Boolean),
    [cartItems],
  );

  const askAI = async (promptText) => {
    const finalPrompt = (promptText || aiPrompt || "").trim();
    if (!finalPrompt || isAskingAI) return;

    setIsAskingAI(true);
    try {
      const res = await axios.post("/ai/chat", {
        prompt: finalPrompt,
        selectedProductIds: Array.from(new Set([...selectedProductIds, product._id])),
      });
      setAiReply(res.data?.reply || "No response from AI assistant.");
      if (!promptText) setAiPrompt("");
    } catch (error) {
      toast.error(error.response?.data?.error || "AI request failed");
    } finally {
      setIsAskingAI(false);
    }
  };

    const specs = useMemo(
    () => ({
      Category: product?.category || "General",
      Price: `${Number(product?.price || 0).toLocaleString()} DA`,
      // Featured: product?.isFeatured ? "Yes" : "No",
      // Warranty: "12 months",
    }),
    [product],
  );

    if (isLoadingProducts) {
    return (
      <div className="container-main section-padding">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-10 text-center backdrop-blur-xl text-slate-300">
          Loading product details...
        </div>
      </div>
    );
  }




  if (!product) {
    return (
      <div className="container-main section-padding">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-10 text-center backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
            Product Not Found
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white">
            This product could not be found.
          </h1>
          <p className="mt-3 text-slate-400">
            It may have been removed, unpublished, or the link is invalid.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20"
          >
            Back to Shop <HiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main section-padding">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
          Product Details
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link to="/" className="transition hover:text-cyan-300">Home</Link>
          <span>/</span>
          <Link to="/shop" className="transition hover:text-cyan-300">Shop</Link>
          <span>/</span>
          <span className="text-slate-200">{product.name}</span>
        </div>
      </MotionDiv>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <MotionDiv
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl"
        >
          <div className="aspect-square bg-slate-950/50 p-6">
            <img
              src={product.imageFile || product.imageUrl}
              alt={product.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                {product.category}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold text-white">
                {product.name}
              </h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200">
              <FiPackage className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 text-sm text-slate-300">
            <span>In stock</span>
          </div>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            {product.description}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Price
            </p>
            <p className="mt-2 font-display text-4xl font-bold text-gradient">
              {product.price.toLocaleString()} DA
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                addToCart(product._id);
              }}
              disabled={isGuest || isUpdatingCart || reachedLimit}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
            >
              <HiOutlineShoppingCart className="h-4 w-4" />
              {isGuest
                ? "Login to Add"
                : isUpdatingCart
                  ? "Adding..."
                  : reachedLimit
                    ? "Max Quantity Reached"
                    : "Add to Cart"}
            </button>
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              Buy Now <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <FiTruck className="mb-2 h-5 w-5 text-cyan-300" />
              Fast delivery
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <FiShield className="mb-2 h-5 w-5 text-cyan-300" />
              Secure checkout
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <FiPackage className="mb-2 h-5 w-5 text-cyan-300" />
              Carefully packed
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">AI Advisor</p>
            <p className="mt-2 text-sm text-slate-300">
              Ask about this part, compatibility with your cart, or bottleneck risks.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  askAI(
                    `Is ${product.name} a good choice for a ${product.category} build? Give pros, cons, and alternatives from this store.`,
                  )
                }
                disabled={isAskingAI}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-50"
              >
                Evaluate This Part
              </button>
              <button
                type="button"
                onClick={() =>
                  askAI(
                    `Check compatibility and possible bottlenecks between my selected parts and ${product.name}.`,
                  )
                }
                disabled={isAskingAI}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-50"
              >
                Check Bottleneck
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={aiPrompt}
                onChange={(event) => setAiPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") askAI();
                }}
                placeholder="Ask AI about this product..."
                className="h-10 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => askAI()}
                disabled={isAskingAI || !aiPrompt.trim()}
                className="rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isAskingAI ? "Thinking..." : "Ask"}
              </button>
            </div>

            {aiReply && (
              <div className="mt-3 whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-200">
                {aiReply}
              </div>
            )}
          </div>
        </MotionDiv>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            Key Highlights
          </p>
          <ul className="mt-4 space-y-3 text-slate-300">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            Technical Specs
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Object.entries(specs).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
        </MotionDiv>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
              Recommended
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              More products to explore
            </h2>
          </div>
          <Link to="/shop" className="text-sm text-cyan-300 transition hover:text-cyan-200">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl transition hover:border-cyan-400/30"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-950/50">
                <img
                  src={item.imageFile || item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                {item.category}
              </p>
              <h3 className="mt-1 font-semibold text-white">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.price.toLocaleString()} DA</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
