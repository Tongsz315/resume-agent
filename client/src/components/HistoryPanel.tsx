import React from 'react';
import { useHistory, useTheme, useLocale, AnalysisRecord } from '../contexts';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadRecord: (record: AnalysisRecord) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onLoadRecord }) => {
  const { records, deleteRecord, clearHistory } = useHistory();
  const { isModern } = useTheme();
  const { t } = useLocale();

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    deleteRecord(id);
  };

  const handleClearAll = () => {
    clearHistory();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className={`w-full max-w-md h-full overflow-y-auto ${
        isModern
          ? 'bg-white/95 backdrop-blur border-l border-slate-200/50'
          : 'bg-slate-900/95 backdrop-blur border-l border-slate-700/50'
      }`}>
        <div className={`p-6 border-b ${isModern ? 'border-slate-200' : 'border-slate-700'}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-bold ${
              isModern
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
                : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
            }`}>
              {t('history')}
            </h2>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-xl ${isModern ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-800 hover:bg-slate-700'}`}
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
              className={`mt-4 text-sm font-semibold ${isModern ? 'text-red-600 hover:text-red-500' : 'text-red-400 hover:text-red-300'}`}
            >
              {t('clearHistory')}
            </button>
          )}
        </div>

        <div className="p-4">
          {records.length === 0 ? (
            <div className={`text-center py-12 ${isModern ? 'text-slate-500' : 'text-slate-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <p>{t('noHistory')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => {
                const jobTitle = record.jdText.substring(0, 30) + (record.jdText.length > 30 ? '...' : '');
                const timestamp = new Date(record.timestamp).toLocaleString();
                const matchScore = record.result?.keywordMatch || 0;

                return (
                  <div key={record.id} className={`rounded-2xl p-4 ${
                    isModern
                      ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200/50'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-700/50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold ${isModern ? 'text-slate-800' : 'text-slate-200'}`}>
                        {jobTitle}
                      </h3>
                      <span className={`text-xs font-bold ${
                        matchScore >= 80
                          ? isModern ? 'text-emerald-600' : 'text-emerald-400'
                          : matchScore >= 60
                            ? isModern ? 'text-amber-600' : 'text-amber-400'
                            : isModern ? 'text-red-600' : 'text-red-400'
                      }`}>
                        {matchScore}%
                      </span>
                    </div>
                    <p className={`text-sm mb-3 ${isModern ? 'text-slate-500' : 'text-slate-500'}`}>
                      {timestamp}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onLoadRecord(record);
                          onClose();
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold ${
                          isModern
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                            : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                        }`}
                      >
                        {t('loadRecord')}
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold ${
                          isModern
                            ? 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500'
                            : 'bg-slate-700 text-slate-400 hover:bg-red-900/30 hover:text-red-400'
                        }`}
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
