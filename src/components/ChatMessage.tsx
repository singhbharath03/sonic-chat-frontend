import { Message } from '@/types/chat';
 import Markdown from 'react-markdown';
 import { AiOutlineLoading3Quarters } from 'react-icons/ai';  // Add this import


interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`mb-8 p-2 rounded-lg max-w-[40%] ${
        message.role === 'user'
          ? 'ml-auto bg-blue-500 text-white w-fit text-right'
          : 'bg-white'
      }`}
    >
      <Markdown>{message.content}</Markdown>
    </div>
  );
}


export function ActionMessage({ content }: { content: string }) {
  return (
    <div className="mb-2 p-2 pt-4 rounded-lg bg-gray-100 text-gray-800 inline-flex items-center gap-2 shadow-sm">
      <AiOutlineLoading3Quarters className="animate-spin text-gray-600" />
      <span>{content}</span>
    </div>
  );
}
