"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { parseIntent, IntentResponse } from '@/lib/api';
import TransactionModal from './TransactionModal';
import { Send, Loader2, Bot, User, AlertCircle, Sparkles, Command } from 'lucide-react';
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
            content: 'Nexus Protocol initialized. Secure connection established. Ready for instructions.',
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
            await new Promise(resolve => setTimeout(resolve, 800)); // Cinematic delay

            const response = await parseIntent(userMsg.content, address);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.human_readable_summary || response.error || 'Request processed.',
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
                content: 'System Error: Unable to process request. Please retry.',
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
                    content: `Transaction broadcast successfully. Hash: ${transactionResponse.hash}`,
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
        <div className="flex flex-col h-full relative bg-black/20 backdrop-blur-sm">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth" ref={scrollRef}>
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={cn(
                                "max-w-[75%] rounded-2xl p-6 relative overflow-hidden group transition-all duration-300",
                                msg.role === 'user'
                                    ? "bg-white/5 border border-white/10 text-white shadow-lg shadow-violet-500/5 backdrop-blur-md"
                                    : "bg-black/40 border border-white/5 text-gray-200 shadow-xl backdrop-blur-xl"
                            )}>
                                {/* Glow effects */}
                                {msg.role === 'assistant' && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-transparent opacity-50" />
                                )}

                                <div className="flex items-center gap-3 mb-3 opacity-60">
                                    {msg.role === 'user' ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">User</span>
                                            <User size={12} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={12} className="text-amber-300" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/70">Nexus AI</span>
                                        </div>
                                    )}
                                </div>

                                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-light tracking-wide">
                                    {msg.content}
                                </p>

                                {/* Risk Flags Inline */}
                                {msg.intent && msg.intent.action === 'transfer' && !msg.intent.intent_detected && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                                        <AlertCircle size={16} className="text-red-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-red-400 mb-1">SECURITY FLAG</p>
                                            <p className="text-xs text-red-300/80">
                                                {msg.intent.risk_flags.join(', ') || 'Clarification needed before execution.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping absolute" />
                                <div className="w-2 h-2 rounded-full bg-violet-500 relative" />
                            </div>
                            <span className="text-xs font-mono text-violet-300/70 uppercase tracking-widest">Processing Intent...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 relative z-20">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-amber-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur duration-500" />
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="relative bg-black/80 backdrop-blur-xl rounded-2xl flex items-center p-2 border border-white/10 group-hover:border-white/20 transition-colors"
                    >
                        <div className="pl-4 pr-3 text-gray-500">
                            <Command size={18} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your transaction intent..."
                            className="flex-1 bg-transparent border-none text-white placeholder-gray-600 focus:outline-none focus:ring-0 py-3 text-base font-light"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed group-focus-within:bg-violet-600 group-focus-within:hover:bg-violet-500"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            Secure Enclave Active • AI cannot sign transactions
                        </p>
                    </div>
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
