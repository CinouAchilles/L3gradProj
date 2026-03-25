import express from 'express';
import { checkAuth, getProfile, login, logout, refreshToken, signup } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/signup' , signup);

authRouter.post('/login' , login);

authRouter.post('/logout' , logout);

authRouter.post('/refresh-token' , refreshToken);

authRouter.post('/profile' , getProfile);

//just a checker for learning purposes to see if the user is authenticated or not, will be removed later
authRouter.get('/check-auth', checkAuth);

export default authRouter;

// gKaUYKfRmLuDdnQs 