import React from 'react';
import { useTheme } from '../contexts';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ selectedFile, onFileSelect, onDrop, onDragOver }) => {
  const { isDark } = useTheme();

  return (
    <div>
      <div
        onClick={() => document.getElementById('file-input')?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
          isDark
            ? 'border-[rgba(255,255,255,0.1)] hover:border-[#2997ff] hover:bg-[rgba(41,151,255,0.04)]'
            : 'border-[rgba(0,0,0,0.1)] hover:border-[#0071e3] hover:bg-[rgba(0,113,227,0.03)]'
        }`}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
          className="hidden"
        />
        <div className={`text-sm font-medium ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>
          {selectedFile ? (
            <span className={isDark ? 'text-[#2997ff]' : 'text-[#0071e3]'}>{selectedFile.name}</span>
          ) : (
            <>
              <span className={`font-semibold ${isDark ? 'text-[#2997ff]' : 'text-[#0071e3]'}`}>选择文件</span>
              {' '}或拖拽至此
            </>
          )}
        </div>
        <p className={`text-xs mt-2 ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>
          支持 PDF、Word 格式
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
