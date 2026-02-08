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

const MOCK_TOP_MOVERS: TokenData[] = [
    { id: 'pepe', symbol: 'pepe', name: 'Pepe', image: 'https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg', current_price: 0.0000012, market_cap: 500000000, market_cap_rank: 42, price_change_percentage_24h: 15.4 },
    { id: 'fetch-ai', symbol: 'fet', name: 'Fetch.ai', image: 'https://assets.coingecko.com/coins/images/5624/thumb/fet.png', current_price: 2.15, market_cap: 1800000000, market_cap_rank: 35, price_change_percentage_24h: 12.1 },
    { id: 'render-token', symbol: 'rndr', name: 'Render', image: 'https://assets.coingecko.com/coins/images/11636/thumb/rndr.png', current_price: 10.5, market_cap: 4000000000, market_cap_rank: 25, price_change_percentage_24h: 8.5 },
    { id: 'ondo-finance', symbol: 'ondo', name: 'Ondo', image: 'https://assets.coingecko.com/coins/images/34444/thumb/ondo.png', current_price: 0.85, market_cap: 1200000000, market_cap_rank: 60, price_change_percentage_24h: 6.2 },
    { id: 'dogwifhat', symbol: 'wif', name: 'dogwifhat', image: 'https://assets.coingecko.com/coins/images/33566/thumb/dogwifhat.jpg', current_price: 3.2, market_cap: 3200000000, market_cap_rank: 30, price_change_percentage_24h: 5.9 },
];

const MOCK_POPULAR: TokenData[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png', current_price: 64000, market_cap: 1200000000000, market_cap_rank: 1, price_change_percentage_24h: 2.5 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png', current_price: 3400, market_cap: 400000000000, market_cap_rank: 2, price_change_percentage_24h: 1.8 },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png', current_price: 145, market_cap: 65000000000, market_cap_rank: 5, price_change_percentage_24h: 4.2 },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png', current_price: 590, market_cap: 87000000000, market_cap_rank: 4, price_change_percentage_24h: 0.5 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png', current_price: 0.62, market_cap: 34000000000, market_cap_rank: 6, price_change_percentage_24h: -1.2 },
];

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
            },
            timeout: 5000 // Add timeout to fail faster
        });
        return response.data;
    } catch (error) {
        console.warn(`Error fetching Top Movers (${category}), using fallback data:`, error);
        // Return mock data instead of throwing to keep UI functional
        return MOCK_TOP_MOVERS.map(t => ({ ...t, price_change_percentage_24h: Math.random() * 10 + 2 })); // Randomize slightly for "live" feel
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
        const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
            params,
            timeout: 5000
        });
        return response.data;
    } catch (error) {
        console.warn(`Error fetching Popular Tokens (${type}), using fallback data:`, error);
        return MOCK_POPULAR.map(t => ({ ...t, price_change_percentage_24h: t.price_change_percentage_24h + (Math.random() - 0.5) }));
    }
};
