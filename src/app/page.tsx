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
  const { 
    messages, 
    isLoading, 
    initializeChat, 
    sendMessage, 
    intermittentState,
    transactionError,
    retryTransaction
  } = useChat();
  const { login, ready, authenticated } = usePrivy();
  const { embeddedEvmWallets } = useWalletManagement();
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
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {!authenticated ? (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center p-8 rounded-xl bg-white border border-gray-200 shadow-sm max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Sonic Chat</h2>
            <p className="text-gray-600 mb-6">
              Please login to chat with the Sonic assistant.
            </p>
            <button 
              onClick={login} 
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <>
          <WalletDisplay 
            evmWallets={embeddedEvmWallets}
          />
          <ChatContainer 
            messages={messages} 
            isLoading={isLoading} 
            intermittentState={intermittentState ?? null}
            transactionError={transactionError}
            onRetry={retryTransaction}
          />
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