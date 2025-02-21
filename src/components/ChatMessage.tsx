import { Message } from '@/types/chat';
 import Markdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`mb-8 p-2 rounded-lg max-w-[40%] ${
        message.role === 'user'
          ? 'ml-auto bg-blue-500 text-white'
          : 'bg-white'
      }`}
    >
      <Markdown>{message.content}</Markdown>
    </div>
  );
}