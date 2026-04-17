import express from 'express'
import { addToCart, deleteAllProductsOfCart, deleteWholeProductFromCart, getAllCartProducts, updateTheQuantityOfProductInCart } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const cartRouter = express.Router();

cartRouter.get('/' , protectRoute ,getAllCartProducts ) //get all products in cart of the user
cartRouter.post('/add' , protectRoute ,addToCart )
cartRouter.delete('/delete' , protectRoute ,deleteWholeProductFromCart )
cartRouter.put('/:id' , protectRoute ,updateTheQuantityOfProductInCart ) //update quantity
cartRouter.delete('/delete-all', protectRoute , deleteAllProductsOfCart);




export default cartRouter;