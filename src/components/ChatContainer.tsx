import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ActionMessage, ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  intermittentState: string | null;
}

export function ChatContainer({ messages, isLoading, intermittentState }: ChatContainerProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, intermittentState]);

  return (
    <div className="flex-1 p-5 overflow-y-auto flex flex-col space-y-4">
      {messages.length === 0 && !isLoading && !intermittentState && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 rounded-xl bg-white border border-gray-200 shadow-sm max-w-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to Sonic Chat</h3>
            <p className="text-gray-600 text-sm">
              Ask questions about your Sonic assets, transactions, or get help with the Sonic ecosystem.
            </p>
          </div>
        </div>
      )}
      
      {isLoading && messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          {messages
            .filter(message =>
              (message.role === 'user' || message.role === 'assistant') &&
              message.content &&
              message.content.trim() !== ''
            )
            .map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          {intermittentState && <ActionMessage content={intermittentState} />}
          <div ref={endOfMessagesRef} />
        </>
      )}
    </div>
  );
}