import { Message } from '@/types/chat';
import { BACKEND_URL } from '@/constants/api';

export async function sendMessages(messages: Message[]): Promise<{ messages: Message[] }> {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response');
  }

  return response.json();
} 