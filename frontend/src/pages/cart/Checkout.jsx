import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight, HiOutlineCheckCircle } from "react-icons/hi";
import { useCartStore } from "../../stores/useCartStore";
import { useOrderStore } from "../../stores/useOrderStore";

const MotionDiv = motion.div;
const freeShippingThreshold = 250000;

export default function Checkout() {
  const { cartItems, fetchCart, getSubtotal } = useCartStore();
  const { createOrder, isCreatingOrder } = useOrderStore();

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = getSubtotal();
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 1200;
  const total = subtotal + shipping;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await createOrder({ customer, paymentMethod });
    if (!result.success) return;

    setTrackingNumber(result.order?.trackingNumber || "");
    setOrderSuccess(true);
    fetchCart();
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="container-main section-padding">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-300">
          Your cart is empty. Add products before checkout.
          <div>
            <Link to="/shop" className="mt-5 inline-flex rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-white">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main section-padding">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Secure <span className="text-gradient">Checkout</span>
        </h1>
      </MotionDiv>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <MotionDiv
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          {!orderSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input name="firstName" value={customer.firstName} onChange={handleChange} required placeholder="First name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
                <input name="lastName" value={customer.lastName} onChange={handleChange} required placeholder="Last name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              </div>
              <input name="phone" value={customer.phone} onChange={handleChange} required placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <textarea name="address" value={customer.address} onChange={handleChange} required rows={4} placeholder="Address" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input name="postalCode" value={customer.postalCode} onChange={handleChange} required placeholder="Postal code" className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white" />

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Payment method</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <span className="text-white">Cash on delivery</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="baridimob"
                      checked={paymentMethod === "baridimob"}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <span className="text-white">BaridiMob</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {isCreatingOrder ? "Placing order..." : "Place Order"} <HiArrowRight className="h-4 w-4" />
                </button>
                <Link to="/cart" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200">
                  Back to Cart
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <HiOutlineCheckCircle className="h-10 w-10" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white">Order created successfully</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Tracking number</span>
                  <span className="font-mono text-cyan-300">{trackingNumber}</span>
                </div>
              </div>
              <Link to={`/track/${trackingNumber}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white">
                Track Order
              </Link>
            </div>
          )}
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="font-display text-2xl font-bold text-white">Order Summary</h2>
            <div className="mt-6 space-y-3">
              {cartItems.map((item) => (
                <div key={item.product?._id || item._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div>
                    <p className="font-medium text-white">{item.product?.name}</p>
                    <p className="text-slate-400">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gradient">
                    {(Number(item.product?.price || 0) * Number(item.quantity || 0)).toLocaleString()} DA
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} DA</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `${shipping.toLocaleString()} DA`}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between text-base font-bold text-white">
                <span>Total</span>
                <span className="text-gradient">{total.toLocaleString()} DA</span>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
