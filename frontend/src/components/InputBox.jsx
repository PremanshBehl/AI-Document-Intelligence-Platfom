import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const InputBox = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="w-full pt-2 md:pt-0 border-t border-transparent bg-transparent bg-gradient-to-b from-transparent via-[#0f172a] to-[#0f172a]">
      <form 
        onSubmit={handleSubmit} 
        className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
      >
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="flex w-full items-center relative rounded-2xl bg-[#1e293b] border border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.1)] focus-within:border-gray-500 transition-colors duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Ask anything about your document..."
              className="m-0 w-full resize-none border-0 bg-transparent py-4 pl-5 pr-14 text-white focus:ring-0 focus-visible:ring-0 rounded-2xl outline-none max-h-[200px] scrollbar-hide text-base leading-relaxed placeholder:text-gray-500"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              className="absolute p-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 bottom-2.5 right-2 md:bottom-2 md:right-2 disabled:bg-slate-700 disabled:text-gray-500 transition-colors duration-200 shadow-sm"
            >
              <Send size={18} className="translate-x-[1px]" />
            </button>
          </div>
        </div>
      </form>
      <div className="px-3 pb-3 pt-2 text-center text-xs text-gray-500 md:px-4 md:pb-6 md:pt-3">
        AI Document Assistant can make mistakes. Consider verifying important information.
      </div>
    </div>
  );
};

export default InputBox;
