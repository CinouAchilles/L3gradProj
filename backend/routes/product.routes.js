import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts } from '../controllers/product.controller.js';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';

const productRouter = express.Router();

productRouter.get('/', protectRoute  , getAllProducts);
productRouter.get('/featured', getFeaturedProducts);
productRouter.post('/createproduct' , protectRoute, createProduct );
productRouter.delete('/deleteproduct/:id' , protectRoute, deleteProduct );

export default productRouter;