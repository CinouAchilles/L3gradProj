import express from "express";
import { createOrder, getAllOrders, getMyOrders, getOrderByTrackingCode, updateOrderStatus } from "../controllers/order.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";


const orderRouter = express.Router();

orderRouter.post("/" , protectRoute , createOrder);
orderRouter.get('/myorders' , protectRoute , getMyOrders);
orderRouter.get("/track/:trackingCode", getOrderByTrackingCode);
orderRouter.get("/", protectRoute, getAllOrders);
//TODO: add admin only middleware here later
orderRouter.patch("/:id/status", protectRoute, updateOrderStatus);

export default orderRouter;
