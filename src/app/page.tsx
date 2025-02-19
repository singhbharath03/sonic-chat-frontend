'use client';

import { useState, useEffect } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { ChatContainer } from '@/components/ChatContainer';
import { useChat } from '@/hooks/useChat';
import { usePrivy } from '@privy-io/react-auth';
import { WalletIcon } from '@/components/icons/WalletIcon';

export default function Page() {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, initializeChat, sendMessage } = useChat();
  const { login, ready, authenticated, user } = usePrivy();


  useEffect(() => {
    if (authenticated) {
      initializeChat();
    }
  }, [initializeChat, authenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !authenticated) return;
    
    await sendMessage(inputText);
    setInputText('');
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
          <div className="flex items-center gap-2 mb-4 justify-end">
            <WalletIcon />
            <span className="text-sm text-gray-600">
              {user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : ''}
            </span>
          </div>
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