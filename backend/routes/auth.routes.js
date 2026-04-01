import express from 'express';
import { checkAuth, getProfile, login, logout, refreshToken, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup' , signup);

authRouter.post('/login' , login);

authRouter.post('/logout' , logout);

authRouter.post('/refresh-token' , refreshToken);

authRouter.get('/profile' , protectRoute, getProfile);

//just a checker for learning purposes to see if the user is authenticated or not, will be removed later
authRouter.get('/check-auth', checkAuth);

export default authRouter;

// gKaUYKfRmLuDdnQs 