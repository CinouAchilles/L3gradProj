export function CartDrawer() {
  return (
    <div className="drawer-side z-50">
      <label
        htmlFor="cart-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      />
      <aside className="min-h-full w-full max-w-md bg-base-200/95 p-4 backdrop-blur-xl">
        <h2 className="mb-4 text-2xl font-bold text-white">Cart Summary</h2>

        <div className="glass-card rounded-2xl p-5 text-white/80">
          Login to manage your cart and continue checkout.
        </div>

        {/* {isAuthenticated && isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="skeleton h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : null} */}
      </aside>
    </div>
  );
}


// export function CartDrawer() {
//   return (
//     <div className="drawer-side z-50">
//       <label
//         htmlFor="cart-drawer"
//         aria-label="close sidebar"
//         className="drawer-overlay"
//       />

//       <aside className="flex min-h-full w-full max-w-md flex-col bg-base-200/95 p-4 backdrop-blur-xl text-white">
        
//         {/* Header */}
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-2xl font-bold">Cart Summary</h2>

//           {/* Close button */}
//           <label
//             htmlFor="cart-drawer"
//             className="cursor-pointer rounded-lg border border-white/20 px-3 py-1 text-sm hover:bg-white/10 transition"
//           >
//             Close
//           </label>
//         </div>

//         {/* Content (scrollable) */}
//         <div className="flex-1 space-y-4 overflow-y-auto pr-1">
//           <div className="glass-card rounded-2xl p-5 text-white/80">
//             Login to manage your cart and continue checkout.
//           </div>

//           {/* Skeleton (kept your logic) */}
//           {/* {isAuthenticated && isLoading ? (
//             <div className="space-y-3">
//               {[1, 2, 3].map((item) => (
//                 <div key={item} className="skeleton h-20 w-full rounded-xl" />
//               ))}
//             </div>
//           ) : null} */}
//         </div>

//         {/* Footer / Actions */}
//         <div className="mt-4 border-t border-white/10 pt-4 space-y-3">
//           <div className="flex justify-between text-sm text-white/70">
//             <span>Subtotal</span>
//             <span>$0.00</span>
//           </div>

//           <button className="w-full rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 py-3 font-semibold shadow-md transition hover:opacity-90">
//             Checkout
//           </button>
//         </div>
//       </aside>
//     </div>
//   );
// }