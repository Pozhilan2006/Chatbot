const OpenAI = require('openai');
const SYSTEM_PROMPT = require('../utils/systemPrompt');
require('dotenv').config();

const configuration = {
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_API_URL,
};

// Check if baseURL is valid and not empty for generic OpenAI compatible APIs
if (!configuration.baseURL || configuration.baseURL === '') {
    delete configuration.baseURL;
}

const openai = new OpenAI(configuration);

const parseUserIntent = async (userMessage, walletAddress) => {
    try {
        const completion = await openai.chat.completions.create({
            model: process.env.LLM_MODEL || 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `User Wallet: ${walletAddress}\nMessage: ${userMessage}` },
            ],
            response_format: { type: 'json_object' },
            max_tokens: 500,
        });

        const content = completion.choices[0].message.content;
        const parsed = JSON.parse(content);
        return parsed;
    } catch (error) {
        console.error('LLM Intent Parsing Error:', error);
        return {
            intent_detected: false,
            error: 'Failed to process intent.',
            confidence: 0,
        };
    }
};

module.exports = { parseUserIntent };
