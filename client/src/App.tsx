import { useState, useRef } from 'react';
import axios from 'axios';
import {
  FileUploader,
  InputModeToggle,
  TextAreaInput,
  LoadingSpinner,
  ResultDisplay,
  ThemeToggle,
  HistoryPanel,
  ExportModal,
  ErrorBanner,
  InterviewQuestions,
  ResumeScore,
  OptimizationTips,
  SalaryRange,
  LanguageSwitch,
  ModelStatus,
  ResultTabs,
  useToast,
} from './components';
import { useTheme, useHistory, useLocale, AnalysisRecord } from './contexts';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import './index.css';

// 类型定义
interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  keywordMatch: number;
  matchAnalysis: string;
  selfIntroduction: string;
  interviewQuestions?: string[];
  resumeScore?: {
    completeness: number;
    formatting: number;
    keywords: number;
  };
  optimizationTips?: {
    category: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    unit: string;
  };
}

type InputMode = 'text' | 'file';

function App() {
  const { theme } = useTheme();
  const { addRecord } = useHistory();
  const { t } = useLocale();
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();

  // 状态
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [companyBackground, setCompanyBackground] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    uploadFile(file);
  };

  // 上传并解析文件
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setResumeText(response.data.text);
        setError('');
      }
    } catch (err) {
      setError('文件解析失败，请尝试复制文本粘贴');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // 拖拽处理
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (
      file.type === 'application/pdf' ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc')
    )) {
      handleFileSelect(file);
    } else {
      setError('请上传 PDF 或 Word 文件');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 提交分析
  const handleSubmit = async () => {
    if (!resumeText.trim()) {
      setError('请输入简历内容');
      return;
    }
    if (!jdText.trim()) {
      setError('请输入岗位描述');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/analyze', {
        resumeText: resumeText.trim(),
        jdText: jdText.trim(),
        companyBackground: companyBackground.trim(),
      });

      if (response.data.success) {
        setResult(response.data);
        // 保存到历史记录
        addRecord({
          resumeText: resumeText.trim(),
          jdText: jdText.trim(),
          result: response.data,
        });
      } else {
        setError(response.data.error || '分析失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '请求失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 重置
  const handleReset = () => {
    setResumeText('');
    setJdText('');
    setCompanyBackground('');
    setSelectedFile(null);
    setResult(null);
    setError('');
  };

  // 复制自我介绍
  const copyToClipboard = async () => {
    if (result?.selfIntroduction) {
      const ok = await copy(result.selfIntroduction);
      showToast(ok ? t('copySuccess') : '复制失败', ok ? 'success' : 'error');
    }
  };

  // 复制面试问题
  const copyQuestions = async () => {
    if (result?.interviewQuestions) {
      const ok = await copy(result.interviewQuestions.join('\n'));
      showToast(ok ? t('copySuccess') : '复制失败', ok ? 'success' : 'error');
    }
  };

  // 加载历史记录
  const loadRecord = (record: AnalysisRecord) => {
    setResumeText(record.resumeText);
    setJdText(record.jdText);
    setResult(record.result);
  };

  // 主题样式配置
  const isModern = theme === 'modern';

  return (
    <div className={`min-h-screen py-8 px-4 transition-all duration-500 ${
      isModern
        ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
        : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    }`}>
      {/* 主题切换和语言切换 */}
      <ThemeToggle />
      <LanguageSwitch />

      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-extrabold mb-3 bg-clip-text text-transparent ${
            isModern
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              : 'bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400'
          }`}>
            {t('appTitle')}
          </h1>
          <p className={`text-lg ${isModern ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('appSubtitle')}
          </p>
          <button
            onClick={() => setHistoryOpen(true)}
            className={`mt-5 px-6 py-3 rounded-2xl font-semibold transition-all ${
              isModern
                ? 'bg-white text-slate-700 hover:bg-slate-50 shadow-xl hover:shadow-2xl border border-slate-200'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/90 shadow-xl hover:shadow-2xl border border-slate-700/50'
            }`}
          >
            📜 查看历史
          </button>
        </div>

        {/* 主卡片 */}
        <div className={`rounded-3xl p-6 md:p-8 transition-all duration-500 ${
          isModern
            ? 'bg-white/80 backdrop-blur-xl shadow-2xl border border-slate-200/50 glow-effect'
            : 'bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-slate-700/50 glow-effect-purple'
        }`}>
          {/* 输入模式切换 */}
          <InputModeToggle
            mode={inputMode}
            onModeChange={setInputMode}
          />

          {/* 简历输入 */}
          <TextAreaInput
            label={t('resumeContent')}
            value={resumeText}
            onChange={setResumeText}
            placeholder={t('resumePlaceholder')}
            height="h-48"
          />

          {/* 文件上传区域 */}
          {inputMode === 'file' && (
            <div className="mb-6">
              <label className={`block text-lg font-semibold mb-3 ${
                isModern ? 'text-slate-800' : 'text-slate-200'
              }`}>
                上传简历文件
              </label>
              <FileUploader
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              />
              {isUploading && (
                <div className="mt-3 text-sm">
                  <LoadingSpinner message="正在解析文件..." />
                </div>
              )}
            </div>
          )}

          {/* JD 输入 */}
          <TextAreaInput
            label={t('jdLabel')}
            value={jdText}
            onChange={setJdText}
            placeholder={t('jdPlaceholder')}
            height="h-32"
          />

          {/* 公司背景（可选） */}
          <TextAreaInput
            label={t('companyBackground')}
            value={companyBackground}
            onChange={setCompanyBackground}
            placeholder={t('companyPlaceholder')}
            height="h-20"
          />

          {/* 错误提示 */}
          {error && (
            <ErrorBanner
              message={error}
              onRetry={handleSubmit}
              onDismiss={() => setError('')}
            />
          )}

          {/* 按钮组 */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                isLoading
                  ? (isModern ? 'bg-slate-300 text-slate-500' : 'bg-slate-700 text-slate-500') + ' cursor-not-allowed'
                  : isModern
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02]'
                    : 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <LoadingSpinner message={t('analyzing')} />
              ) : (
                t('startAnalysis')
              )}
            </button>
            <button
              onClick={handleReset}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all ${
                isModern
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              🔄 重置
            </button>
          </div>
        </div>

        {/* 结果展示 */}
        {result && (
          <div className="fade-in">
            {/* 简历评分 */}
            {result.resumeScore && (
              <div className="mb-6">
                <ResumeScore
                  completeness={result.resumeScore.completeness}
                  formatting={result.resumeScore.formatting}
                  keywords={result.resumeScore.keywords}
                />
              </div>
            )}

            {/* Tab 切换的主要内容 */}
            <ResultTabs
              result={result}
              jdText={jdText}
              onCopyIntro={copyToClipboard}
              onExport={() => setExportOpen(true)}
              resumeText={resumeText}
            />

            {/* 薪资参考 */}
            {result.salaryRange && (
              <div className="mt-6">
                <SalaryRange
                  range={result.salaryRange}
                  position="该岗位"
                />
              </div>
            )}

            {/* 优化建议 */}
            {result.optimizationTips && result.optimizationTips.length > 0 && (
              <div className="mt-6">
                <OptimizationTips tips={result.optimizationTips} />
              </div>
            )}

            {/* 面试问题 */}
            {result.interviewQuestions && result.interviewQuestions.length > 0 && (
              <div className="mt-6">
                <InterviewQuestions
                  questions={result.interviewQuestions}
                  onCopy={copyQuestions}
                />
              </div>
            )}
          </div>
        )}

        {/* 使用提示 */}
        <div className={`mt-8 p-5 rounded-2xl text-center text-sm ${
          isModern
            ? 'bg-white/50 backdrop-blur text-slate-600 border border-slate-200/50'
            : 'bg-slate-900/50 backdrop-blur text-slate-400 border border-slate-700/50'
        }`}>
          <p>💡 {t('mobileHint')}</p>
        </div>

        {/* 页脚 */}
        <div className="mt-8 text-center text-sm">
          <p className={`${isModern ? 'text-slate-500' : 'text-slate-500'}`}>
            {t('poweredBy')}
          </p>
        </div>
      </div>

      {/* 历史记录面板 */}
      <HistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoadRecord={loadRecord}
      />

      {/* 导出弹窗 */}
      {result && exportOpen && (
        <ExportModal
          record={{
            id: 'export',
            timestamp: Date.now(),
            resumeText,
            jdText,
            result,
          }}
          onClose={() => setExportOpen(false)}
        />
      )}

      {/* 模型状态 */}
      <ModelStatus />
    </div>
  );
}

export default App;