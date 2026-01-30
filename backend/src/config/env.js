require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3001,
    LLM_API_KEY: process.env.LLM_API_KEY,
    LLM_API_URL: process.env.LLM_API_URL,
    LLM_MODEL: process.env.LLM_MODEL || 'gpt-4o',
};
