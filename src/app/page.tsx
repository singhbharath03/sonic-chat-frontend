'use client';

import { useState, useEffect } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { ChatContainer } from '@/components/ChatContainer';
import { useChat } from '@/hooks/useChat';

export default function Page() {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, initializeChat, sendMessage } = useChat();

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    await sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ChatContainer messages={messages} isLoading={isLoading} />
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSubmit={handleSubmit}
      />
    </div>
  );
}