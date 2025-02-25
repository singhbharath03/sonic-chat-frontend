import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';


interface CopyButtonProps {
  text: string;
  displayText?: string;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
}

export function CopyButton({ 
  text, 
  displayText, 
  className = "text-sm text-gray-600 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200",
  icon,
  title = "Click to copy"
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={className}
      title={title}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      <span className="font-medium">{displayText || text}</span>
      {copied ? 
        <FiCheck className="text-green-500" /> : 
        <FiCopy className="text-gray-400 hover:text-gray-600" />
      }
    </button>
  );
} 