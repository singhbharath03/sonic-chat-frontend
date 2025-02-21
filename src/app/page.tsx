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
    <div className="p-4 h-full">
      {!authenticated ? (
        <div className="text-center py-10">
          <button onClick={login} className="btn">Login</button>
        </div>
      ) : (
        <div className="flex flex-col h-full w-full">
          <WalletDisplay 
            evmWallets={embeddedEvmWallets}
            solanaWallets={embeddedSolanaWallets}
          />
          <div className="flex-grow w-full overflow-y-hidden flex flex-col-reverse">
            <ChatContainer messages={messages} isLoading={isLoading} />
          </div>
          <div className="mt-4 w-full">
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              onSubmit={handleSubmit}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}