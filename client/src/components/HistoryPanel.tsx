import React from 'react';
import { useHistory, useTheme, useLocale, AnalysisRecord } from '../contexts';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadRecord: (record: AnalysisRecord) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onLoadRecord }) => {
  const { records, deleteRecord, clearHistory } = useHistory();
  const { isDark } = useTheme();
  const { t } = useLocale();

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteRecord(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('确定清空所有历史记录吗？')) {
      clearHistory();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className={`w-full max-w-md h-full overflow-y-auto transition-transform ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* 头部 */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-indigo-700'}`}>
              {t('history')}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className={`mt-4 text-sm font-medium ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
            >
              {t('clearHistory')}
            </button>
          )}
        </div>

        {/* 历史记录列表 */}
        <div className="p-4">
          {records.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <p>{t('noHistory')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => {
                // 提取岗位信息（从 JD 中获取前 30 个字符）
                const jobTitle = record.jdText.substring(0, 30) + (record.jdText.length > 30 ? '...' : '');
                // 格式化时间
                const timestamp = new Date(record.timestamp).toLocaleString();
                // 获取匹配度
                const matchScore = record.result?.keywordMatch || 0;

                return (
                  <div key={record.id} className={`rounded-xl p-4 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {jobTitle}
                      </h3>
                      <span className={`text-xs ${matchScore >= 80 ? 'text-green-500' : matchScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {matchScore}%
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {timestamp}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onLoadRecord(record);
                          onClose();
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                      >
                        {t('loadRecord')}
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
