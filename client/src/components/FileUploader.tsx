import React from 'react';

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
      className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
        selectedFile
          ? 'border-green-400 bg-green-50'
          : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
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
          <span className="text-4xl mb-2">✅</span>
          <span className="text-green-600 font-medium">{selectedFile.name}</span>
          <span className="text-gray-500 text-sm mt-1">文件已解析</span>
        </>
      ) : (
        <>
          <span className="text-4xl mb-2">📄</span>
          <span className="text-gray-600">点击或拖拽上传 PDF / Word 文件</span>
          <span className="text-gray-400 text-sm mt-1">支持 .pdf, .doc, .docx</span>
        </>
      )}
    </div>
  );
};

export default FileUploader;