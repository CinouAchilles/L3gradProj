import { generateResponse } from "../services/groq.js";

export const chatWithAI = async (req, res) => {
  try {
    console.log("Received prompt:", req.body.prompt);
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const reply = await generateResponse(prompt);

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
