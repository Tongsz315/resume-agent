import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 分析记录类型
export interface AnalysisRecord {
  id: string;
  timestamp: number;
  resumeText: string;
  jdText: string;
  result: any;
}

interface HistoryContextType {
  records: AnalysisRecord[];
  addRecord: (record: Omit<AnalysisRecord, 'id' | 'timestamp'>) => void;
  deleteRecord: (id: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 从 localStorage 加载历史记录
  const [records, setRecords] = useState<AnalysisRecord[]>(() => {
    const savedRecords = localStorage.getItem('analysisHistory');
    if (savedRecords) {
      try {
        return JSON.parse(savedRecords);
      } catch {
        return [];
      }
    }
    return [];
  });

  // 当记录变化时，更新 localStorage
  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(records));
  }, [records]);

  // 添加记录
  const addRecord = (record: Omit<AnalysisRecord, 'id' | 'timestamp'>) => {
    const newRecord: AnalysisRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setRecords(prev => [newRecord, ...prev].slice(0, 20)); // 只保留最近 20 条记录
  };

  // 删除记录
  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  // 清空历史
  const clearHistory = () => {
    setRecords([]);
  };

  return (
    <HistoryContext.Provider value={{ records, addRecord, deleteRecord, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
