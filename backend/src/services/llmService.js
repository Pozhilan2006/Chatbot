const { GoogleGenerativeAI } = require("@google/generative-ai");
const SYSTEM_PROMPT = require('../utils/systemPrompt');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseUserIntent = async (userMessage, walletAddress) => {
    try {
        // Initialize the model
        // Using gemini-1.5-flash as default if not specified, it's fast and good for this executing tasks
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT, // Pass system prompt here
        });

        const prompt = `User Wallet: ${walletAddress}\nMessage: ${userMessage}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response to ensure valid JSON
        let jsonString = text.replace(/```json\n?|\n?```/g, "").trim();

        // Sometimes Gemini adds extra text, try to find the first { and last }
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonString = jsonString.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(jsonString);
        return parsed;

    } catch (error) {
        console.error('LLM Intent Parsing Error (Gemini):', error);
        const fs = require('fs');
        fs.appendFileSync('backend_error.log', `[${new Date().toISOString()}] Error: ${error.message}\n${JSON.stringify(error, null, 2)}\n`);
        return {
            intent_detected: false,
            error: `Failed to process intent. Debug: ${error.message}`,
            confidence: 0,
        };
    }
};

module.exports = { parseUserIntent };
