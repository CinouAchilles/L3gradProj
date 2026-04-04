import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineSearch, HiOutlinePrinter, HiOutlineReceiptTax } from "react-icons/hi";
import { FiCheckCircle, FiPackage, FiTruck } from "react-icons/fi";
import toast from "react-hot-toast";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;

const statusMeta = {
  pending_phone_confirmation: {
    label: "Pending confirmation",
    color: "text-yellow-300",
    dot: "bg-yellow-300",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-cyan-300",
    dot: "bg-cyan-300",
  },
  completed: {
    label: "Delivered",
    color: "text-emerald-300",
    dot: "bg-emerald-300",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-rose-300",
    dot: "bg-rose-300",
  },
};

const defaultTimeline = [
  {
    title: "Order placed",
    description: "Your order has been received and queued for processing.",
    icon: FiCheckCircle,
  },
  {
    title: "Packed",
    description: "Items are packed and ready for dispatch.",
    icon: FiPackage,
  },
  {
    title: "In transit",
    description: "The package is on the way to your delivery address.",
    icon: FiTruck,
  },
];

const buildMockOrder = (code) => ({
  trackingCode: code || "ABC123",
  status: "confirmed",
  items: [
    { product: { name: "Gaming Mouse" }, quantity: 1, lineTotal: 12000 },
    { product: { name: "Keyboard" }, quantity: 1, lineTotal: 25000 },
  ],
  subtotal: 37000,
});

export default function TrackOrder() {
  const { trackingCode } = useParams();
  const [input, setInput] = useState(trackingCode || "");
  const [order, setOrder] = useState(
    trackingCode ? buildMockOrder(trackingCode) : null,
  );

  const handleTrack = (e) => {
    e.preventDefault();

    setOrder(buildMockOrder(input));
  };

  const handlePrint = () => {
    toast.success("Invoice ready for print.");
  };

  const currentStatus = statusMeta[order?.status] || statusMeta.confirmed;

  return (
    <div className="relative section-padding">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-6 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="container-main relative z-10 mx-auto max-w-5xl">
        <MotionH1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold sm:text-4xl"
        >
          Track <span className="text-gradient">Order</span>
        </MotionH1>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Enter your tracking code to see the latest status, items, and order summary.
        </p>

        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-8">
            <form onSubmit={handleTrack} className="space-y-4 sm:flex sm:gap-3 sm:space-y-0">
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter tracking code..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-400 transition focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-[0_0_24px_rgba(24,230,245,0.25)] sm:w-auto"
              >
                Track
              </button>
            </form>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Orders", value: "24/7" },
                { label: "Updates", value: "Live" },
                { label: "Support", value: "Fast" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                >
                  <p className="text-lg font-bold text-slate-100">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-8">
            {!order ? (
              <div className="flex h-full min-h-80 flex-col items-start justify-center space-y-4">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <HiOutlineReceiptTax className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-slate-100">
                  No order loaded yet
                </h2>
                <p className="text-sm leading-relaxed text-slate-400">
                  Use a tracking code from your order confirmation to load the order
                  summary here.
                </p>
              </div>
            ) : (
              <MotionDiv
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Tracking Code
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-100">
                      {order.trackingCode}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${currentStatus.color}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${currentStatus.dot}`} />
                    {currentStatus.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-100">Items</h3>
                  {order.items.map((item) => (
                    <div
                      key={item.product.name}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-100">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-slate-400">Qty {item.quantity}</p>
                      </div>

                      <p className="text-sm font-semibold text-cyan-300">
                        {item.lineTotal.toLocaleString()} DA
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-3">
                  {defaultTimeline.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div key={step.title} className="flex gap-3 sm:block">
                        <div className="mt-0.5 rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300 sm:mb-3 sm:mt-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-100">
                            {index + 1}. {step.title}
                          </p>
                          <p className="text-xs leading-relaxed text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-black text-gradient">
                      {order.subtotal.toLocaleString()} DA
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200"
                  >
                    <HiOutlinePrinter className="h-4 w-4" />
                    Invoice
                  </button>
                </div>
              </MotionDiv>
            )}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}