import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import swal from "sweetalert";
import { FiClock, FiPackage, FiTruck, FiUser } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { useUserStore } from "../../stores/useUserStore.jsx";
import { useOrderStore } from "../../stores/useOrderStore.jsx";

const MotionDiv = motion.div;

const statusClassMap = {
  pending: "bg-amber-400/15 text-amber-300 border-amber-300/30",
  confirmed: "bg-cyan-400/15 text-cyan-300 border-cyan-300/30",
  processing: "bg-indigo-400/15 text-indigo-300 border-indigo-300/30",
  shipped: "bg-blue-400/15 text-blue-300 border-blue-300/30",
  delivered: "bg-emerald-400/15 text-emerald-300 border-emerald-300/30",
  cancelled: "bg-rose-400/15 text-rose-300 border-rose-300/30",
};

export default function Profile() {
  const { user } = useUserStore();
  const { myOrders, isLoadingOrders, isDeletingOrder, fetchMyOrders, deleteOrder } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const totalSpent = useMemo(
    () => myOrders.reduce((sum, order) => sum + Number(order.subtotal || 0), 0),
    [myOrders]
  );

  const activeOrders = useMemo(
    () =>
      myOrders.filter((order) =>
        ["pending", "confirmed", "processing", "shipped"].includes(order.status)
      ).length,
    [myOrders]
  );

  const deliveredOrders = useMemo(
    () => myOrders.filter((order) => order.status === "delivered").length,
    [myOrders]
  );

  const initials = `${user?.name?.[0] || "U"}${user?.lastname?.[0] || ""}`.toUpperCase();

  const handleDeleteOrder = async (orderId) => {
    const confirmed = await swal({
      title: "Delete this order?",
      text: "You can only delete pending orders.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!confirmed) return;

    const result = await deleteOrder(orderId);
    if (result.success) {
      toast.success("Order deleted");
      return;
    }

    toast.error(result.message || "Failed to delete order");
  };

  return (
    <div className="container-main section-padding">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
          Account Center
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Your <span className="text-gradient">Profile</span>
        </h1>
      </MotionDiv>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <MotionDiv
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 font-bold text-cyan-200">
                {initials}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {user?.name} {user?.lastname || ""}
                </p>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-slate-400">Role</span>
                <span className="font-semibold capitalize text-white">{user?.role || "customer"}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-slate-400">Total orders</span>
                <span className="font-semibold text-white">{myOrders.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-slate-400">Total spent</span>
                <span className="font-semibold text-white">{totalSpent.toLocaleString()} DA</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
              <FiClock className="mb-2 h-5 w-5 text-cyan-300" />
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Active</p>
              <p className="mt-1 text-2xl font-bold text-white">{activeOrders}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
              <FiTruck className="mb-2 h-5 w-5 text-cyan-300" />
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Delivered</p>
              <p className="mt-1 text-2xl font-bold text-white">{deliveredOrders}</p>
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Recent Orders</h2>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              Shop <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoadingOrders ? (
            <div className="flex min-h-56 items-center justify-center">
              <LoadingSpinner
                size="sm"
                label="Loading orders..."
                className="text-sm text-slate-200"
                colorClass="border-cyan-300/30 border-t-cyan-300"
              />
            </div>
          ) : myOrders.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <FiPackage className="mx-auto mb-3 h-8 w-8 text-slate-400" />
              <p className="font-semibold text-white">No orders yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Once you place an order, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.slice(0, 8).map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Tracking
                      </p>
                      <p className="mt-1 font-mono text-sm text-cyan-300">
                        {order.trackingNumber}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase ${statusClassMap[order.status] || "bg-slate-500/15 text-slate-300 border-slate-300/30"}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
                    <span>{Number(order.subtotal || 0).toLocaleString()} DA</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      to={`/track/${order.trackingNumber}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                    >
                      Track this order <HiArrowRight className="h-4 w-4" />
                    </Link>

                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={isDeletingOrder}
                        className="rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Delete order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </MotionDiv>
      </div>
    </div>
  );
}