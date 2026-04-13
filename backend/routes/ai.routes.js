import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";

const aiRoutes = express.Router();

aiRoutes.get('/chat' , chatWithAI);


export default aiRoutes;