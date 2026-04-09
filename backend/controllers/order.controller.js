import Order from "../models/order.model.js";
import mongoose from "mongoose";

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const generateTrackingNumber = () => {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timestampPart = Date.now().toString(36).slice(-4).toUpperCase();
  return `ORD-${timestampPart}${randomPart}`;
};

export const createOrder = async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const { customer, paymentMethod } = req.body || {};

    if (!customer) {
      return res.status(400).json({ message: "Customer information is required" });
    }

    const { firstName, lastName, phone, address, postalCode } = customer;
    if (!firstName || !lastName || !phone || !address || !postalCode) {
      console.log("❌ Missing customer fields", customer);
      return res.status(400).json({
        message: "firstName, lastName, phone, address, and postalCode are required",
      });
    }

    if (!user.cartItems || user.cartItems.length === 0) {
      console.log("❌ Cart is empty");
      return res.status(400).json({ message: "Cart is empty" });
    }

    await user.populate("cartItems.product");

    const invalidCartItem = user.cartItems.find((item) => !item.product);
    if (invalidCartItem) {
      console.log("❌ Invalid cart item (product missing):", invalidCartItem);
      return res.status(400).json({
        message: "One or more products in the cart no longer exist",
      });
    }

    const items = [];
    for (const cartItem of user.cartItems) {

      const quantity = Number(cartItem.quantity);
      if (quantity > 3) {
        console.log("❌ Quantity exceeds 3 for product:", cartItem.product.name);
        return res.status(400).json({
          message: `Max quantity per product is 3. Problem with: ${cartItem.product.name}`,
        });
      }

      items.push({
        product: cartItem.product._id,
        name: cartItem.product.name,
        price: Number(cartItem.product.price),
        image: cartItem.product.imageFile || cartItem.product.imageUrl,
        quantity,
      });
    }


    const trackingNumber = generateTrackingNumber();

    const order = await Order.create({
      user: user._id,
      trackingNumber,
      paymentMethod: paymentMethod || "cash_on_delivery",
      customer,
      items,
    });


    await user.updateOne({ $set: { cartItems: [] } });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(" FULL ERROR creating order:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price imageFile imageUrl");

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while retrieving orders" });
  }
};
export const getOrderByTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    if (!trackingNumber) {
      return res.status(400).json({ message: "Tracking number is required" });
    }

    const normalizedTrackingNumber = trackingNumber.toUpperCase();
    const order = await Order.findOne({
      trackingNumber: normalizedTrackingNumber,
    })
      .populate("user", "name email")
      .populate("items.product", "name price imageFile imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error("Error retrieving order by tracking code:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while retrieving the order" });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    // || req.user.role !== "admin"
    if (!req.user ) {
      return res.status(403).json({ message: "Admin access only" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while retrieving all orders",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating order status" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isAdmin = user.role === "admin";
    const isOwner = order.user?.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not allowed to delete this order" });
    }

    if (!isAdmin && order.status !== "pending") {
      return res.status(400).json({
        message: "You can only delete orders that are still pending",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      message: "Order deleted successfully",
      orderId: id,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while deleting order" });
  }
};
