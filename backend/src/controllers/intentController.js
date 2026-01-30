const { parseUserIntent } = require('../services/llmService');
const { isValidAddress } = require('../services/web3Service');

const handleParseIntent = async (req, res) => {
    try {
        const { user_message, wallet_address } = req.body;

        if (!user_message) {
            return res.status(400).json({ error: 'Missing user message' });
        }

        if (!isValidAddress(wallet_address)) {
            // It is good to have a wallet address to give context, but we can proceed for general questions.
            // However, for transactions, we need it.
            // We'll proceed but rely on LLM to ask if it's critical.
        }

        console.log(`Processing intent for: ${user_message.substring(0, 50)}...`);

        const result = await parseUserIntent(user_message, wallet_address);

        // Additional backend validation if LLM suggests a transaction
        if (result.intent_detected && result.action === 'transfer') {
            if (!isValidAddress(result.to_address)) {
                result.risk_flags.push('Invalid recipient address');
                result.confidence = Math.min(result.confidence, 0.7);
            }
            if (!result.amount || isNaN(parseFloat(result.amount))) {
                result.risk_flags.push('Invalid amount');
                result.confidence = Math.min(result.confidence, 0.7);
            }
        }

        res.json(result);
    } catch (error) {
        console.error('Intent Controller Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { handleParseIntent };
