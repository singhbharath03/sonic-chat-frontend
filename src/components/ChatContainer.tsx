import { Message } from '@/types/chat';
import { ActionMessage, ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  intermittentState: string | null;
}

export function ChatContainer({ messages, isLoading, intermittentState }: ChatContainerProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 h-full w-full overflow-y-auto flex flex-col-reverse">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading messages...</div>
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
        </>
      )}
    </div>
  );
}