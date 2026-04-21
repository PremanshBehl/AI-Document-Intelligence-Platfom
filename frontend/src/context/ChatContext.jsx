import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
      setMessages([]);
      setCurrentSessionId(null);
    }
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      fetchSessionDetails(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    }
  };

  const fetchSessionDetails = async (id) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/${id}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to fetch session details', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const createSession = async () => {
    try {
      const res = await api.post('/chat/create-session', { title: 'New Chat' });
      setSessions([res.data, ...sessions]);
      setCurrentSessionId(res.data.id);
      return res.data;
    } catch (err) {
      console.error('Failed to create session', err);
    }
  };

  const deleteSession = async (id) => {
    try {
      await api.delete(`/chat/${id}`);
      setSessions(sessions.filter((s) => s.id !== id));
      if (currentSessionId === id) {
        setCurrentSessionId(null);
      }
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  };

  const sendMessage = async (content) => {
    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = await createSession();
      sessionId = newSession.id;
    }

    // Optimistic UI update for user message
    const tempUserMsg = { id: Date.now(), role: 'user', content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post(`/chat/${sessionId}/message`, { content });
      setMessages((prev) => [...prev, res.data]);
      
      // Update title if it's the first message
      if (messages.length === 0) {
          fetchSessions();
      }
    } catch (err) {
      console.error('Failed to send message', err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        setCurrentSessionId,
        messages,
        loadingMessages,
        createSession,
        deleteSession,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
