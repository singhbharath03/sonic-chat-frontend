import { useState, useCallback } from 'react';
import { Message, MessageRole } from '@/types/chat';
import { sendMessages, fetchInitialMessages } from '@/services/chatService';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeChat = useCallback(async () => {
    try {
      const data = await fetchInitialMessages();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching initial messages:', error);
      setMessages([{
        content: 'Failed to load chat history.',
        role: 'system'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = async (content: string) => {
    const userMessage = { content, role: 'user' as MessageRole };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

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

  return {
    messages,
    isLoading,
    initializeChat,
    sendMessage
  };
} 