import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface TokenData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
}

// Caching configuration
// CoinGecko free tier has rate limits (approx 10-30 req/min). 
// We use SWR's deduping + client-side caching to respect this.
// Polling interval: 60 seconds (conservative but "live" enough for free tier).

export const fetchTopMovers = async (category: string): Promise<TokenData[]> => {
    // Category IDs for CoinGecko:
    // Memes: 'meme-token'
    // RWA: 'real-world-assets'
    // AI: 'artificial-intelligence'

    let categoryId = '';
    switch (category) {
        case 'Memes': categoryId = 'meme-token'; break;
        case 'RWA': categoryId = 'real-world-assets'; break;
        case 'AI': categoryId = 'artificial-intelligence'; break;
        default: categoryId = ''; // All
    }

    try {
        const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                category: categoryId,
                order: 'price_change_percentage_24h_desc', // Top gainers
                per_page: 5,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching Top Movers (${category}):`, error);
        throw error;
    }
};

export const fetchPopularTokens = async (type: string): Promise<TokenData[]> => {
    // Logic for Popular tabs:
    // Top: Top 5 by market cap global
    // BNB: Top 5 on BSC
    // ETH: Top 5 on Ethereum
    // SOL: Top 5 on Solana

    // Note: CoinGecko 'category' filter works better than platform for "Ecosystem" lists sometimes, 
    // but let's use 'category' where possible or just General Market Cap for simplicity if specific ecosystem IDs vary.

    let params: any = {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
    };

    switch (type) {
        case 'BNB': params.category = 'binance-smart-chain'; break;
        case 'ETH': params.category = 'ethereum-ecosystem'; break;
        case 'SOL': params.category = 'solana-ecosystem'; break;
        case 'Top': default: break; // Global market cap
    }

    try {
        const response = await axios.get(`${COINGECKO_API}/coins/markets`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching Popular Tokens (${type}):`, error);
        throw error;
    }
};
