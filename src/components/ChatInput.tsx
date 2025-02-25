import { FaPaperPlane } from 'react-icons/fa';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export function ChatInput({ inputText, setInputText, onSubmit, disabled }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e);
    setInputText('');
  };

  return (
    <div className="p-5 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 pr-12 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
            disabled={disabled}
          />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2.5 rounded-full hover:bg-blue-600 focus:outline-none transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={disabled}
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </form>
    </div>
  );
}