import express from "express";
import { createOrder, getAllOrders, getMyOrders, getOrderByTrackingCode, updateOrderStatus } from "../controllers/order.controller";
import { adminOnly, protectRoute } from "../middleware/auth.middleware";


const orderRouter = express.Router();

orderRouter.post("/" , protectRoute , createOrder);
orderRouter.get('/myorders' , protectRoute , getMyOrders);
orderRouter.get("/track/:trackingCode", getOrderByTrackingCode);
orderRouter.get("/", protectRoute, adminOnly, getAllOrders);
orderRouter.patch("/:id/status", protectRoute, adminOnly, updateOrderStatus);

export default orderRouter;
