import { useWallets, useSolanaWallets, useCreateWallet } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export function useWalletManagement() {
  const { wallets: evmWallets = [], ready: evmReady } = useWallets();
  const { wallets: solanaWallets = [], ready: solanaReady } = useSolanaWallets();
  const { createWallet: createEvmWallet } = useCreateWallet();
  const { createWallet: createSolanaWallet } = useSolanaWallets();
  const { authenticated } = usePrivy();

  const embeddedEvmWallets = evmWallets.filter(wallet => wallet.connectorType === 'embedded');
  const embeddedSolanaWallets = solanaWallets.filter(wallet => wallet.connectorType === 'embedded');

  useEffect(() => {
    if (authenticated && evmReady && embeddedEvmWallets.length === 0) {
      createEvmWallet();
    }
    if (authenticated && solanaReady && embeddedSolanaWallets.length === 0) {
      createSolanaWallet();
    }
  }, [authenticated, evmReady, solanaReady, embeddedEvmWallets, embeddedSolanaWallets, createEvmWallet, createSolanaWallet]);

  return {
    embeddedEvmWallets,
    embeddedSolanaWallets
  };
} 