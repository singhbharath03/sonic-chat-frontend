import { useState, useCallback, useEffect } from 'react';
import { ApiResponse, Message, MessageRole } from '@/types/chat';
import { sendMessages, fetchInitialMessages, makeRequest } from '@/services/chatService';
import { UnsignedTransactionRequest, usePrivy, useWallets } from '@privy-io/react-auth';

interface TransactionDetails {
  transaction_details: {
    description: string;
    transaction: UnsignedTransactionRequest;
  };
}

interface TransactionError {
  message: string;
  isRetryable: boolean;
}

export function useChat() {
  const { user, ready } = usePrivy();
  const {wallets} = useWallets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [intermittentState, setIntermittentState] = useState<string | null>(null);
  const [holdingsData, setHoldingsData] = useState<ApiResponse>();
  const [transactionError, setTransactionError] = useState<TransactionError | null>(null);

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

  const handleLLMResponse = async (conversationId: string, setIntermittentState: (state: string | null) => void, setHoldingsData: (data: ApiResponse) => void, retryCount = 0) => {
    if (!user?.id) return;
    
    try {
      setTransactionError(null);
      const conv = await makeRequest<TransactionDetails>(`/chat/conversations/${conversationId}/pending_transaction`, user.id);

      // Extract the actual transaction object
      const txData = conv.transaction_details.transaction;
      const description = conv.transaction_details.description;
      setIntermittentState(description);

      const wallet = wallets[0];
      if (!wallet) {
        throw new Error('No wallet connected');
      }

      const provider = await wallet.getEthereumProvider();
      
      try {
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
            
            // Add a small delay to ensure the backend has processed the transaction
            await new Promise(resolve => setTimeout(resolve, 200));
            
            try {
              const response = await makeRequest<ApiResponse>('/chat/sonic_holdings', userId);
              
              // Use the passed setHoldingsData function to update the context
              if (typeof setHoldingsData === 'function') {
                // Create a new object to ensure React detects the change
                const newResponse = JSON.parse(JSON.stringify(response));
                setHoldingsData(newResponse);
                
                // Dispatch a custom event to notify the Sidebar component
                const event = new CustomEvent('holdingsUpdated', { detail: newResponse });
                window.dispatchEvent(event);
              } else {
                console.error('setHoldingsData is not a function:', setHoldingsData);
              }
            } catch (error) {
              console.error('Failed to fetch holdings data:', error);
            }
          };

          try {
            await fetchData();
          } catch (error) {
            console.error('Failed to update holdings data:', error);
          }
        }
      } catch (error: unknown) {
        // Handle user rejection or wallet errors
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
          ? (error.message as string) 
          : 'Transaction failed';
          
        if (errorMessage.includes('user rejected') || errorMessage.includes('User rejected')) {
          setTransactionError({
            message: 'Transaction was rejected. Please try again when ready.',
            isRetryable: true
          });
        } else {
          setTransactionError({
            message: 'Failed to process transaction. Please try again.',
            isRetryable: true
          });
        }
        setIntermittentState(null);
      }
    } catch (error: unknown) {
      // Handle API/network errors
      console.error('Transaction error:', error);
      
      const hasFailedResponseMessage = typeof error === 'object' && 
        error !== null && 
        'message' in error && 
        typeof error.message === 'string' && 
        error.message.includes('Failed to get response');
        
      if (retryCount < 3 && hasFailedResponseMessage) {
        // Retry on network errors
        setTimeout(() => {
          handleLLMResponse(conversationId, setIntermittentState, setHoldingsData, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        setTransactionError({
          message: 'Network error. Please check your connection and try again.',
          isRetryable: true
        });
        setIntermittentState(null);
      }
    }
  };

  const retryTransaction = async () => {
    if (!conversationId || !user?.id) return;
    
    setTransactionError(null);
    setIntermittentState('Retrying transaction...');
    
    // Use the same setHoldingsData function that was passed to sendMessage
    const updateHoldings = async (data: ApiResponse) => {
      // Add a small delay to ensure the backend has processed the transaction
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Create a new object to ensure React detects the change
      const newData = JSON.parse(JSON.stringify(data));
      setHoldingsData(newData);
      
      // Dispatch a custom event to notify the Sidebar component
      const event = new CustomEvent('holdingsUpdated', { detail: newData });
      window.dispatchEvent(event);
    };
    
    await handleLLMResponse(conversationId, setIntermittentState, updateHoldings);
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
    transactionError,
    retryTransaction
  };
}