import express from 'express';
import { getAllProducts, getFeaturedProducts } from '../controllers/product.controller.js';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';

const productRouter = express.Router();

productRouter.get('/', protectRoute , adminOnly , getAllProducts);
productRouter.get('/featured', getFeaturedProducts);

export default productRouter;