import React from 'react';
import { useTheme } from '../contexts';

interface InterviewQuestionsProps {
  questions: string[];
  onCopy: () => void;
}

const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({ questions, onCopy }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';
  
  if (questions.length === 0) return null;

  return (
    <div className={`mt-6 rounded-3xl shadow-2xl p-6 md:p-8 ${
      isModern
        ? 'bg-white/80 backdrop-blur border border-slate-200/50'
        : 'bg-slate-900/80 backdrop-blur border border-slate-700/50'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${
          isModern
            ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
            : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
        }`}>
          🎯 预测面试问题
        </h2>
        <button
          onClick={onCopy}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
            isModern
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          📋 复制
        </button>
      </div>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className={`p-5 rounded-2xl flex items-start gap-4 ${
            isModern
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50'
              : 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30'
          }`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${
              isModern
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg'
            }`}>
              {index + 1}
            </span>
            <span className={`${isModern ? 'text-slate-800' : 'text-slate-300'}`}>{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewQuestions;