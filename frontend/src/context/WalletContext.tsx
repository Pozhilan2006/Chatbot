"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletState, INITIAL_WALLET_STATE, connectWallet } from '@/lib/web3';
import { ethers } from 'ethers';

interface WalletContextType extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET_STATE);

    const connect = async () => {
        const state = await connectWallet();
        setWallet(state);
    };

    const disconnect = () => {
        setWallet(INITIAL_WALLET_STATE);
    };

    // Auto-connect if already authorized?
    // For safety/strictness, we might require explicit button press every reload or check existing permissions.
    // Checking existing permissions provided nothing changed.
    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    // If we have accounts, we can reconnect silently
                    // But let's keep it manual for "CTA: Connect Wallet" flow explicit trigger,
                    // OR auto-connect if strict UX not demanded.
                    // User Request: "On clicking “Connect Wallet” -> Connect MetaMask".
                    // Implies manual.
                }
            }
        };
        checkConnection();
    }, []);

    return (
        <WalletContext.Provider value={{ ...wallet, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
