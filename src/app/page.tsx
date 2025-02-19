'use client';

import { useState } from 'react';
import { Message, MessageRole } from '@/types/chat';
import { sendMessages } from '@/services/chatService';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const userMessage = { content: inputText, role: 'user' as MessageRole };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');

    try {
      const data = await sendMessages(updatedMessages);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: 'Sorry, there was an error processing your message.',
        role: 'system'
      }]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gray-100 rounded-lg p-4 h-[500px] overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSubmit={handleSubmit}
      />
    </div>
  );
}