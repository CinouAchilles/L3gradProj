import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";

export function CartDrawer() {
  const { cartItems, fetchCart, getSubtotal } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = getSubtotal();

  return (
    <div className="drawer-side z-50">
      <label
        htmlFor="cart-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      />
      <aside className="min-h-full w-full max-w-md bg-base-200/95 p-4 backdrop-blur-xl">
        <h2 className="mb-4 text-2xl font-bold text-white">Cart Summary</h2>

        <div className="space-y-3">
          {cartItems.length === 0 ? (
            <div className="glass-card rounded-2xl p-5 text-white/80">Your cart is empty.</div>
          ) : (
            cartItems.slice(0, 4).map((item) => (
              <div key={item.product?._id || item._id} className="glass-card rounded-2xl p-4 text-white/90">
                <p className="font-semibold">{item.product?.name}</p>
                <p className="text-sm text-white/70">Qty {item.quantity}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 p-4 text-white">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString()} DA</span>
          </div>
          <Link to="/cart" className="mt-3 inline-flex w-full justify-center rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 py-2.5 font-semibold text-white">
            Go to Cart
          </Link>
        </div>
      </aside>
    </div>
  );
}