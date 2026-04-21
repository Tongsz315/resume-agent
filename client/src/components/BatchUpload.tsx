import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

interface BatchFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  text?: string;
  error?: string;
}

interface BatchUploadProps {
  onFilesReady: (files: { text: string; name: string }[]) => void;
}

const BatchUpload: React.FC<BatchUploadProps> = ({ onFilesReady }) => {
  const { isDark } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<BatchFile[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: BatchFile[] = selectedFiles.slice(0, 5).map(file => ({
      id: Date.now() + Math.random().toString(),
      file,
      status: 'pending',
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // 开始上传
    for (const f of newFiles) {
      await uploadFile(f.id, f.file);
    }

    checkAllReady();
  };

  const uploadFile = async (id: string, file: File) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'uploading' as const } : f
    ));

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setFiles(prev => prev.map(f => 
          f.id === id ? { ...f, status: 'success' as const, text: response.data.text } : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === id ? { ...f, status: 'error' as const, error: '解析失败' } : f
        ));
      }
    } catch {
      setFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'error' as const, error: '网络错误' } : f
      ));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    checkAllReady();
  };

  const checkAllReady = () => {
    const readyFiles = files.filter(f => f.status === 'success' && f.text);
    if (readyFiles.length > 0) {
      onFilesReady(readyFiles.map(f => ({ text: f.text!, name: f.file.name })));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return <span className="loading-spinner w-4 h-4" />;
      case 'success': return <span className="text-green-500">✅</span>;
      case 'error': return <span className="text-red-500">❌</span>;
      default: return <span className="text-gray-400">⏳</span>;
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        📁 批量上传简历（最多5份）
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 5 - files.length);
          if (droppedFiles.length > 0) {
            const newFiles: BatchFile[] = droppedFiles.map(file => ({
              id: Date.now() + Math.random().toString(),
              file,
              status: 'pending' as const,
            }));
            setFiles(prev => [...prev, ...newFiles]);
            newFiles.forEach(f => uploadFile(f.id, f.file));
          }
        }}
        className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
          isDark
            ? 'border-gray-600 hover:border-indigo-400 hover:bg-gray-800'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <span className="text-4xl mb-2 block">📂</span>
        <span className="text-gray-600">点击或拖拽上传文件</span>
        <span className="text-gray-400 text-sm block mt-1">
          {files.length}/5 个文件
        </span>
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(f => (
            <div
              key={f.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(f.status)}
                <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                  {f.file.name}
                </span>
              </div>
              <button
                onClick={() => removeFile(f.id)}
                className={`p-1 rounded hover:bg-gray-200 ${isDark ? 'hover:bg-gray-600' : ''}`}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchUpload;