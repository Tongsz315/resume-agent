import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FileUploader,
  InputModeToggle,
  TextAreaInput,
  LoadingSpinner,
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
  PageNav,
  useToast,
} from './components';
import { useTheme, useHistory, useLocale, AnalysisRecord } from './contexts';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import './index.css';

interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  keywordMatch: number;
  matchAnalysis: string;
  selfIntroduction: string;
  interviewQuestions?: string[];
  resumeScore?: { completeness: number; formatting: number; keywords: number };
  optimizationTips?: { category: string; content: string; priority: 'high' | 'medium' | 'low' }[];
  salaryRange?: { min: number; max: number; currency: string; unit: string };
}

type InputMode = 'text' | 'file';

const SECTIONS = [
  { id: 'hero', label: '首页', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'features', label: '功能', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'input', label: '分析', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'results', label: '结果', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const TEMPLATES = [
  { label: '前端开发', resume: '熟悉React、Vue等前端框架，有项目经验...', jd: '负责公司前端产品开发，要求熟悉React/Vue...' },
  { label: '产品经理', resume: '有产品实习经验，擅长需求分析和用户调研...', jd: '负责产品规划与需求管理，有B端产品经验优先...' },
  { label: '数据分析师', resume: '熟悉Python、SQL，有数据建模经验...', jd: '负责业务数据分析，要求熟练使用SQL和Python...' },
];

function useSectionVisibility() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']));
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              next.add(entry.target.id);
            }
          });
          return next;
        });
      },
      { threshold: 0.15 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return visibleSections;
}

