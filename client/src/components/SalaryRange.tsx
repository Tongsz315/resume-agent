import React from 'react';

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
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        💰 市场薪资参考
      </h2>
      <div className="text-center">
        <div className="inline-flex items-baseline gap-2">
          <span className="text-4xl font-bold text-indigo-600">
            {range.min.toLocaleString()}
          </span>
          <span className="text-2xl text-gray-400">-</span>
          <span className="text-4xl font-bold text-indigo-600">
            {range.max.toLocaleString()}
          </span>
          <span className="text-xl text-gray-500">{range.currency}/{range.unit}</span>
        </div>
        <p className="mt-3 text-gray-600">
          {position} 典型薪资区间（基于市场数据）
        </p>
        <p className="mt-2 text-sm text-gray-400">
          注：实际薪资受地区、工作经验、公司规模等因素影响
        </p>
      </div>
    </div>
  );
};

export default SalaryRange;