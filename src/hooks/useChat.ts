import { useState, useCallback } from 'react';
import { Message, MessageRole } from '@/types/chat';
import { sendMessages, fetchInitialMessages, makeRequest } from '@/services/chatService';
import { UnsignedTransactionRequest, usePrivy, useWallets } from '@privy-io/react-auth';

interface TransactionDetails {
  transaction_details: {
    type: string;
    chain_id: number;
    description: string;
    transaction: {
      transaction: UnsignedTransactionRequest 
    };
  };
}

export function useChat() {
  const { user, ready } = usePrivy();
  const {wallets} = useWallets();
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

  const handleLLMResponse = async (conversationId: string) => {
    const conv = await makeRequest<TransactionDetails>(`/chat/conversations/${conversationId}/pending_transaction`, user.id);
    
    // Extract the actual transaction object
    const txData = conv.transaction_details.transaction.transaction;

    const wallet = wallets[0];
    const provider = await wallet.getEthereumProvider();

    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [txData]
    });

    if (txHash) {
      // Submit the signed transaction hash and get updated messages
      const response = await makeRequest< {messages: Message[]}, {signed_tx_hash: string} >(
        `/chat/conversations/${conversationId}/submit_transaction`,
        user.id,
        {
          method: 'POST',
          body: { signed_tx_hash: txHash }
        }
      );
      
      // Update messages with the response
      setMessages(response.messages);
    }
    
  };

  const sendMessage = async (content: string) => {
    const userMessage = { content, role: 'user' as MessageRole };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      if (!conversationId) throw new Error('No conversation ID');
      const data = await sendMessages(conversationId, content, user?.id) as { messages: Message[], needs_txn_signing: boolean };
      setMessages(data.messages);
      if (data.needs_txn_signing) {
        await handleLLMResponse(conversationId);
      }
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