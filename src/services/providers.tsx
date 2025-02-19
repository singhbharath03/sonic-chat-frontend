'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          // Customize Privy's appearance in your app
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://sonicscan.org/assets/sonic/images/svg/logos/logo-light.svg?v=25.2.2.0',
          },
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: { 
            ethereum: { 
              createOnLogin: 'users-without-wallets', 
            }, 
            solana: { 
              createOnLogin: 'users-without-wallets', 
            }, 
          }, 
        }}
      >
        {children}
      </PrivyProvider>
  );
}