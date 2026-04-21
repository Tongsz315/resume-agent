import React from 'react';

interface InterviewQuestionsProps {
  questions: string[];
  onCopy: () => void;
}

const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({ questions, onCopy }) => {
  if (questions.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          🎯 预测面试问题
        </h2>
        <button
          onClick={onCopy}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          📋 复制
        </button>
      </div>
      <div className="space-y-3">
        {questions.map((q, index) => (
          <div key={index} className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-gray-700">{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewQuestions;