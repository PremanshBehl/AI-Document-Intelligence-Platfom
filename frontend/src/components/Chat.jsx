import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { TypingIndicator } from './Loader';
import { api } from '../services/api';

const Chat = ({ documentReady }) => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hello! I am your AI Document Assistant. Upload a PDF and ask me any questions about it.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !documentReady) return;

    const userQuery = input.trim();
    setInput('');
    
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userQuery }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await api.queryDocument(userQuery);
      
      setMessages([...newMessages, {
        role: 'ai',
        content: response.answer,
        sources: response.sources
      }]);
    } catch (error) {
      setMessages([...newMessages, {
        role: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please ensure the backend is running and a document is uploaded.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={documentReady ? "Ask a question about your document..." : "Please upload a document first..."}
          className="chat-input"
          disabled={!documentReady || isLoading}
        />
        <button 
          type="submit" 
          className="send-btn"
          disabled={!input.trim() || !documentReady || isLoading}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
