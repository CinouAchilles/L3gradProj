import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function downloadInvoicePdf({
  items = [],
  cartItems = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
  trackingNumber = "",
  paymentMethod = "cash_on_delivery",
  createdAt = new Date(),
  mode = "download",
} = {}) {
    const doc = new jsPDF();
    const createdDate = createdAt ? new Date(createdAt) : new Date();
    const receiptNumber = trackingNumber || `RCPT-${Date.now().toString().slice(-6)}`;
    const sourceItems = Array.isArray(items) && items.length ? items : cartItems;

    const normalizedItems = sourceItems.map((item) => {
      const name = item.name || item.product?.name || "Unknown product";
      const category = item.product?.category || "Hardware";
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.price ?? item.product?.price ?? 0);
      const lineTotal = Number(item.lineTotal ?? unitPrice * quantity);
      return { name, category, quantity, unitPrice, lineTotal };
    });

    const computedSubtotal = Number(
      subtotal || normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    );
    const computedTotal = Number(total || computedSubtotal + Number(shipping || 0));

    doc.setFillColor(8, 15, 35);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("HardWorx Invoice", 14, 20);

    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Premium gaming and hardware store", 14, 27);
    doc.text("Store address: 12 Cyber Avenue, Algiers, Algeria", 14, 33);
    doc.text("Support: support@hardworx.store | +213 555 010 404", 14, 39);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`Receipt No: ${receiptNumber}`, 140, 20);
    doc.text(`Date: ${createdDate.toLocaleDateString()}`, 140, 26);
    doc.text(`Time: ${createdDate.toLocaleTimeString()}`, 140, 32);
    doc.text(`Payment Method: ${String(paymentMethod).replace(/_/g, " ")}`, 140, 38);

    doc.setDrawColor(34, 211, 238);
    doc.line(14, 46, 196, 46);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Customer / Order Summary", 14, 56);

    autoTable(doc, {
      startY: 62,
      head: [["Product", "Category", "Qty", "Unit Price", "Line Total"]],
      body: normalizedItems.map((item) => [
        item.name,
        item.category,
        String(item.quantity),
        `${item.unitPrice.toLocaleString()} DA`,
        `${item.lineTotal.toLocaleString()} DA`,
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

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Subtotal: ${computedSubtotal.toLocaleString()} DA`, 14, summaryY);
    doc.text(`Shipping: ${shipping === 0 ? "Free" : `${shipping.toLocaleString()} DA`}`, 14, summaryY + 8);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${computedTotal.toLocaleString()} DA`, 14, summaryY + 18);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for your order with HardWorx.", 14, summaryY + 30);
    doc.text("For support, contact support@hardworx.store.", 14, summaryY + 36);

    const fileName = `hardworx-invoice-${receiptNumber}.pdf`;

    if (mode === "print") {
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, "_blank");

      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.focus();
          printWindow.print();
        });
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        return true;
      }

      URL.revokeObjectURL(blobUrl);
      return false;
    }

    doc.save(fileName);
    return true;
}