import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function downloadInvoicePdf({
  cartItems = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
} = {}) {
    const doc = new jsPDF();
    const createdAt = new Date();
    const receiptNumber = `RCPT-${createdAt.getTime().toString().slice(-6)}`;

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
    doc.text(`Date: ${createdAt.toLocaleDateString()}`, 140, 26);
    doc.text(`Time: ${createdAt.toLocaleTimeString()}`, 140, 32);
    doc.text("Payment Method: Cash on Delivery", 140, 38);

    doc.setDrawColor(34, 211, 238);
    doc.line(14, 46, 196, 46);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Customer / Order Summary", 14, 56);

    autoTable(doc, {
      startY: 62,
      head: [["Product", "Category", "Qty", "Unit Price", "Line Total"]],
      body: cartItems.map((item) => [
        item.product?.name || "Unknown product",
        item.product?.category || "Hardware",
        String(item.quantity || 0),
        `${Number(item.product?.price || 0).toLocaleString()} DA`,
        `${(Number(item.product?.price || 0) * Number(item.quantity || 0)).toLocaleString()} DA`,
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
    doc.text(`Subtotal: ${subtotal.toLocaleString()} DA`, 14, summaryY);
    doc.text(`Shipping: ${shipping === 0 ? "Free" : `${shipping.toLocaleString()} DA`}`, 14, summaryY + 8);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${total.toLocaleString()} DA`, 14, summaryY + 18);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Delivery details to be confirmed at checkout.", 14, summaryY + 30);
    doc.text("Order status: Pending payment confirmation", 14, summaryY + 36);

    doc.save(`hardworx-invoice-${receiptNumber}.pdf`);
}