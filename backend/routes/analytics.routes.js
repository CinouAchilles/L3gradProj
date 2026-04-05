import express from 'express';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalytics } from '../controllers/analytics.controller.js';


const analyticsRouter = express.Router();

analyticsRouter.get('/' , protectRoute, adminOnly, getAnalytics);


export default analyticsRouter;