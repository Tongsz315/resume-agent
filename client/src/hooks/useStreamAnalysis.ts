import { useState, useCallback, useRef } from 'react';

export interface StreamAnalysisResult {
  keywordMatch?: number;
  matchAnalysis?: string;
  strengths?: string[];
  weaknesses?: string[];
  resumeScore?: {
    completeness: number;
    formatting: number;
    keywords: number;
  };
  optimizationTips?: Array<{
    category: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  interviewQuestions?: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    unit: string;
  };
  selfIntroduction?: string;
}

export interface StreamAnalysisState {
  isLoading: boolean;
  isStreaming: boolean;
  progress: number;
  progressMessage: string;
  result: StreamAnalysisResult;
  error?: string;
  sessionId?: string;
}

export function useStreamAnalysis() {
  const [state, setState] = useState<StreamAnalysisState>({
    isLoading: false,
    isStreaming: false,
    progress: 0,
    progressMessage: '',
    result: {},
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startAnalysis = useCallback(async (
    resumeText: string,
    jdText: string,
    companyBackground?: string,
    jobType?: string
  ) => {
    // 重置状态
    setState({
      isLoading: true,
      isStreaming: true,
      progress: 0,
      progressMessage: '准备分析...',
      result: {},
    });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/analyze/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jdText,
          companyBackground: companyBackground || '',
          jobType: jobType || 'technical'
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let currentResult: StreamAnalysisResult = {};

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const event = JSON.parse(data);

              switch (event.type) {
                case 'progress':
                  setState(prev => ({
                    ...prev,
                    progress: event.percent,
                    progressMessage: event.message,
                  }));
                  break;

                case 'analysis':
                  currentResult = {
                    ...currentResult,
                    [event.section]: event.content
                  };
                  setState(prev => ({
                    ...prev,
                    result: currentResult,
                  }));
                  break;

                case 'error':
                  setState(prev => ({
                    ...prev,
                    error: event.message,
                    isLoading: false,
                    isStreaming: false,
                  }));
                  break;

                case 'done':
                  setState(prev => ({
                    ...prev,
                    sessionId: event.sessionId,
                    isLoading: false,
                    isStreaming: false,
                    progress: 100,
                  }));
                  break;
              }
            } catch (parseError) {
              console.error('解析事件错误:', parseError);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          error: error.message || '分析失败',
          isLoading: false,
          isStreaming: false,
        }));
      }
    }
  }, []);

  const cancelAnalysis = useCallback(() => {
    abortControllerRef.current?.abort();
    setState(prev => ({
      ...prev,
      isLoading: false,
      isStreaming: false,
    }));
  }, []);

  const resetAnalysis = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({
      isLoading: false,
      isStreaming: false,
      progress: 0,
      progressMessage: '',
      result: {},
    });
  }, []);

  return {
    state,
    startAnalysis,
    cancelAnalysis,
    resetAnalysis,
  };
}
