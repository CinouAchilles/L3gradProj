import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCartStore } from "../../stores/useCartStore.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

import {
  HiArrowRight,
  HiMinus,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiPlus,
} from "react-icons/hi";
import {
  FiCreditCard,
  FiShield,
  FiTruck,
  FiClock,
  FiPackage,
} from "react-icons/fi";
import downloadInvoicePdf from "../../lib/downloadInvoicePdf";

const MotionDiv = motion.div;

export default function Cart() {
  const {
    cartItems,
    isLoadingCart,
    isUpdatingCart,
    fetchCart,
    updateQuantity,
    removeFromCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const validCartItems = useMemo(
    () => cartItems.filter((item) => item.product && typeof item.product === "object"),
    [cartItems]
  );

  const updateQty = (productId, qty) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }

    const boundedQty = Math.max(1, Math.min(3, qty));
    updateQuantity(productId, boundedQty);
  };

  const subtotal = validCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;
  const totalItems = validCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isLoading = isLoadingCart;

  const handleIncreaseQty = (productId, currentQty) => {
    if (currentQty >= 3) {
      toast.error("You can only add up to 3 of the same product");
      return;
    }
    updateQty(productId, currentQty + 1);
  };

  return (
    <div className="container-main section-padding">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
              Cart Review
            </p>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              Your <span className="text-gradient">Cart</span>
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Review your items, adjust quantities, and prepare the details your
              checkout flow will need: customer info, shipping address, and a
              payment method.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 backdrop-blur-xl transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            Continue Shopping <HiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Items</p>
          <p className="mt-2 text-3xl font-bold text-white">{totalItems}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Subtotal</p>
          <p className="mt-2 text-3xl font-bold text-gradient">
            {subtotal.toLocaleString()} DA
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Shipping</p>
          <p className="mt-2 text-3xl font-bold text-cyan-300">
            {shipping === 0 ? "Free" : `${shipping.toLocaleString()} DA`}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {total.toLocaleString()} DA
          </p>
        </div>
      </MotionDiv>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl animate-pulse">
              <div className="h-24 w-24 rounded-xl bg-slate-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/2 rounded bg-slate-800" />
                <div className="h-4 w-1/4 rounded bg-slate-800" />
                <div className="h-4 w-2/3 rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : validCartItems.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-900/60 p-10 text-center backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <HiOutlineShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="mt-3 text-slate-400">
            Browse the catalog and add a few items to start building your order.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
          >
            Start Shopping <HiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-4">
            {validCartItems.map((item, index) => (
              <MotionDiv
                key={item._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl transition hover:border-cyan-400/30"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Link
                    to={`/product/${item.product._id}`}
                    className="h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shrink-0"
                  >
                    {item.product.imageFile || item.product.imageUrl ? (
                      <img
                        src={item.product.imageFile || item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                        No Image
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                          {item.product.category || "Hardware"}
                        </p>
                        <Link
                          to={`/product/${item.product._id}`}
                          className="mt-1 block truncate text-lg font-semibold text-white hover:text-cyan-300"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-2 text-sm text-slate-400">
                          Ready for checkout review
                        </p>
                      </div>

                      <p className="font-display text-xl font-bold text-gradient">
                        {item.product.price.toLocaleString()} DA
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                        <button
                          onClick={() => updateQty(item.product._id, item.quantity - 1)}
                          disabled={isUpdatingCart}
                          className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
                          aria-label={`Decrease quantity for ${item.product.name}`}
                        >
                          <HiMinus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncreaseQty(item.product._id, item.quantity)}
                          disabled={isUpdatingCart}
                          className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
                          aria-label={`Increase quantity for ${item.product.name}`}
                        >
                          <HiPlus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        disabled={isUpdatingCart}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-50"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>

          <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 backdrop-blur-xl shadow-2xl shadow-black/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                    Order Summary
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white">
                    Ready to Checkout
                  </h3>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <FiPackage className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} DA</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-300" : "text-slate-200"}>
                    {shipping === 0 ? "Free" : `${shipping.toLocaleString()} DA`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Estimated tax</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-center justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span className="text-gradient">{total.toLocaleString()} DA</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300">
                  <FiTruck className="mb-2 h-5 w-5 text-cyan-300" />
                  Fast delivery updates
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300">
                  <FiShield className="mb-2 h-5 w-5 text-cyan-300" />
                  Secure order handling
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300">
                  <FiCreditCard className="mb-2 h-5 w-5 text-cyan-300" />
                  Cash on delivery
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300">
                  <FiClock className="mb-2 h-5 w-5 text-cyan-300" />
                  Review before payment
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Checkout details needed
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>• First and last name</li>
                  <li>• Phone number</li>
                  <li>• Delivery address and postal code</li>
                  <li>• Payment method: cash on delivery or BaridiMob</li>
                </ul>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to="/checkout"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                >
                  Proceed to Checkout <HiArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() =>
                    downloadInvoicePdf({
                      cartItems: validCartItems,
                      subtotal,
                      shipping,
                      total,
                    })
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  Download PDF Preview <HiArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/shop"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  <HiOutlineShoppingBag className="h-4 w-4" />
                  Back to Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed bottom-6 right-6 z-20 rounded-full border border-white/10 bg-slate-950/75 px-4 py-2 backdrop-blur-xl">
          <LoadingSpinner
            size="xs"
            label="Syncing cart..."
            className="text-xs text-slate-200"
            colorClass="border-cyan-300/30 border-t-cyan-300"
          />
        </div>
      )}
    </div>
  );
}