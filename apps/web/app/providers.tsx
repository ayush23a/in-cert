'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    AlphaWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { ContractProvider } from './contract';

export default function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // use mainnet
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []); // or "mainnet-beta"

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new AlphaWalletAdapter()
        ],
        [],
    );

    // Prevent SSR rendering of wallet providers to avoid hydration mismatches
    // WalletProvider accesses `window` internally, which doesn't exist during SSR
    if (!mounted) {
        return null;
    }

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <ContractProvider>
                    {children}
                </ContractProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
