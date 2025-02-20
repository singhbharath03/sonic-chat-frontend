import { Message } from '@/types/chat';
import { BACKEND_URL } from '@/constants/api';

export async function makeRequest<T, B = void>(
  endpoint: string,
  userId: string,
  options?: {
    method?: string;
    body?: B;
  }
): Promise<T> {  
  const url = `${BACKEND_URL}${endpoint}?privy_user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options?.body && { body: JSON.stringify(options.body) }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response');
  }

  return response.json();
}

export async function sendMessages(conversationId: string, userMessage: string, userId: string): Promise<{ messages: Message[] }> {
  return makeRequest<
    { messages: Message[], id: string }, 
    { id: string; user_message: string }
  >('/chat/process_messages', userId, {
    method: 'POST',
    body: { 
      id: conversationId,
      user_message: userMessage,
     },
  });
}

export async function fetchInitialMessages(userId: string) {
  return makeRequest('/chat/new_thread', userId);
} 