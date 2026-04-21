import React from 'react';
import { useTheme } from '../contexts';

interface SalaryRangeProps {
  range: {
    min: number;
    max: number;
    currency: string;
    unit: string;
  };
  position: string;
}

const SalaryRange: React.FC<SalaryRangeProps> = ({ range, position }) => {
  const { theme } = useTheme();
  const isModern = theme === 'modern';

  return (
    <div className={`mt-6 rounded-3xl shadow-2xl p-6 md:p-8 ${
      isModern
        ? 'bg-white/80 backdrop-blur border border-slate-200/50 glow-effect'
        : 'bg-slate-900/80 backdrop-blur border border-slate-700/50 glow-effect-purple'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
        isModern
          ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
      }`}>
        💰 市场薪资参考
      </h2>
      <div className="text-center">
        <div className="inline-flex items-baseline gap-3">
          <span className={`text-5xl font-extrabold ${
            isModern
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
              : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
          }`}>
            {range.min.toLocaleString()}
          </span>
          <span className={`text-3xl ${isModern ? 'text-slate-400' : 'text-slate-500'}`}>-</span>
          <span className={`text-5xl font-extrabold ${
            isModern
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600'
              : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
          }`}>
            {range.max.toLocaleString()}
          </span>
          <span className={`text-xl ${isModern ? 'text-slate-500' : 'text-slate-400'}`}>
            {range.currency}/{range.unit}
          </span>
        </div>
        <p className={`mt-4 text-lg font-medium ${isModern ? 'text-slate-600' : 'text-slate-400'}`}>
          {position} 典型薪资区间（基于市场数据）
        </p>
        <p className={`mt-3 text-sm ${isModern ? 'text-slate-400' : 'text-slate-500'}`}>
          注：实际薪资受地区、工作经验、公司规模等因素影响
        </p>
      </div>
    </div>
  );
};

export default SalaryRange;