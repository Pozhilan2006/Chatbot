"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { parseIntent, IntentResponse } from '@/lib/api';
import TransactionModal from './TransactionModal';
import { ArrowUp, Loader2, Square, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    intent?: IntentResponse;
    timestamp: number;
};

export default function ChatInterface() {
    const { address, signer } = useWallet();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'system-init',
            role: 'assistant',
            content: 'SYSTEM READY. WAITING FOR INPUT.',
            timestamp: Date.now(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentIntent, setCurrentIntent] = useState<IntentResponse | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [isProcessingTx, setIsProcessingTx] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !address) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            const response = await parseIntent(userMsg.content, address);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.human_readable_summary || response.error || 'ACKNOWLEDGED.',
                intent: response,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, aiMsg]);

            if (response.intent_detected && response.action === 'transfer' && response.confidence > 0.85) {
                setCurrentIntent(response);
                setModalOpen(true);
                setTxHash(null);
            }

        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'ERROR: PROCESSING FAILED.',
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const executeTransaction = async () => {
        if (!currentIntent || !signer) return;

        setIsProcessingTx(true);
        try {
            const tx = {
                to: currentIntent.to_address,
                value: ethers.parseEther(currentIntent.amount || '0'),
            };

            const transactionResponse = await signer.sendTransaction(tx);
            setTxHash(transactionResponse.hash);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `TX BROADCAST: ${transactionResponse.hash}`,
                    timestamp: Date.now(),
                },
            ]);
        } catch (error: any) {
            // Error handling
        } finally {
            setIsProcessingTx(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative bg-[#0e0e0e]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth" ref={scrollRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-4xl mx-auto w-full`}
                    >
                        <span className="text-[9px] font-mono text-[#444] mb-1 uppercase tracking-widest">
                            {msg.role === 'user' ? 'USER_INPUT' : 'SYSTEM_RESPONSE'}
                        </span>
                        <div className={cn(
                            "p-4 border max-w-xl w-full text-sm md:text-base font-medium",
                            msg.role === 'user'
                                ? "bg-[#161616] border-[#262626] text-white"
                                : "bg-transparent border-l-2 border-l-[#FF3B2F] border-y-0 border-r-0 pl-4 text-[#e5e5e5]"
                        )}>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {msg.role === 'assistant' ? msg.content.toUpperCase() : msg.content}
                            </p>

                            {/* Risk Flags Inline */}
                            {msg.intent && msg.intent.action === 'transfer' && !msg.intent.intent_detected && (
                                <div className="mt-4 p-3 border border-red-900 bg-red-900/10">
                                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">FLAGGED</p>
                                    <p className="text-xs text-red-400 font-mono">
                                        {msg.intent.risk_flags.join(' / ') || 'CLARIFICATION REQUIRED'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex flex-col items-start max-w-4xl mx-auto w-full">
                        <span className="text-[9px] font-mono text-[#444] mb-1 uppercase tracking-widest">SYSTEM</span>
                        <div className="flex items-center gap-2 pl-4">
                            <Square size={8} className="text-[#FF3B2F] animate-spin" />
                            <span className="text-xs font-mono text-[#666] tracking-widest">COMPUTING...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8 border-t border-[#262626] bg-[#0e0e0e]">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex items-end gap-4"
                    >
                        <div className="flex-1 relative">
                            <label className="text-[9px] font-mono text-[#444] absolute -top-4 left-0 uppercase tracking-widest">Command Line</label>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                autoFocus
                                className="w-full bg-transparent border-b border-[#333] text-white placeholder-[#333] focus:outline-none focus:border-[#FF3B2F] py-2 text-lg font-mono transition-colors"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-3 bg-[#1c1c1c] hover:bg-[#FF3B2F] text-white transition-colors disabled:opacity-30 disabled:hover:bg-[#1c1c1c]"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </form>
                </div>
            </div>

            <TransactionModal
                isOpen={modalOpen}
                intent={currentIntent}
                onClose={() => setModalOpen(false)}
                onConfirm={executeTransaction}
                isProcessing={isProcessingTx}
                txHash={txHash}
            />
        </div>
    );
}
