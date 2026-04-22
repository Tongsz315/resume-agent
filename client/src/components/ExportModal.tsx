import React from 'react';
import { AnalysisRecord } from '../contexts/HistoryContext';
import { useTheme } from '../contexts';
import { useToast } from './Toast';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const ExportModal: React.FC<{ record: AnalysisRecord; onClose: () => void }> = ({ record, onClose }) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();

  const handleExportText = () => {
    const content = generateTextContent(record);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `简历分析_${new Date(record.timestamp).toLocaleDateString('zh-CN').replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('导出成功', 'success');
  };

  const handleCopyAll = async () => {
    const ok = await copy(generateTextContent(record));
    showToast(ok ? '已复制' : '复制失败', ok ? 'success' : 'error');
  };

  const generateTextContent = (record: AnalysisRecord) => `简历分析报告\n${new Date(record.timestamp).toLocaleString('zh-CN')}\n\n匹配度: ${record.result.keywordMatch}%\n\n优势:\n${record.result.strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\n待提升:\n${record.result.weaknesses.map((w: string, i: number) => `${i + 1}. ${w}`).join('\n')}\n\n自我介绍:\n${record.result.selfIntroduction}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-2xl p-6 scale-in ${isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)]' : 'bg-white border border-[rgba(0,0,0,0.06)]'}`}>
        <h2 className={`text-xl font-bold mb-5 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>导出分析报告</h2>
        <div className={`p-4 rounded-xl mb-5 ${isDark ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-[#f5f5f7]'}`}>
          <p className={`text-sm ${isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'}`}>
            匹配度 <span className="font-bold" style={{ color: isDark ? '#2997ff' : '#0071e3' }}>{record.result.keywordMatch}%</span>
            {' · '}{record.result.strengths.length} 个优势 · {record.result.weaknesses.length} 个待提升
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCopyAll} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.01] active:scale-[0.99] ${isDark ? 'bg-[rgba(255,255,255,0.06)] text-[#a1a1a6]' : 'bg-[#f5f5f7] text-[#6e6e73]'}`}>
            复制全部
          </button>
          <button onClick={handleExportText} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99]" style={{ background: isDark ? '#2997ff' : '#0071e3' }}>
            导出 TXT
          </button>
        </div>
        <button onClick={onClose} className={`mt-3 w-full py-2.5 rounded-xl text-sm ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>关闭</button>
      </div>
    </div>
  );
};

export default ExportModal;
