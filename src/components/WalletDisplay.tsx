import { WalletIcon } from '@/components/icons/WalletIcon';
import { CopyButton } from '@/components/CopyButton';
import { ConnectedWallet, ConnectedSolanaWallet } from '@privy-io/react-auth';

interface WalletDisplayProps {
  evmWallets: ConnectedWallet[];
}

export function WalletDisplay({ evmWallets }: WalletDisplayProps) {
  return (
    <div className="flex gap-3 p-5 justify-end border-b border-gray-200 bg-white">
      {evmWallets.map((wallet) => (
        <div key={wallet.address} className="flex items-center">
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