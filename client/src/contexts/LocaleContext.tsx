import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 语言类型
type Locale = 'zh' | 'en';

// 翻译资源
const translations = {
  zh: {
    appTitle: '简历分析智能体',
    appSubtitle: '基于 AI 的简历分析与面试准备工具',
    resumeContent: '简历内容',
    resumePlaceholder: '请粘贴或上传您的简历内容...',
    jdLabel: '岗位描述',
    jdPlaceholder: '请粘贴目标岗位的 JD 描述...',
    companyBackground: '公司背景（可选）',
    companyPlaceholder: '请输入公司背景信息...',
    startAnalysis: '开始分析',
    analyzing: '分析中...',
    copySuccess: '复制成功！',
    mobileHint: '在移动设备上使用时，建议横屏查看以获得最佳体验',
    poweredBy: '由 Resume Agent 提供技术支持',
    fileUpload: '上传文件',
    textInput: '文本输入',
    uploadSuccess: '文件上传成功',
    uploadFailed: '文件上传失败',
    analyzingResume: '正在分析简历...',
    strengths: '优势',
    weaknesses: '待提升',
    keywordMatch: '关键词匹配度',
    matchAnalysis: '匹配分析',
    selfIntroduction: '定制化自我介绍',
    interviewQuestions: '预测面试问题',
    resumeScore: '简历评分',
    optimizationTips: '优化建议',
    salaryRange: '薪资参考',
    completeness: '完整度',
    formatting: '规范性',
    keywords: '关键词',
    high: '高',
    medium: '中',
    low: '低',
    export: '导出',
    history: '历史记录',
    clearHistory: '清空历史',
    noHistory: '暂无历史记录',
    loadRecord: '加载记录',
    deleteRecord: '删除记录',
    confirmDelete: '确定删除这条记录吗？',
    yes: '是',
    no: '否',
    error: '错误',
    retry: '重试',
    dismiss: '关闭',
    theme: '主题',
    language: '语言',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    chinese: '中文',
    english: '英文',
  },
  en: {
    appTitle: 'Resume Analysis Agent',
    appSubtitle: 'AI-powered resume analysis and interview preparation tool',
    resumeContent: 'Resume Content',
    resumePlaceholder: 'Please paste or upload your resume content...',
    jdLabel: 'Job Description',
    jdPlaceholder: 'Please paste the target job description...',
    companyBackground: 'Company Background (Optional)',
    companyPlaceholder: 'Please enter company background information...',
    startAnalysis: 'Start Analysis',
    analyzing: 'Analyzing...',
    copySuccess: 'Copied successfully!',
    mobileHint: 'For mobile devices, landscape mode is recommended for best experience',
    poweredBy: 'Powered by Resume Agent',
    fileUpload: 'File Upload',
    textInput: 'Text Input',
    uploadSuccess: 'File uploaded successfully',
    uploadFailed: 'File upload failed',
    analyzingResume: 'Analyzing resume...',
    strengths: 'Strengths',
    weaknesses: 'Areas for Improvement',
    keywordMatch: 'Keyword Match',
    matchAnalysis: 'Match Analysis',
    selfIntroduction: 'Custom Self-Introduction',
    interviewQuestions: 'Predicted Interview Questions',
    resumeScore: 'Resume Score',
    optimizationTips: 'Optimization Tips',
    salaryRange: 'Salary Reference',
    completeness: 'Completeness',
    formatting: 'Formatting',
    keywords: 'Keywords',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    export: 'Export',
    history: 'History',
    clearHistory: 'Clear History',
    noHistory: 'No history records',
    loadRecord: 'Load Record',
    deleteRecord: 'Delete Record',
    confirmDelete: 'Are you sure you want to delete this record?',
    yes: 'Yes',
    no: 'No',
    error: 'Error',
    retry: 'Retry',
    dismiss: 'Dismiss',
    theme: 'Theme',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    chinese: 'Chinese',
    english: 'English',
  },
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof translations['zh']) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 从 localStorage 加载语言设置，默认为中文
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    return (savedLocale === 'zh' || savedLocale === 'en') ? savedLocale : 'zh';
  });

  // 当语言变化时，更新 localStorage
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  // 翻译函数
  const t = (key: keyof typeof translations['zh']) => {
    return translations[locale][key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
