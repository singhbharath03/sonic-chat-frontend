import { useState, useCallback } from 'react';
import { Message, MessageRole } from '@/types/chat';
import { sendMessages, fetchInitialMessages } from '@/services/chatService';
import { usePrivy } from '@privy-io/react-auth';

export function useChat() {
  const { user, ready } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const initializeChat = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchInitialMessages(user.id) as { messages: Message[], id: string };
      setMessages(data.messages);
      setConversationId(data.id);
    } catch (error) {
      console.error('Error fetching initial messages:', error);
      setMessages([{
        content: 'Failed to load chat history.',
        role: 'system'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  if (!ready) return {
    messages: [],
    isLoading: true,
    conversationId: null,
    initializeChat: async () => {},
    sendMessage: async () => {},
    sendMessages: async () => {},
    fetchInitialMessages: async () => {},
  };

  if (!user?.id) throw new Error('User ID is required');

  const sendMessage = async (content: string) => {
    const userMessage = { content, role: 'user' as MessageRole };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      if (!conversationId) throw new Error('No conversation ID');
      const data = await sendMessages(conversationId, content, user?.id) as { messages: Message[] };
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
    conversationId,
    initializeChat,
    sendMessage,
  };
} 