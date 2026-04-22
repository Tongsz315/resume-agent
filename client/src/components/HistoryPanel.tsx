import React from 'react';
import { useHistory, useTheme, useLocale, AnalysisRecord } from '../contexts';

const HistoryPanel: React.FC<{ isOpen: boolean; onClose: () => void; onLoadRecord: (record: AnalysisRecord) => void }> = ({ isOpen, onClose, onLoadRecord }) => {
  const { records, deleteRecord, clearHistory } = useHistory();
  const { isDark } = useTheme();
  const { t } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md h-full overflow-y-auto transition-colors ${
        isDark ? 'bg-[#1d1d1f]' : 'bg-white'
      }`}>
        <div className={`p-6 border-b ${isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-[rgba(0,0,0,0.06)]'}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>{t('history')}</h2>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[rgba(255,255,255,0.06)]' : 'hover:bg-[#f5f5f7]'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {records.length > 0 && (
            <button onClick={clearHistory} className={`mt-3 text-xs font-medium ${isDark ? 'text-[#ff453a]' : 'text-[#ff3b30]'}`}>{t('clearHistory')}</button>
          )}
        </div>
        <div className="p-4">
          {records.length === 0 ? (
            <p className={`text-center py-12 text-sm ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{t('noHistory')}</p>
          ) : (
            <div className="space-y-3">
              {records.map(record => {
                const jobTitle = record.jdText.substring(0, 30) + (record.jdText.length > 30 ? '...' : '');
                const matchScore = record.result?.keywordMatch || 0;
                return (
                  <div key={record.id} className={`p-4 rounded-xl transition-colors ${isDark ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-[#f5f5f7]'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>{jobTitle}</h3>
                      <span className="text-xs font-bold" style={{ color: matchScore >= 80 ? (isDark ? '#30d158' : '#34c759') : matchScore >= 60 ? '#ff9f0a' : (isDark ? '#ff453a' : '#ff3b30') }}>
                        {matchScore}%
                      </span>
                    </div>
                    <p className={`text-xs mb-3 ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{new Date(record.timestamp).toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { onLoadRecord(record); onClose(); }} className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: isDark ? '#2997ff' : '#0071e3' }}>
                        {t('loadRecord')}
                      </button>
                      <button onClick={() => deleteRecord(record.id)} className={`py-2 px-3 rounded-lg text-xs ${isDark ? 'bg-[rgba(255,255,255,0.06)] text-[#6e6e73]' : 'bg-white text-[#86868b]'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
