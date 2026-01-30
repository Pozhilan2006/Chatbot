"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { parseIntent, IntentResponse } from '@/lib/api';
import TransactionModal from './TransactionModal';
import { Send, Loader2, Bot, User, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';

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
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I am your AI Web3 Assistant. You can ask me to send ETH, check balances, or explain transaction concepts. How can I help you today?',
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
            // simulate network delay for better UX
            await new Promise(resolve => setTimeout(resolve, 600));

            const response = await parseIntent(userMsg.content, address);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.human_readable_summary || response.error || 'I processed your request.',
                intent: response,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, aiMsg]);

            // If actionable intent detected with high confidence, open modal
            if (response.intent_detected && response.action === 'transfer' && response.confidence > 0.8) {
                if (response.risk_flags.length === 0 || response.confidence > 0.9) {
                    setCurrentIntent(response);
                    setModalOpen(true);
                    setTxHash(null);
                } else {
                    // If risk flags but somehow still flagged as intent, maybe just warn in chat?
                    // For now, strict rule: 0.85 confidence for modal.
                    if (response.confidence >= 0.85) {
                        setCurrentIntent(response);
                        setModalOpen(true);
                        setTxHash(null);
                    }
                }
            }

        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your request. Please try again.',
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

            // Update chat with success
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `Transaction sent! Hash: ${transactionResponse.hash}`,
                    timestamp: Date.now(),
                },
            ]);

            // Don't close modal immediately, let user see success state in modal
        } catch (error: any) {
            console.error('Transaction failed:', error);
            alert('Transaction failed: ' + (error.reason || error.message));
            setModalOpen(false); // Close on error to avoid stuck state
        } finally {
            setIsProcessingTx(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl p-4 shadow-md ${msg.role === 'user'
                                    ? 'bg-violet-600 text-white rounded-br-sm'
                                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm backdrop-blur-sm'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1 opacity-50 text-xs uppercase tracking-wider font-bold">
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                {msg.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                            {/* If message has an intent that wasn't executed or was explanation */}
                            {msg.intent && msg.intent.action === 'transfer' && !msg.intent.intent_detected && (
                                <div className="mt-2 text-xs text-red-400 bg-red-400/10 p-2 rounded flex gap-2 items-center">
                                    <AlertCircle size={12} />
                                    {msg.intent.risk_flags.join(', ') || 'Clarification needed'}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm p-4 flex items-center gap-2">
                            <Loader2 className="animate-spin text-violet-400" size={16} />
                            <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-black/20 backdrop-blur-md border-t border-white/5">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="relative max-w-4xl mx-auto"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your request... (e.g., 'Send 0.01 ETH to 0x123...')"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 rounded-lg text-white hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
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
