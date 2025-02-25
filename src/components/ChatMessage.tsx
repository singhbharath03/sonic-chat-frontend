import { Message } from '@/types/chat';
import Markdown from 'react-markdown';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from 'next/link'; 

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-4 rounded-2xl max-w-[80%] md:max-w-[70%] shadow-sm ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className={`prose prose-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'} max-w-none`}>
          <Markdown>{message.content}</Markdown>
        </div>
        
        {message.role === 'assistant' && message.tx_hash && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link 
              href={`https://sonicscan.org/tx/${message.tx_hash}`} 
              className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function ActionMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm shadow-sm">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-500" />
        <span>{content}</span>
      </div>
    </div>
  );
}
