import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getByCategoryProducts, getFeaturedProducts, getProductById, getRecommendedUnderProduct, toggleFeaturedStatus, updateProduct } from '../controllers/product.controller.js';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';

const productRouter = express.Router();

productRouter.get('/', protectRoute  , getAllProducts);
productRouter.get('/featured', getFeaturedProducts);
productRouter.get('/recommended', getRecommendedUnderProduct); // adi tkoun ta7t lproduct ki td5l 3la product details page yjib products recommended li ta7t lproduct details
productRouter.get('/category/:category', getByCategoryProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/createproduct' , protectRoute, adminOnly, createProduct );
productRouter.patch('/updateproduct/:id' , protectRoute, adminOnly, updateProduct );
productRouter.delete('/deleteproduct/:id' , protectRoute, adminOnly, deleteProduct );
productRouter.patch('/featured/:id' , protectRoute, adminOnly, toggleFeaturedStatus);

export default productRouter;