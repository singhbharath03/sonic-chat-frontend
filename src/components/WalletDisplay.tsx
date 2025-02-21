import { WalletIcon } from '@/components/icons/WalletIcon';
import { CopyButton } from '@/components/CopyButton';
import { ConnectedWallet, ConnectedSolanaWallet } from '@privy-io/react-auth';

interface WalletDisplayProps {
  evmWallets: ConnectedWallet[];
  solanaWallets: ConnectedSolanaWallet[];
}

export function WalletDisplay({ evmWallets, solanaWallets }: WalletDisplayProps) {
  return (
    <div className="flex gap-4 mb-4 justify-end">
      {solanaWallets.map((wallet) => (
        <div key={wallet.address} className="flex items-center gap-2 justify-end">
          <CopyButton
            text={wallet.address || ''}
            displayText={wallet.address ? 
              `SOL: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 
              ''
            }
            icon={<WalletIcon />}
            title="Click to copy Solana wallet address"
          />
        </div>
      ))}
      {evmWallets.map((wallet) => (
        <div key={wallet.address} className="flex items-center gap-2 justify-end">
          <CopyButton
            text={wallet.address || ''}
            displayText={wallet.address ? 
              `EVM: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 
              ''
            }
            icon={<WalletIcon />}
            title="Click to copy EVM wallet address"
          />
        </div>
      ))}
    </div>
  );
} 