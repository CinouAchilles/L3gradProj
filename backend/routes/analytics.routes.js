import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAnalytics } from '../controllers/analytics.controller.js';


const analyticsRouter = express.Router();

// TODO: add admin only middleware here later
analyticsRouter.get('/' , protectRoute , getAnalytics);


export default analyticsRouter;