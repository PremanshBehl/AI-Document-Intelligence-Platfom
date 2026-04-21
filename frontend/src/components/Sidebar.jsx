import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { Plus, MessageSquare, Trash2, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { sessions, currentSessionId, setCurrentSessionId, createSession, deleteSession } = useContext(ChatContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="w-[260px] bg-[#020617] h-screen flex flex-col border-r border-gray-800 flex-shrink-0 transition-all duration-300 md:relative absolute z-50">
      <div className="p-3">
        <button
          onClick={createSession}
          className="w-full flex items-center gap-2 bg-transparent hover:bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-3 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2 space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => setCurrentSessionId(session.id)}
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-sm transition-colors ${
              currentSessionId === session.id
                ? 'bg-slate-800 text-white'
                : 'text-gray-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <MessageSquare size={16} className="flex-shrink-0" />
            <div className="flex-1 truncate relative pr-6 font-medium tracking-wide">
              {session.title}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSession(session.id);
              }}
              className={`absolute right-2 p-1.5 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-slate-700 ${
                currentSessionId === session.id ? 'opacity-100' : ''
              }`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer" onClick={logout}>
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm shadow-indigo-500/20">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 truncate font-medium">
            {user?.email}
          </div>
          <LogOut size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
