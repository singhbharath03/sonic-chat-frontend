'use client';

import { useState, useEffect } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { ChatContainer } from '@/components/ChatContainer';
import { useChat } from '@/hooks/useChat';
import { usePrivy } from '@privy-io/react-auth';
import { WalletDisplay } from '@/components/WalletDisplay';
import { useWalletManagement } from '@/hooks/useWalletManagement';
import { useHoldings } from '@/context/HoldingsContext';

export default function Page() {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, initializeChat, sendMessage, intermittentState } = useChat();
  const { login, ready, authenticated } = usePrivy();
  const { embeddedEvmWallets, embeddedSolanaWallets } = useWalletManagement();
  const { setHoldingsData } = useHoldings();

  useEffect(() => {
    if (authenticated && ready) {
      initializeChat();
    }
  }, [initializeChat, authenticated, ready]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !authenticated) return;
    
    setInputText('');
    await sendMessage(inputText, setHoldingsData);
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {!authenticated ? (
        <div className="flex items-center justify-center h-full">
          <button onClick={login} className="btn">Login</button>
        </div>
      ) : (
        <>
          <WalletDisplay 
            evmWallets={embeddedEvmWallets}
            solanaWallets={embeddedSolanaWallets}
          />
          <div className="flex-grow overflow-y-auto mb-4">
            <ChatContainer 
              messages={messages} 
              isLoading={isLoading} 
              intermittentState={intermittentState ?? null} 
            />
          </div>
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onSubmit={handleSubmit}
            disabled={isLoading}
          />
        </>
      )}
    </div>
  );
}