import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
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
import axios from "../../lib/axios.js";
import { useProductStore } from "../../stores/useProductStore.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { Link } from "react-router-dom";

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
  imageFile: "",
  price: "",
  isFeatured: false,
};

const defaultCategorySuggestions = [
  "ram",
  "gpu",
  "cpu",
  "motherboard",
  "storage",
  "psu",
  "case",
  "cooling",
  "monitor",
  "accessories",
  "ready config",
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("analytics");
  const [orders, setOrders] = useState([]);
  const [analyticsCounts, setAnalyticsCounts] = useState({ users: 0, products: 0 });
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProductForm);

  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct: deleteProductFromStore,
    toggleFeatured: toggleFeaturedInStore,
    isLoadingProducts,
    isSavingProduct,
  } = useProductStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoadingDashboard(true);
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          axios.get("/analytics"),
          axios.get("/orders"),
          fetchProducts(),
        ]);

        setAnalyticsCounts({
          users: Number(analyticsRes.data?.users || 0),
          products: Number(analyticsRes.data?.products || 0),
        });
        setOrders(Array.isArray(ordersRes.data?.orders) ? ordersRes.data.orders : []);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    loadDashboardData();
  }, [fetchProducts]);

  const updateOrderStatus = async (id, status) => {
    const previous = orders;
    setIsSyncingOrders(true);
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    try {
      await axios.patch(`/orders/${id}/status`, { status });
    } catch {
      setOrders(previous);
    } finally {
      setIsSyncingOrders(false);
    }
  };

  const toggleFeatured = async (id) => {
    await toggleFeaturedInStore(id);
  };

  const deleteProduct = async (id) => {
    const deleted = await deleteProductFromStore(id);
    if (deleted && editingProductId === id) {
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
      imageUrl: product.imageUrl || product.imageFile || "",
      imageFile: "",
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

    if (name === "imageUrl") {
      setProductForm((prev) => ({
        ...prev,
        imageUrl: value,
        imageFile: value.trim() ? "" : prev.imageFile,
      }));
      return;
    }

    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onProductImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = typeof reader.result === "string" ? reader.result : "";
      if (!base64Image) {
        toast.error("Failed to read image file");
        return;
      }
      setProductForm((prev) => ({
        ...prev,
        imageFile: base64Image,
        imageUrl: "",
      }));
    };
    reader.onerror = () => toast.error("Failed to read image file");
    reader.readAsDataURL(file);
  };

  const saveProduct = async () => {
    const cleanedName = productForm.name.trim();
    const cleanedCategory = productForm.category.trim();
    const cleanedDescription = productForm.description.trim();
    const cleanedImage = productForm.imageUrl.trim();
    const numericPrice = Number(productForm.price);
    const hasUploadedImage = Boolean(productForm.imageFile);

    if (!cleanedName || !cleanedCategory || !cleanedDescription) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!cleanedImage && !hasUploadedImage) {
      toast.error("Please provide an image URL or upload an image");
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      toast.error("Price must be a valid non-negative number");
      return;
    }

    const payload = {
      name: cleanedName,
      category: cleanedCategory,
      description: cleanedDescription,
      imageUrl: cleanedImage || undefined,
      imageFile: hasUploadedImage ? productForm.imageFile : undefined,
      price: numericPrice,
      isFeatured: productForm.isFeatured,
    };

    let result;
    if (editingProductId) {
      result = await updateProduct(editingProductId, payload);
    } else {
      result = await createProduct(payload);
    }

    if (result?.success) {
      closeProductForm();
    }
  };

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.subtotal || 0), 0),
    [orders]
  );

  const topSellingProducts = useMemo(() => {
    const soldMap = new Map();
    for (const order of orders) {
      for (const item of order.items || []) {
        const key = item.name || "Unknown";
        soldMap.set(key, (soldMap.get(key) || 0) + Number(item.quantity || 0));
      }
    }
    return Array.from(soldMap.entries())
      .map(([name, totalSold]) => ({ name, totalSold }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 6);
  }, [orders]);

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString("en-US", { month: "short" }),
        revenue: 0,
        orders: 0,
      });
    }

    const monthIndex = new Map(months.map((m, idx) => [m.key, idx]));

    for (const order of orders) {
      const createdAt = order.createdAt ? new Date(order.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) continue;

      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const idx = monthIndex.get(key);
      if (idx === undefined) continue;

      months[idx].revenue += Number(order.subtotal || 0);
      months[idx].orders += 1;
    }

    return months;
  }, [orders]);

  const stats = [
    {
      label: "Revenue",
      value: `${totalRevenue.toLocaleString()} DA`,
      icon: HiOutlineCurrencyDollar,
    },
    {
      label: "Orders",
      value: orders.length,
      icon: HiOutlineShoppingBag,
    },
    {
      label: "Products",
      value: products.length,
      icon: HiOutlineChartBar,
    },
    {
      label: "Users",
      value: analyticsCounts.users,
      icon: HiOutlineUsers,
    },
  ];

  const tabs = [
    { key: "analytics", label: "Analytics" },
    { key: "orders", label: "Orders" },
    { key: "products", label: "Products" },
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
    totalRevenue / Math.max(orders.length, 1)
  );
  const userToOrderRatio =
    analyticsCounts.users > 0
      ? (orders.length / analyticsCounts.users).toFixed(1)
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
      (productForm.imageUrl.trim() || productForm.imageFile) &&
      Number.isFinite(Number(productForm.price)) &&
      Number(productForm.price) >= 0
    );
  }, [productForm]);

  const categorySuggestions = useMemo(() => {
    const existing = products
      .map((p) => (p.category || "").trim().toLowerCase())
      .filter(Boolean);

    return Array.from(new Set([...defaultCategorySuggestions, ...existing])).sort();
  }, [products]);

  if (isLoadingDashboard) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <LoadingSpinner
          size="md"
          label="Loading admin dashboard..."
          className="text-sm text-slate-200"
          colorClass="border-cyan-300/30 border-t-cyan-300"
        />
      </div>
    );
  }

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
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
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
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
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
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <BarChart data={topSellingProducts}>
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
          <table className="w-full min-w-[1200px] text-sm text-slate-200">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Postal</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
                <th className="px-4 py-3">Products</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const totalQty = o.items.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                );

                return (
                  <tr key={o._id} className="border-t border-white/8">
                    
                    {/* Code */}
                    <td className="px-4 py-3 font-medium text-cyan-300">
                      {o.trackingNumber}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span>
                          {o.customer.firstName} {o.customer.lastName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {o.user?.email}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3">{o.customer.phone}</td>

                    {/* Address */}
                    <td className="px-4 py-3 max-w-50 truncate">
                      {o.customer.address}
                    </td>

                    {/* Postal Code */}
                    <td className="px-4 py-3">{o.customer.postalCode}</td>

                    {/* Quantity */}
                    <td className="px-4 py-3 text-center font-semibold">
                      {totalQty}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 font-semibold">
                      {o.subtotal.toLocaleString()} DA
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-3 capitalize">{o.paymentMethod}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusPill
                        className={statusBadgeClass(o.status)}
                        label={o.status.replace(/_/g, " ")}
                      />
                    </td>

                    {/* Update */}
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(o._id, e.target.value)
                        }
                        disabled={isSyncingOrders}
                        className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                      >
                        {statusOptions.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-slate-900 text-slate-100"
                          >
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Products */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        {o.items.map((item, i) => (
                          <Link
                            key={i}
                            to={`/product/${item.product}`}
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline text-xs"
                          >
                            {item.name} × {item.quantity}
                          </Link>
                        ))}
                      </div>
                    </td>

                  </tr>
                );
              })}
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
              {isLoadingProducts && (
                <p className="mt-1 text-xs text-cyan-300">Syncing product list...</p>
              )}
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
                    list="admin-category-suggestions"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
                    placeholder="ram, gpu, cpu..."
                  />
                  <datalist id="admin-category-suggestions">
                    {categorySuggestions.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                  <p className="text-xs text-slate-400">
                    Suggestions include existing categories and common hardware types.
                  </p>
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
                  <span className="text-sm text-slate-300">Image URL (optional if uploading)</span>
                  <input
                    name="imageUrl"
                    value={productForm.imageUrl}
                    onChange={onProductFormChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
                    placeholder="https://..."
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onProductImageFileChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cyan-200"
                  />
                  <p className="text-xs text-slate-400">
                    Uploading an image will override the image URL field.
                  </p>
                </label>
              </div>

              {(productForm.imageUrl || productForm.imageFile) && (
                <div className="mt-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-400">Image Preview</p>
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 p-2">
                    <img
                      src={productForm.imageFile || productForm.imageUrl}
                      alt="Product preview"
                      className="h-40 w-full rounded-lg object-cover"
                    />
                  </div>
                </div>
              )}

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
                  disabled={!isProductFormValid || isSavingProduct}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSavingProduct
                    ? "Saving..."
                    : editingProductId
                      ? "Save Changes"
                      : "Create Product"}
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
                      {/* <p className="font-medium">{p.name}</p> */}
                      <Link to={`/product/${p._id}`} className="text-cyan-400 hover:underline">
                        {p.name}
                      </Link>
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
