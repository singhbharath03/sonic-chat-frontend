'use client';

import { useState, useEffect } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { ChatContainer } from '@/components/ChatContainer';
import { useChat } from '@/hooks/useChat';
import { usePrivy } from '@privy-io/react-auth';
import { WalletDisplay } from '@/components/WalletDisplay';
import { useWalletManagement } from '@/hooks/useWalletManagement';

export default function Page() {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, initializeChat, sendMessage, intermittentState, setIntermittentState } = useChat();
  const { login, ready, authenticated } = usePrivy();
  const { embeddedEvmWallets, embeddedSolanaWallets } = useWalletManagement();

  useEffect(() => {
    if (authenticated && ready) {
      initializeChat();
    }
  }, [initializeChat, authenticated, ready]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !authenticated) return;
    
    setInputText('');
    await sendMessage(inputText);
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full lg:max-w-5xl mx-auto p-4 space-y-6">
      {!authenticated ? (
        <div className="text-center py-10">
          <button onClick={login} className="btn">Login</button>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-2rem)] w-full">
          <WalletDisplay 
            evmWallets={embeddedEvmWallets}
            solanaWallets={embeddedSolanaWallets}
          />
          <ChatContainer messages={messages} isLoading={isLoading} intermittentState={intermittentState ?? null} />
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onSubmit={handleSubmit}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}