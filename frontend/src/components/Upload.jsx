import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Loader } from './Loader';

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Please upload a PDF document.' });
      return;
    }
    setFile(selectedFile);
    setStatus({ type: '', message: '' });
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setStatus({ type: '', message: '' });
    
    try {
      const response = await api.uploadDocument(file);
      setStatus({ 
        type: 'success', 
        message: `Success! Processed ${response.chunks_processed} chunks.` 
      });
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Failed to upload document.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Document Processing</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Upload your PDF to start chatting with your data
      </p>

      <div 
        className={`upload-area ${isDragging ? 'drag-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          className="file-input" 
          ref={fileInputRef} 
          accept=".pdf"
          onChange={handleFileChange}
        />
        
        {file ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={48} className="upload-icon" />
            <span style={{ fontWeight: 500 }}>{file.name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <UploadIcon size={48} className="upload-icon" />
            <span style={{ fontWeight: 500 }}>Click or drag PDF here</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Maximum size: 50MB
            </span>
          </div>
        )}
      </div>

      <button 
        className="upload-btn"
        onClick={handleUpload}
        disabled={!file || isUploading}
        style={{ width: '100%' }}
      >
        {isUploading ? <Loader /> : 'Process Document'}
      </button>

      {status.message && (
        <div className={`upload-status ${status.type}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {status.message}
        </div>
      )}
    </div>
  );
};

export default Upload;
