import express from "express";
import {
  chatWithAI,
  checkCompatibility,
  createBuildPlan,
} from "../controllers/ai.controller.js";

const aiRoutes = express.Router();

aiRoutes.post("/chat", chatWithAI);
aiRoutes.post("/compatibility", checkCompatibility);
aiRoutes.post("/build-plan", createBuildPlan);


export default aiRoutes;