import React from 'react';
import { UploadCloud } from 'lucide-react';

const Topbar = ({ uploading, onUpload }) => {
  return (
    <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0f172a] flex-shrink-0 z-10 sticky top-0 backdrop-blur-sm bg-opacity-90">
      <h1 className="text-white font-semibold text-base tracking-wide">AI Document Assistant</h1>
      
      <div>
        <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors shadow-sm ${
          uploading 
            ? 'bg-slate-700 text-gray-400' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}>
          <UploadCloud size={16} />
          {uploading ? 'Processing...' : 'Upload PDF'}
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={onUpload} 
            disabled={uploading} 
          />
        </label>
      </div>
    </div>
  );
};

export default Topbar;
