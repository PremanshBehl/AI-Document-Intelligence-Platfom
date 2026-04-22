import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MessageBubble = ({ msg, onRegenerate }) => {
  const isAI = msg.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("w-full py-6 transition-colors duration-200", isAI ? "bg-[#0f172a]" : "bg-[#1e293b]")}>
      <div className="max-w-3xl mx-auto flex gap-4 px-4 sm:px-6">
        
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-white",
            isAI ? "bg-indigo-600 shadow-sm shadow-indigo-500/20" : "bg-slate-700"
          )}>
            {isAI ? <Bot size={20} /> : <User size={20} />}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 group">
          <div className="flex flex-grow flex-col gap-3">
            <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap break-words text-gray-200 text-sm md:text-base leading-relaxed">
              {isAI ? (
                <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#020617] prose-pre:border prose-pre:border-gray-800 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          {isAI && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Copy response"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              {onRegenerate && (
                <button 
                  onClick={onRegenerate}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Regenerate response"
                >
                  <RefreshCw size={16} />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
