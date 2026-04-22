import React from 'react';
import { useTheme } from '../contexts';

const SalaryRange: React.FC<{
  range: { min: number; max: number; currency: string; unit: string };
  position: string;
}> = ({ range, position }) => {
  const { isDark } = useTheme();
  const accent = isDark ? '#2997ff' : '#0071e3';

  return (
    <div className={`rounded-2xl p-6 md:p-8 text-center transition-colors ${
      isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-white border border-[rgba(0,0,0,0.04)]'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>市场薪资参考</h2>
      <div className="inline-flex items-baseline gap-3">
        <span className="text-4xl md:text-5xl font-bold" style={{ color: accent }}>
          {range.min.toLocaleString()}
        </span>
        <span className={`text-2xl ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>—</span>
        <span className="text-4xl md:text-5xl font-bold" style={{ color: accent }}>
          {range.max.toLocaleString()}
        </span>
        <span className={`text-lg ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{range.currency}/{range.unit}</span>
      </div>
      <p className={`mt-4 text-sm ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>
        {position} 典型薪资区间（基于市场数据）
      </p>
    </div>
  );
};

export default SalaryRange;
