import React, { useState, useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { Bot } from 'lucide-react';
import api from '../services/api';
import Topbar from './Topbar';
import InputBox from './InputBox';
import MessageBubble from './MessageBubble';
import Loader from './Loader';

const ChatWindow = () => {
  const { messages, loadingMessages, sendMessage } = useContext(ChatContext);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingMessages, isTyping]);

  const handleSendMessage = async (content) => {
    setIsTyping(true);
    await sendMessage(content);
    setIsTyping(false);
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Document uploaded and processed successfully!');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  if (loadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f172a]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] h-screen relative">
      <Topbar uploading={uploading} onUpload={handleFileUpload} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <Bot size={32} className="text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">How can I help you today?</h2>
            <p className="text-sm text-gray-500">Upload a PDF document first, then ask me questions about it.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg, idx) => (
              <MessageBubble 
                key={idx} 
                msg={msg} 
                onRegenerate={idx === messages.length - 1 && msg.role === 'assistant' ? () => handleSendMessage(messages[idx-1].content) : null}
              />
            ))}
            {isTyping && (
              <div className="w-full py-6 bg-[#0f172a]">
                <div className="max-w-3xl mx-auto flex gap-4 px-4 sm:px-6">
                  <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-indigo-600 shadow-sm shadow-indigo-500/20">
                      <Bot size={20} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Loader />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0">
        <InputBox onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default ChatWindow;
