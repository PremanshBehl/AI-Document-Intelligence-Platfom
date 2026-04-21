import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#343541] overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default Dashboard;
