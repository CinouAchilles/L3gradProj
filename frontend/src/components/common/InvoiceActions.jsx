import { HiOutlineDownload, HiOutlinePrinter } from "react-icons/hi";
import { toast } from "react-hot-toast";
import downloadInvoicePdf from "../../lib/downloadInvoicePdf.jsx";

export default function InvoiceActions({
  order,
  className = "",
  buttonClassName = "",
}) {
  if (!order) return null;

  const baseButtonClass =
    "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200";

  const handleDownloadInvoice = () => {
    downloadInvoicePdf({
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      shipping: 0,
      total: Number(order.subtotal || 0),
      trackingNumber: order.trackingNumber,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      mode: "download",
    });
  };

  const handlePrintInvoice = () => {
    const opened = downloadInvoicePdf({
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      shipping: 0,
      total: Number(order.subtotal || 0),
      trackingNumber: order.trackingNumber,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      mode: "print",
    });

    if (!opened) {
      toast.error("Please allow popups to print invoice");
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleDownloadInvoice}
        className={`${baseButtonClass} ${buttonClassName}`}
      >
        <HiOutlineDownload className="h-4 w-4" />
        Download Invoice
      </button>

      <button
        type="button"
        onClick={handlePrintInvoice}
        className={`${baseButtonClass} ${buttonClassName}`}
      >
        <HiOutlinePrinter className="h-4 w-4" />
        Print Invoice
      </button>
    </div>
  );
}