function App() {
  const { theme } = useTheme();
  const { addRecord } = useHistory();
  const { t } = useLocale();
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();
  const isDark = theme === 'dark-tech';

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
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleSections = useSectionVisibility();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const id = entry.target.id;
            const idx = SECTIONS.findIndex((s) => s.id === id);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { root: container, threshold: 0.4 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [result]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (historyOpen || exportOpen) return;
      const navSections = result ? SECTIONS : SECTIONS.slice(0, 3);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(activeSection + 1, navSections.length - 1);
        if (next !== activeSection) scrollToSection(next);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = Math.max(activeSection - 1, 0);
        if (prev !== activeSection) scrollToSection(prev);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(navSections.length - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, result, historyOpen, exportOpen]);

  const scrollToSection = useCallback((index: number) => {
    if (isScrolling) return;
    const id = SECTIONS[index]?.id;
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      setIsScrolling(true);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index);
      setTimeout(() => setIsScrolling(false), 1000);
    }
  }, [isScrolling]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    uploadFile(file);
  };

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
    } catch {
      setError('文件解析失败，请尝试复制文本粘贴');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
      handleFileSelect(file);
    } else {
      setError('请上传 PDF 或 Word 文件');
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSubmit = async () => {
    if (!resumeText.trim()) { setError('请输入简历内容'); return; }
    if (!jdText.trim()) { setError('请输入岗位描述'); return; }
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
        addRecord({ resumeText: resumeText.trim(), jdText: jdText.trim(), result: response.data });
        setTimeout(() => scrollToSection(3), 300);
      } else {
        setError(response.data.error || '分析失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '请求失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setJdText('');
    setCompanyBackground('');
    setSelectedFile(null);
    setResult(null);
    setError('');
  };

  const copyToClipboard = async () => {
    if (result?.selfIntroduction) {
      const ok = await copy(result.selfIntroduction);
      showToast(ok ? t('copySuccess') : '复制失败', ok ? 'success' : 'error');
    }
  };

  const copyQuestions = async () => {
    if (result?.interviewQuestions) {
      const ok = await copy(result.interviewQuestions.join('\n'));
      showToast(ok ? t('copySuccess') : '复制失败', ok ? 'success' : 'error');
    }
  };

  const loadRecord = (record: AnalysisRecord) => {
    setResumeText(record.resumeText);
    setJdText(record.jdText);
    setResult(record.result);
  };

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setResumeText(tpl.resume);
    setJdText(tpl.jd);
    setShowTemplates(false);
  };

  const navSections = result ? SECTIONS : SECTIONS.slice(0, 3);
  const accent = isDark ? '#2997ff' : '#0071e3';

  return (
    <div className={`h-screen transition-colors duration-500 ${
      isDark ? 'bg-black text-[#f5f5f7]' : 'bg-white text-[#1d1d1f]'
    }`}>
      {/* Top Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isDark ? 'bg-black/80' : 'bg-white/80'
      } backdrop-blur-xl border-b ${
        isDark ? 'border-[rgba(255,255,255,0.06)]' : 'border-[rgba(0,0,0,0.06)]'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold tracking-tight ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
              ResumeAI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navSections.map((section, i) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(i)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeSection === i
                    ? 'text-white'
                    : isDark
                      ? 'text-[#a1a1a6] hover:text-white'
                      : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                {activeSection === i && (
                  <span
                    className="absolute inset-0 rounded-full transition-all duration-500"
                    style={{ background: accent }}
                  />
                )}
                <span className="relative">{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitch />
            <button
              onClick={() => setHistoryOpen(true)}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-[rgba(255,255,255,0.08)] text-[#a1a1a6]' : 'hover:bg-[#f5f5f7] text-[#6e6e73]'
              }`}
              aria-label="History"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation (Desktop) */}
      <PageNav sections={navSections} activeIndex={activeSection} onNavigate={scrollToSection} />

      {/* Mobile Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-500 ${
        isDark ? 'bg-black/80 border-[rgba(255,255,255,0.06)]' : 'bg-white/80 border-[rgba(0,0,0,0.06)]'
      } backdrop-blur-xl border-t safe-area-bottom`}>
        <div className="flex items-center justify-around h-14">
          {navSections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(i)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-300 ${
                activeSection === i
                  ? isDark ? 'text-[#2997ff]' : 'text-[#0071e3]'
                  : isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={activeSection === i ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={section.icon}/>
              </svg>
              <span className="text-[10px] font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Scroll Container */}
      <div ref={scrollRef} className="scroll-container">
        {/* Section 1: Hero */}
        <section id="hero" className={`scroll-section ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className={`section-content text-center px-6 ${visibleSections.has('hero') ? 'visible' : ''}`}>
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-5 ${
              isDark ? 'text-white' : 'text-[#1d1d1f]'
            }`}>
              {t('appTitle')}
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${
              isDark ? 'text-[#a1a1a6]' : 'text-[#6e6e73]'
            }`}>
              {t('appSubtitle')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection(2)}
                className="px-10 py-4 rounded-full text-white font-medium text-lg transition-all hover:scale-105 active:scale-95"
                style={{ background: accent }}
              >
                开始分析
              </button>
              <button
                onClick={() => setHistoryOpen(true)}
                className={`px-10 py-4 rounded-full font-medium text-lg transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'bg-[#1d1d1f] text-[#2997ff] border border-[rgba(255,255,255,0.12)]'
                    : 'bg-[#f5f5f7] text-[#0071e3]'
                }`}
              >
                查看历史
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button
              onClick={() => scrollToSection(1)}
              className={`animate-bounce ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </section>

        {/* Section 2: Features */}
        <section id="features" className={`scroll-section ${isDark ? 'bg-[#111111]' : 'bg-[#f5f5f7]'}`}>
          <div className={`section-content w-full max-w-5xl mx-auto px-6 ${visibleSections.has('features') ? 'visible' : ''}`}>
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight text-center mb-4 ${
              isDark ? 'text-white' : 'text-[#1d1d1f]'
            }`}>
              为你的求职赋能
            </h2>
            <p className={`text-center mb-14 ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>
              四大核心功能，全方位优化你的简历
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { icon: '🎯', title: '智能匹配', desc: '精准分析简历与岗位匹配度' },
                { icon: '✨', title: '经历优化', desc: 'STAR法则改写，量化成果' },
                { icon: '🎤', title: '面试预测', desc: '基于简历生成面试问题' },
                { icon: '💰', title: '薪资参考', desc: '市场薪资区间一目了然' },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`text-center section-content ${visibleSections.has('features') ? 'visible' : ''}`}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl mb-4 ${
                    isDark ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-white'
                  }`}>
                    <span className="text-3xl md:text-4xl">{f.icon}</span>
                  </div>
                  <h3 className={`font-semibold text-base md:text-lg mb-2 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>{f.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Input */}
        <section id="input" className={`scroll-section ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className={`section-content w-full max-w-3xl mx-auto px-6 ${visibleSections.has('input') ? 'visible' : ''}`}>
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight text-center mb-3 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
              输入信息
            </h2>
            <p className={`text-center mb-8 ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>
              粘贴简历和岗位描述，获取专业分析
            </p>

            <div className="mb-6 text-center">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={`text-sm font-medium transition-colors ${isDark ? 'text-[#2997ff]' : 'text-[#0071e3]'}`}
              >
                {showTemplates ? '收起模板' : '📋 使用快捷模板'}
              </button>
              {showTemplates && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center slide-down">
                  {TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => applyTemplate(tpl)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                        isDark ? 'bg-[#1d1d1f] text-[#a1a1a6] border border-[rgba(255,255,255,0.08)] hover:border-[#2997ff] hover:text-[#2997ff]'
                          : 'bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`rounded-2xl md:rounded-3xl p-6 md:p-8 transition-colors ${
              isDark ? 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.06)]' : 'bg-[#f5f5f7] border border-[rgba(0,0,0,0.04)]'
            }`}>
              <InputModeToggle mode={inputMode} onModeChange={setInputMode} />

              <TextAreaInput label={t('resumeContent')} value={resumeText} onChange={setResumeText} placeholder={t('resumePlaceholder')} height="h-36" />

              {inputMode === 'file' && (
                <div className="mb-6">
                  <FileUploader selectedFile={selectedFile} onFileSelect={handleFileSelect} onDrop={handleDrop} onDragOver={handleDragOver} />
                  {isUploading && <div className="mt-2 text-sm"><LoadingSpinner message="正在解析文件..." /></div>}
                </div>
              )}

              <TextAreaInput label={t('jdLabel')} value={jdText} onChange={setJdText} placeholder={t('jdPlaceholder')} height="h-24" />
              <TextAreaInput label={t('companyBackground')} value={companyBackground} onChange={setCompanyBackground} placeholder={t('companyPlaceholder')} height="h-16" />

              {error && <ErrorBanner message={error} onRetry={handleSubmit} onDismiss={() => setError('')} />}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`flex-1 py-4 rounded-xl font-semibold text-base transition-all text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                  style={{ background: isLoading ? undefined : accent }}
                >
                  {isLoading ? <LoadingSpinner message={t('analyzing')} /> : t('startAnalysis')}
                </button>
                <button
                  onClick={handleReset}
                  className={`px-6 py-4 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isDark ? 'bg-[#2d2d2f] text-[#a1a1a6]' : 'bg-white text-[#6e6e73] border border-[rgba(0,0,0,0.06)]'
                  }`}
                >
                  重置
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Results (only shown when result exists) */}
        {result && (
          <section id="results" className={`scroll-section section-auto-height ${isDark ? 'bg-[#111111]' : 'bg-[#f5f5f7]'}`}>
            <div className={`section-content w-full max-w-3xl mx-auto px-6 ${visibleSections.has('results') ? 'visible' : ''}`}>
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight text-center mb-10 ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                分析结果
              </h2>

              {result.resumeScore && (
                <div className="mb-6">
                  <ResumeScore completeness={result.resumeScore.completeness} formatting={result.resumeScore.formatting} keywords={result.resumeScore.keywords} />
                </div>
              )}

              <ResultTabs result={result} jdText={jdText} onCopyIntro={copyToClipboard} onExport={() => setExportOpen(true)} resumeText={resumeText} />

              {result.salaryRange && (
                <div className="mt-6">
                  <SalaryRange range={result.salaryRange} position="该岗位" />
                </div>
              )}

              {result.optimizationTips && result.optimizationTips.length > 0 && (
                <div className="mt-6">
                  <OptimizationTips tips={result.optimizationTips} />
                </div>
              )}

              {result.interviewQuestions && result.interviewQuestions.length > 0 && (
                <div className="mt-6">
                  <InterviewQuestions questions={result.interviewQuestions} onCopy={copyQuestions} />
                </div>
              )}

              <div className="mt-8 text-center">
                <p className={`text-xs ${isDark ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{t('poweredBy')}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} onLoadRecord={loadRecord} />
      {result && exportOpen && (
        <ExportModal record={{ id: 'export', timestamp: Date.now(), resumeText, jdText, result }} onClose={() => setExportOpen(false)} />
      )}
      <ModelStatus />
    </div>
  );
}

export default App;
