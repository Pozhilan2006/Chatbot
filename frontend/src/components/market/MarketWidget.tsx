"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { TokenList } from './TokenList';
import { Flame, Star } from 'lucide-react';

const fetcher = (url: string, params: any) => axios.get(url, { params }).then(res => res.data);

// Using custom SWR hooks for polling
const useMarketData = (category: string, isMovers: boolean) => {
    // CoinGecko API adapter logic moved here for direct SWR key usage or reuse logic
    // But strictly adhering to plan: service layer separate? 
    // Let's call the service layer inside fetcher? SWR needs a key.

    // Actually, to use SWR effectively with the service layer, we can wrap the service call:
    const key = isMovers ? `movers-${category}` : `popular-${category}`;

    const { data, error, isLoading } = useSWR(key, async () => {
        // Dynamic import to avoid SSR issues if any, or just direct Call
        const { fetchTopMovers, fetchPopularTokens } = await import('@/lib/marketService');
        if (isMovers) return fetchTopMovers(category);
        else return fetchPopularTokens(category);
    }, {
        refreshInterval: 60000, // 60s polling
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    });

    return { data, error, isLoading };
};

const MarketSection = ({ title, icon, tabs, defaultTab, isMovers }: { title: string, icon: any, tabs: string[], defaultTab: string, isMovers: boolean }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const { data, error, isLoading } = useMarketData(activeTab, isMovers);

    return (
        <div className="bg-[#0f0518]/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isMovers ? 'bg-amber-500/10 text-amber-400' : 'bg-violet-500/10 text-violet-400'}`}>
                        {icon}
                    </div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl mb-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <TokenList tokens={data} isLoading={isLoading} error={error} />
            </div>
        </div>
    );
};

export default function MarketWidget() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
            <MarketSection
                title="Top Movers (24h)"
                icon={<Flame size={20} />}
                tabs={['Memes', 'AI', 'RWA']}
                defaultTab="Memes"
                isMovers={true}
            />
            <MarketSection
                title="Popular Tokens"
                icon={<Star size={20} />}
                tabs={['Top', 'BNB', 'ETH', 'SOL']}
                defaultTab="Top"
                isMovers={false}
            />
        </div>
    );
}
