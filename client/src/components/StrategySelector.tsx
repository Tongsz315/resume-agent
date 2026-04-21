import React from 'react';
import { useTheme } from '../contexts';

type JobType = 'technical' | 'product' | 'design' | 'operation';

interface StrategySelectorProps {
  value: JobType;
  onChange: (value: JobType) => void;
}

interface StrategyOption {
  value: JobType;
  label: string;
  icon: string;
  description: string;
}

const strategies: StrategyOption[] = [
  {
    value: 'technical',
    label: '技术开发',
    icon: '💻',
    description: '侧重技术栈、项目复杂度和系统设计能力'
  },
  {
    value: 'product',
    label: '产品经理',
    icon: '📦',
    description: '侧重产品思维、业务理解和数据分析能力'
  },
  {
    value: 'design',
    label: '设计师',
    icon: '🎨',
    description: '侧重设计思维、用户体验和作品集质量'
  },
  {
    value: 'operation',
    label: '运营',
    icon: '📈',
    description: '侧重增长思维、运营能力和数据分析能力'
  }
];

const StrategySelector: React.FC<StrategySelectorProps> = ({ value, onChange }) => {
  const { isModern } = useTheme();

  return (
    <div className="mb-6">
      <label className={`block mb-3 font-semibold ${isModern ? 'text-slate-800' : 'text-slate-200'}`}>
        选择岗位类型
      </label>
      <div className="grid grid-cols-2 gap-3">
        {strategies.map((strategy) => (
          <button
            key={strategy.value}
            onClick={() => onChange(strategy.value)}
            className={`p-4 rounded-2xl text-left transition-all ${
              value === strategy.value
                ? isModern
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-lg'
                  : 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-500/70 shadow-lg'
                : isModern
                  ? 'bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{strategy.icon}</span>
              <span className={`font-semibold ${
                isModern ? 'text-slate-800' : 'text-slate-200'
              }`}>
                {strategy.label}
              </span>
              {value === strategy.value && (
                <span className={`ml-auto ${isModern ? 'text-blue-500' : 'text-purple-400'}`}>✓</span>
              )}
            </div>
            <p className={`text-xs ${isModern ? 'text-slate-500' : 'text-slate-400'}`}>
              {strategy.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StrategySelector;
