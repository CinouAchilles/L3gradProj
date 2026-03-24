import express from 'express';
import { getProfile, login, logout, refreshToken, signup } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/signup' , signup);

authRouter.post('/login' , login);

authRouter.post('/logout' , logout);

authRouter.post('/refresh-token' , refreshToken);

authRouter.post('/profile' , getProfile);

export default authRouter;

// gKaUYKfRmLuDdnQs 