import { Message } from '@/types/chat';
import Markdown from 'react-markdown';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from 'next/link'; 

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex items-center mb-8">
      <div
        className={`p-2 rounded-lg max-w-[40%] ${
          message.role === 'user'
            ? 'ml-auto bg-blue-500 text-white w-fit text-right'
            : 'bg-white'
        }`}
      >
        <Markdown>{message.content}</Markdown>
        {message.role === 'assistant' && message.tx_hash && (
          <div className="flex flex-col items-start mt-2">
            <Link href={`https://sonicscan.org/tx/${message.tx_hash}`} className="text-blue-500 cursor-pointer mt-1" target="_blank" rel="noopener noreferrer">
              See transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function ActionMessage({ content }: { content: string }) {
  return (
    <div className="mb-2 p-2 pt-4 rounded-lg bg-gray-100 text-gray-800 inline-flex items-center gap-2 shadow-sm">
      <AiOutlineLoading3Quarters className="animate-spin text-gray-600" />
      <span className="font-semibold">{content}</span>
    </div>
  );
}
