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
  className = "text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex items-center gap-1",
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
      {icon}
      {displayText || text}
      {copied ? <FiCheck className="ml-2" /> : <FiCopy className="ml-2" />}
    </button>
  );
} 