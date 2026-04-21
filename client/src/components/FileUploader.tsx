import React from 'react';
import { useTheme } from '../contexts';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  selectedFile,
  onFileSelect,
  onDrop,
  onDragOver,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isModern = theme === 'modern';

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={handleClick}
      className={`w-full h-52 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
        selectedFile
          ? isModern
            ? 'border-emerald-400 bg-emerald-50/80'
            : 'border-emerald-500 bg-emerald-900/20'
          : isModern
            ? 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/50'
            : 'border-slate-600 hover:border-purple-400 bg-slate-900/50 hover:bg-purple-900/20'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="hidden"
      />
      {selectedFile ? (
        <>
          <span className="text-5xl mb-3">✅</span>
          <span className={`font-semibold ${isModern ? 'text-emerald-700' : 'text-emerald-400'}`}>{selectedFile.name}</span>
          <span className={`text-sm mt-2 ${isModern ? 'text-slate-500' : 'text-slate-400'}`}>文件已解析</span>
        </>
      ) : (
        <>
          <span className="text-5xl mb-3">📄</span>
          <span className={`font-medium ${isModern ? 'text-slate-700' : 'text-slate-300'}`}>点击或拖拽上传 PDF / Word 文件</span>
          <span className={`text-sm mt-2 ${isModern ? 'text-slate-400' : 'text-slate-500'}`}>支持 .pdf, .doc, .docx</span>
        </>
      )}
    </div>
  );
};

export default FileUploader;