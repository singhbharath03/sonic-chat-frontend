import { useState, useCallback, useEffect } from 'react';
import { Message, MessageRole } from '@/types/chat';
import { sendMessages, fetchInitialMessages, makeRequest } from '@/services/chatService';
import { UnsignedTransactionRequest, usePrivy, useWallets } from '@privy-io/react-auth';

interface TransactionDetails {
  transaction_details: {
    description: string;
    transaction: UnsignedTransactionRequest;
  };
}

interface ApiResponse {
  holdings: TokenData[];
  total_usd_value?: DisplayValue;
}

export function useChat() {
  const { user, ready } = usePrivy();
  const {wallets} = useWallets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [intermittentState, setIntermittentState] = useState<string | null>(null);
  const [holdingsData, setHoldingsData] = useState<ApiResponse>();

  const initializeChat = useCallback(async () => {
    if (!user?.id) return;
    const data = await fetchInitialMessages(user.id) as { messages: Message[], id: string };
    setMessages(data.messages);
    setConversationId(data.id);
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const userId = user.id;
      const response = await makeRequest<ApiResponse>('/chat/sonic_holdings', userId);
      setHoldingsData(response);
    };

    fetchData();
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

  const handleLLMResponse = async (conversationId: string, setIntermittentState: (state: string | null) => void, setHoldingsData: (data: ApiResponse) => void) => {
    if (!user?.id) return;
    const conv = await makeRequest<TransactionDetails>(`/chat/conversations/${conversationId}/pending_transaction`, user.id);

    // Extract the actual transaction object
    const txData = conv.transaction_details.transaction;

    const description = conv.transaction_details.description;
    setIntermittentState(description);

    const wallet = wallets[0];
    const provider = await wallet.getEthereumProvider();

    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [txData]
    });

    if (txHash) {
      // Submit the signed transaction hash and get updated messages
      const response = await makeRequest< {messages: Message[], needs_txn_signing: boolean}, {signed_tx_hash: string} >(
        `/chat/conversations/${conversationId}/submit_transaction`,
        user.id,
        {
          method: 'POST',
          body: { signed_tx_hash: txHash }
        }
      );

      // Update messages with the response
      setMessages(response.messages);
      if (response.needs_txn_signing) {
        await handleLLMResponse(conversationId, setIntermittentState, setHoldingsData);
      } else {
        setIntermittentState(null);
      }

      // Call fetchData after the transaction is completed
      const fetchData = async () => {
        if (!user?.id) return;
        const userId = user.id;
        const response = await makeRequest<ApiResponse>('/chat/sonic_holdings', userId);
        setHoldingsData(response);
      };

      fetchData();
    }
  };

  const sendMessage = async (content: string, setHoldingsData: (data: ApiResponse) => void) => {
    if (!user?.id) return;
    const userMessage = { content, role: 'user' as MessageRole };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (!conversationId) throw new Error('No conversation ID');
    setIntermittentState('Thinking...');
    const data = await sendMessages(conversationId, content, user?.id) as { messages: Message[], needs_txn_signing: boolean };
    setMessages(data.messages);
    if (data.needs_txn_signing) {
      await handleLLMResponse(conversationId, setIntermittentState, setHoldingsData);
    }
    setIntermittentState!(null);
  };

  return {
    messages,
    isLoading,
    conversationId,
    initializeChat,
    sendMessage,
    intermittentState,
    setIntermittentState,
    holdingsData,
  };
}