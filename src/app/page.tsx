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
  const { messages, isLoading, initializeChat, sendMessage } = useChat();
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
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {!authenticated ? (
        <div className="text-center py-10">
          <button onClick={login} className="btn">Login</button>
        </div>
      ) : (
        <>
          <WalletDisplay 
            evmWallets={embeddedEvmWallets}
            solanaWallets={embeddedSolanaWallets}
          />
          <ChatContainer messages={messages} isLoading={isLoading} />
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