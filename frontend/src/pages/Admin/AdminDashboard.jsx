import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiPencil,
  HiPlus,
  HiX,
} from "react-icons/hi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AdminStatCard,
  AnimatedGlassPanel,
  GlassPanel,
  SectionHeader,
  StatusPill,
} from "../../components/admin/AdminDashboardUi";

const MotionH1 = motion.h1;
const MotionDiv = motion.div;

const statusOptions = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusColors = {
  pending: "#fbbf24",
  confirmed: "#22d3ee",
  processing: "#818cf8",
  shipped: "#60a5fa",
  delivered: "#34d399",
  cancelled: "#fb7185",
};

const emptyProductForm = {
  name: "",
  category: "",
  description: "",
  imageUrl: "",
  price: "",
  isFeatured: false,
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("analytics");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProductForm);

  const analytics = {
    totalRevenue: 1250000,
    totalOrders: 320,
    totalUsers: 120,
    topSellingProducts: [
      { name: "iPhone 13", totalSold: 50 },
      { name: "Samsung S22", totalSold: 40 },
      { name: "AirPods", totalSold: 35 },
      { name: "PS5", totalSold: 25 },
    ],
  };

  const [orders, setOrders] = useState([
    {
      _id: "1",
      trackingCode: "ORD-001",
      customer: { firstName: "Ali", lastName: "Ben" },
      subtotal: 25000,
      status: "pending",
    },
    {
      _id: "2",
      trackingCode: "ORD-002",
      customer: { firstName: "Sara", lastName: "K." },
      subtotal: 48000,
      status: "confirmed",
    },
    {
      _id: "3",
      trackingCode: "ORD-003",
      customer: { firstName: "Lina", lastName: "M." },
      subtotal: 31500,
      status: "processing",
    },
    {
      _id: "4",
      trackingCode: "ORD-004",
      customer: { firstName: "Yacine", lastName: "R." },
      subtotal: 57000,
      status: "shipped",
    },
    {
      _id: "5",
      trackingCode: "ORD-005",
      customer: { firstName: "Nour", lastName: "H." },
      subtotal: 69000,
      status: "delivered",
    },
  ]);

  const [products, setProducts] = useState([
    {
      _id: "1",
      name: "iPhone 13",
      category: "Phones",
      description: "6.1-inch OLED, A15 chip, dual camera",
      imageUrl: "https://via.placeholder.com/250x250.png?text=iPhone+13",
      price: 180000,
      isFeatured: true,
    },
    {
      _id: "2",
      name: "AirPods Pro",
      category: "Accessories",
      description: "ANC earbuds with wireless charging case",
      imageUrl: "https://via.placeholder.com/250x250.png?text=AirPods+Pro",
      price: 35000,
      isFeatured: false,
    },
  ]);

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  const toggleFeatured = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    if (editingProductId === id) {
      closeProductForm();
    }
  };

  const openCreateProduct = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setIsProductFormOpen(true);
  };

  const openEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      price: String(product.price),
      isFeatured: product.isFeatured,
    });
    setIsProductFormOpen(true);
  };

  const closeProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const onProductFormChange = (event) => {
    const { name, type, checked, value } = event.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveProduct = () => {
    const cleanedName = productForm.name.trim();
    const cleanedCategory = productForm.category.trim();
    const cleanedDescription = productForm.description.trim();
    const cleanedImage = productForm.imageUrl.trim();
    const numericPrice = Number(productForm.price);

    if (!cleanedName || !cleanedCategory || !cleanedDescription || !cleanedImage) {
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return;
    }

    if (editingProductId) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProductId
            ? {
                ...p,
                name: cleanedName,
                category: cleanedCategory,
                description: cleanedDescription,
                imageUrl: cleanedImage,
                price: numericPrice,
                isFeatured: productForm.isFeatured,
              }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        {
          _id: `prod-${Date.now().toString(36)}`,
          name: cleanedName,
          category: cleanedCategory,
          description: cleanedDescription,
          imageUrl: cleanedImage,
          price: numericPrice,
          isFeatured: productForm.isFeatured,
        },
        ...prev,
      ]);
    }

    closeProductForm();
  };

  const stats = [
    {
      label: "Revenue",
      value: `${analytics.totalRevenue.toLocaleString()} DA`,
      icon: HiOutlineCurrencyDollar,
    },
    {
      label: "Orders",
      value: analytics.totalOrders,
      icon: HiOutlineShoppingBag,
    },
    {
      label: "Products",
      value: products.length,
      icon: HiOutlineChartBar,
    },
    {
      label: "Users",
      value: analytics.totalUsers,
      icon: HiOutlineUsers,
    },
  ];

  const tabs = [
    { key: "analytics", label: "Analytics" },
    { key: "orders", label: "Orders" },
    { key: "products", label: "Products" },
  ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 138000, orders: 41 },
    { month: "Feb", revenue: 152000, orders: 44 },
    { month: "Mar", revenue: 168000, orders: 49 },
    { month: "Apr", revenue: 177000, orders: 53 },
    { month: "May", revenue: 194000, orders: 57 },
    { month: "Jun", revenue: 221000, orders: 63 },
  ];

  const statusCounts = statusOptions.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  const statusBreakdown = statusOptions.map((status) => ({
    name: status.replace(/_/g, " "),
    value: statusCounts[status] || 0,
    color: statusColors[status],
  }));

  const featuredCount = products.filter((p) => p.isFeatured).length;
  const featuredRate = products.length
    ? Math.round((featuredCount / products.length) * 100)
    : 0;

  const avgOrderValue = Math.round(
    analytics.totalRevenue / Math.max(analytics.totalOrders, 1)
  );
  const userToOrderRatio =
    analytics.totalUsers > 0
      ? (analytics.totalOrders / analytics.totalUsers).toFixed(1)
      : "0.0";

  const analyticsHighlights = [
    {
      label: "Average Order Value",
      value: `${avgOrderValue.toLocaleString()} DA`,
      note: "Revenue divided by total orders",
    },
    {
      label: "Featured Products",
      value: `${featuredRate}%`,
      note: `${featuredCount} of ${products.length} products highlighted`,
    },
    {
      label: "Orders Per User",
      value: userToOrderRatio,
      note: "Based on current users/orders totals",
    },
    {
      label: "Pending Fulfillment",
      value: statusCounts.pending + statusCounts.processing + statusCounts.confirmed,
      note: "Orders not yet shipped or delivered",
    },
  ];

  const statusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-400/15 text-emerald-300 border-emerald-300/30";
      case "shipped":
        return "bg-blue-400/15 text-blue-300 border-blue-300/30";
      case "processing":
        return "bg-indigo-400/15 text-indigo-300 border-indigo-300/30";
      case "confirmed":
        return "bg-cyan-400/15 text-cyan-300 border-cyan-300/30";
      case "cancelled":
        return "bg-rose-400/15 text-rose-300 border-rose-300/30";
      default:
        return "bg-amber-400/15 text-amber-300 border-amber-300/30";
    }
  };

  const isProductFormValid = useMemo(() => {
    return (
      productForm.name.trim() &&
      productForm.category.trim() &&
      productForm.description.trim() &&
      productForm.imageUrl.trim() &&
      Number.isFinite(Number(productForm.price)) &&
      Number(productForm.price) >= 0
    );
  }, [productForm]);

  return (
    <div className="container-main section-padding relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <MotionH1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-3xl font-bold sm:text-4xl"
      >
        Admin <span className="text-gradient">Dashboard</span>
      </MotionH1>

      <p className="mb-8 max-w-2xl text-sm text-slate-300">
        Manage sales metrics, orders, and product visibility from one control
        panel designed with your storefront visual style.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <AdminStatCard
            key={s.label}
            icon={s.icon}
            label={s.label}
            value={s.value}
            delay={i * 0.05}
          />
        ))}
      </div>

      <div className="mb-8 inline-flex rounded-2xl border border-white/10 bg-slate-900/50 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-linear-to-r from-violet-500 to-cyan-500 text-white"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "analytics" && (
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {analyticsHighlights.map((item) => (
              <GlassPanel
                key={item.label}
                className="p-5"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-100">{item.value}</p>
                <p className="mt-2 text-xs text-slate-400">{item.note}</p>
              </GlassPanel>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <GlassPanel className="p-6">
              <SectionHeader
                icon={HiOutlineSparkles}
                title="Revenue Trend (6 Months)"
              />

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#22d3ee" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <SectionHeader icon={HiOutlineSparkles} title="Order Status" />

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>
          </div>

          <GlassPanel className="p-6">
            <SectionHeader icon={HiOutlineSparkles} title="Top Selling Products" />

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topSellingProducts}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="totalSold" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </MotionDiv>
      )}

      {tab === "orders" && (
        <AnimatedGlassPanel className="overflow-x-auto p-2">
          <table className="w-full min-w-170 text-sm text-slate-200">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-white/8">
                  <td className="px-4 py-3 font-medium text-cyan-300">{o.trackingCode}</td>
                  <td className="px-4 py-3">
                    {o.customer.firstName} {o.customer.lastName}
                  </td>
                  <td className="px-4 py-3">{o.subtotal.toLocaleString()} DA</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      className={statusBadgeClass(o.status)}
                      label={o.status.replace(/_/g, " ")}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-100">
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AnimatedGlassPanel>
      )}

      {tab === "products" && (
        <MotionDiv initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Catalog Controls</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Manage products visually</h3>
            </div>
            <button
              onClick={openCreateProduct}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
            >
              <HiPlus className="h-4 w-4" />
              Add Product
            </button>
          </div>

          {isProductFormOpen && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {editingProductId ? "Edit Product" : "Create Product"}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-white">
                    {editingProductId ? "Update product info" : "Add a new product"}
                  </h4>
                </div>
                <button
                  onClick={closeProductForm}
                  className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                >
                  <HiX className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Name</span>
                  <input
                    name="name"
                    value={productForm.name}
                    onChange={onProductFormChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
                    placeholder="Product name"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Category</span>
                  <input
                    name="category"
                    value={productForm.category}
                    onChange={onProductFormChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
                    placeholder="Phones, Accessories..."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Price (DA)</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={productForm.price}
                    onChange={onProductFormChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
                    placeholder="0"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Image URL</span>
                  <input
                    name="imageUrl"
                    value={productForm.imageUrl}
                    onChange={onProductFormChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
                    placeholder="https://..."
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm text-slate-300">Description</span>
                <textarea
                  name="description"
                  rows={3}
                  value={productForm.description}
                  onChange={onProductFormChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
                  placeholder="Short product summary"
                />
              </label>

              <label className="mt-4 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={productForm.isFeatured}
                  onChange={onProductFormChange}
                  className="h-4 w-4"
                />
                Mark as featured
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={saveProduct}
                  disabled={!isProductFormValid}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingProductId ? "Save Changes" : "Create Product"}
                </button>
                <button
                  onClick={closeProductForm}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 p-2 backdrop-blur-xl">
            <table className="w-full min-w-170 text-sm text-slate-200">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-white/8">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="max-w-52 truncate text-xs text-slate-400">{p.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.category}</td>
                    <td className="px-4 py-3">{p.price.toLocaleString()} DA</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(p._id)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          p.isFeatured
                            ? "border-amber-300/30 bg-amber-300/15 text-amber-300"
                            : "border-slate-500/40 bg-slate-500/15 text-slate-300"
                        }`}
                      >
                        {p.isFeatured ? "Featured" : "Not featured"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                        >
                          <HiPencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-400/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionDiv>
      )}
    </div>
  );
}
