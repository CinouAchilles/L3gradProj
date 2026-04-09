import express from "express";
import { createOrder, deleteOrder, getAllOrders, getMyOrders, getOrderByTrackingNumber, updateOrderStatus } from "../controllers/order.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";


const orderRouter = express.Router();

orderRouter.post("/" , protectRoute , createOrder);
orderRouter.get('/myorders' , protectRoute , getMyOrders);
orderRouter.get("/track/:trackingNumber", getOrderByTrackingNumber);
orderRouter.get("/", protectRoute, adminOnly, getAllOrders);
orderRouter.patch("/:id/status", protectRoute, adminOnly, updateOrderStatus);
orderRouter.delete("/:id", protectRoute, deleteOrder);

export default orderRouter;
