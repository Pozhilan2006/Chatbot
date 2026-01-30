import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/intent';

export interface IntentResponse {
    intent_detected: boolean;
    action: 'transfer' | 'balance' | 'explanation' | 'unknown';
    chain: string | null;
    asset: string | null;
    amount: string | null;
    to_address: string | null;
    confidence: number;
    human_readable_summary: string;
    risk_flags: string[];
    error?: string;
}

export const parseIntent = async (userMessage: string, walletAddress: string): Promise<IntentResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/parse-intent`, {
            user_message: userMessage,
            wallet_address: walletAddress,
        });
        return response.data;
    } catch (error: any) {
        console.error('API Error:', error);
        return {
            intent_detected: false,
            action: 'unknown',
            chain: null,
            asset: null,
            amount: null,
            to_address: null,
            confidence: 0,
            human_readable_summary: 'Service is currently unavailable.',
            risk_flags: [],
            error: error.message,
        };
    }
};
