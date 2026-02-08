import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface TokenData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
}

const TokenCard = ({ token }: { token: TokenData }) => {
    const isPositive = token.price_change_percentage_24h >= 0;

    return (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                    <img src={token.image} alt={token.name} className="w-10 h-10 object-cover" loading="lazy" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{token.symbol.toUpperCase()}</h3>
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">#{token.market_cap_rank}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate max-w-[100px]">{token.name}</p>
                </div>
            </div>

            <div className="text-right">
                <p className="font-mono text-sm font-bold text-white">${token.current_price.toLocaleString()}</p>
                <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{Math.abs(token.price_change_percentage_24h).toFixed(2)}%</span>
                </div>
            </div>
        </div>
    );
};

export const TokenList = ({ tokens, isLoading, error }: { tokens?: TokenData[], isLoading: boolean, error?: any }) => {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-[74px] bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                <TrendingUp size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">Unable to load market data</p>
            </div>
        );
    }

    if (!tokens || tokens.length === 0) {
        return <div className="p-8 text-center text-gray-500">No tokens found</div>;
    }

    return (
        <div className="space-y-3">
            {tokens.map((token) => (
                <TokenCard key={token.id} token={token} />
            ))}
        </div>
    );
};
