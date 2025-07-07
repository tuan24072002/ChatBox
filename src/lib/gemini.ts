import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GERMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

export default model;
