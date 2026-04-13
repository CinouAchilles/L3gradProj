import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // fast + free tier friendly
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("AI generation failed");
  }
};