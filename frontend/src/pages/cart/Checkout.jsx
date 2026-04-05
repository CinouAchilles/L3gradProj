import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { HiArrowRight, HiOutlineCheckCircle } from "react-icons/hi";
import { FiCreditCard, FiLock, FiMapPin, FiPhone, FiTruck } from "react-icons/fi";

const MotionDiv = motion.div;
const freeShippingThreshold = 250000;

const checkoutItems = [
  {
    _id: "1",
    quantity: 1,
    product: {
      _id: "p1",
      name: "iPhone 13",
      price: 180000,
      category: "Phones",
    },
  },
  {
    _id: "2",
    quantity: 2,
    product: {
      _id: "p2",
      name: "AirPods Pro",
      price: 35000,
      category: "Accessories",
    },
  },
];

export default function Checkout() {
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

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= freeShippingThreshold ? 0 : 1200;
  const total = subtotal + shipping;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const downloadReceiptPdf = () => {
    const doc = new jsPDF();
    const createdAt = new Date();
    const receiptNumber = `CHK-${createdAt.getTime().toString().slice(-6)}`;
    const storeAddress = "12 Cyber Avenue, Algiers, Algeria";

    doc.setFillColor(8, 15, 35);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("HardWorx Checkout Receipt", 14, 20);

    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Premium gaming and hardware store", 14, 27);
    doc.text(`Store location: ${storeAddress}`, 14, 33);
    doc.text("Support: support@hardworx.store | +213 555 010 404", 14, 39);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`Receipt No: ${receiptNumber}`, 140, 20);
    doc.text(`Date: ${createdAt.toLocaleDateString()}`, 140, 26);
    doc.text(`Time: ${createdAt.toLocaleTimeString()}`, 140, 32);
    doc.text(`Payment Method: ${paymentMethod === "baridimob" ? "BaridiMob" : "Cash on Delivery"}`, 140, 38);

    doc.setDrawColor(34, 211, 238);
    doc.line(14, 46, 196, 46);

    doc.setFontSize(14);
    doc.text("Customer Details", 14, 56);
    doc.setFontSize(11);
    doc.text(`Name: ${customer.firstName || "John"} ${customer.lastName || "Doe"}`, 14, 64);
    doc.text(`Phone: ${customer.phone || "+213 555 000 000"}`, 14, 70);
    doc.text(`Address: ${customer.address || "123 Main Street"}`, 14, 76);
    doc.text(`Postal Code: ${customer.postalCode || "16000"}`, 14, 82);

    autoTable(doc, {
      startY: 90,
      head: [["Product", "Category", "Qty", "Unit Price", "Line Total"]],
      body: checkoutItems.map((item) => [
        item.product.name,
        item.product.category,
        String(item.quantity),
        `${item.product.price.toLocaleString()} DA`,
        `${(item.product.price * item.quantity).toLocaleString()} DA`,
      ]),
      theme: "grid",
      styles: {
        fillColor: [15, 23, 42],
        textColor: [226, 232, 240],
        lineColor: [51, 65, 85],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [14, 165, 233],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [30, 41, 59],
      },
      columnStyles: {
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
    });

    const summaryY = doc.lastAutoTable.finalY + 12;

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Subtotal: ${subtotal.toLocaleString()} DA`, 14, summaryY);
    doc.text(`Shipping: ${shipping === 0 ? "Free" : `${shipping.toLocaleString()} DA`}`, 14, summaryY + 8);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${total.toLocaleString()} DA`, 14, summaryY + 18);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("This receipt is a clean frontend preview for your future payment flow.", 14, summaryY + 30);
    doc.text("Order status: Pending payment confirmation", 14, summaryY + 36);

    doc.save(`hardworx-checkout-${receiptNumber}.pdf`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const createdTracking = `ORD-${Date.now().toString().slice(-6)}`;
    setTrackingNumber(createdTracking);
    setOrderSuccess(true);
  };

  return (
    <div className="container-main section-padding">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/80">
          Checkout
        </p>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Secure <span className="text-gradient">Payment</span>
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Fill in the delivery details, confirm the payment method, and generate a polished receipt PDF after placing the order.
        </p>
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
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">First name</span>
                  <input
                    name="firstName"
                    value={customer.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    placeholder="John"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Last name</span>
                  <input
                    name="lastName"
                    value={customer.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    placeholder="Doe"
                  />
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm text-slate-300">Phone number</span>
                <div className="relative">
                  <FiPhone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    placeholder="+213 555 000 000"
                  />
                </div>
              </label>

              <label className="space-y-2 block">
                <span className="text-sm text-slate-300">Delivery address</span>
                <div className="relative">
                  <FiMapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500" />
                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                    placeholder="Street, city, wilaya"
                  />
                </div>
              </label>

              <label className="space-y-2 block max-w-xs">
                <span className="text-sm text-slate-300">Postal code</span>
                <input
                  name="postalCode"
                  value={customer.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
                  placeholder="16000"
                />
              </label>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Payment method</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-4 transition hover:border-cyan-400/30">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="text-cyan-400"
                    />
                    <span>
                      <span className="block font-medium text-white">Cash on delivery</span>
                      <span className="text-sm text-slate-400">Pay when your order arrives</span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-4 transition hover:border-cyan-400/30">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="baridimob"
                      checked={paymentMethod === "baridimob"}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="text-cyan-400"
                    />
                    <span>
                      <span className="block font-medium text-white">BaridiMob</span>
                      <span className="text-sm text-slate-400">Placeholder for online payment later</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                >
                  Confirm Payment <HiArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  Back to Cart
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <HiOutlineCheckCircle className="h-10 w-10" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
                  Order Confirmed
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-white">
                  Payment recorded successfully
                </h2>
                <p className="mt-3 text-slate-400">
                  Your mock order is ready. Download the receipt PDF and keep the tracking number for later.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Tracking number</span>
                  <span className="font-mono text-cyan-300">{trackingNumber}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                  <span>Payment method</span>
                  <span>{paymentMethod === "baridimob" ? "BaridiMob" : "Cash on delivery"}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={downloadReceiptPdf}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
                >
                  Download PDF Receipt
                </button>
                <Link
                  to="/track/demo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  Track Order Later
                </Link>
              </div>
            </div>
          )}
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 xl:sticky xl:top-24 xl:self-start"
        >
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                  Order Summary
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">
                  {checkoutItems.length} items ready
                </h2>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                <FiCreditCard className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {checkoutItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                >
                  <div>
                    <p className="font-medium text-white">{item.product.name}</p>
                    <p className="text-slate-400">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gradient">
                    {(item.product.price * item.quantity).toLocaleString()} DA
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
              <div className="flex items-center justify-between text-slate-300">
                <span>Taxes</span>
                <span>Calculated later</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between text-base font-bold text-white">
                <span>Total</span>
                <span className="text-gradient">{total.toLocaleString()} DA</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl text-sm text-slate-300">
              <FiTruck className="mb-2 h-5 w-5 text-cyan-300" />
              Fast delivery updates included in the receipt.
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl text-sm text-slate-300">
              <FiLock className="mb-2 h-5 w-5 text-cyan-300" />
              Secure order handling with structured payment details.
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
