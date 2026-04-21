import { Router, Request, Response } from 'express';
import { analyzeResume } from '../services/analyzer.js';
import { JobType, getStrategy, getSystemPrompt } from '../services/analyzer/strategy/index.js';

const router = Router();

type StreamEvent = 
  | { type: 'progress'; message: string; percent: number }
  | { type: 'analysis'; section: string; content: any }
  | { type: 'error'; message: string }
  | { type: 'done'; sessionId: string };

/**
 * 流式分析接口
 */
router.post('/analyze/stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const sessionId = 'session_' + Date.now();
  let isClosed = false;

  req.on('close', () => {
    isClosed = true;
  });

  const sendEvent = (event: StreamEvent) => {
    if (isClosed) return;
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  try {
    const { resumeText, jdText, companyBackground, jobType } = req.body;

    if (!resumeText?.trim()) {
      sendEvent({ type: 'error', message: '请提供简历内容' });
      res.end();
      return;
    }

    if (!jdText?.trim()) {
      sendEvent({ type: 'error', message: '请提供岗位描述' });
      res.end();
      return;
    }

    // 步骤1：发送开始进度
    sendEvent({
      type: 'progress',
      message: '正在解析简历...',
      percent: 10
    });

    // 步骤2：应用岗位策略
    const strategy = getStrategy(jobType as JobType);
    sendEvent({
      type: 'progress',
      message: `正在使用 ${strategy.displayName} 策略分析...`,
      percent: 30
    });

    // 步骤3：执行分析
    const result = await analyzeResume({
      resumeText: resumeText.trim(),
      jdText: jdText.trim(),
      companyBackground: companyBackground?.trim() || ''
    });

    sendEvent({
      type: 'progress',
      message: '分析完成，正在生成结果...',
      percent: 70
    });

    // 步骤4：逐个发送分析结果
    sendEvent({
      type: 'analysis',
      section: 'overview',
      content: {
        keywordMatch: result.keywordMatch,
        matchAnalysis: result.matchAnalysis
      }
    });

    sendEvent({
      type: 'analysis',
      section: 'strengths',
      content: result.strengths
    });

    sendEvent({
      type: 'analysis',
      section: 'weaknesses',
      content: result.weaknesses
    });

    if (result.resumeScore) {
      sendEvent({
        type: 'analysis',
        section: 'resumeScore',
        content: result.resumeScore
      });
    }

    if (result.optimizationTips) {
      sendEvent({
        type: 'analysis',
        section: 'optimizationTips',
        content: result.optimizationTips
      });
    }

    if (result.interviewQuestions) {
      sendEvent({
        type: 'analysis',
        section: 'interviewQuestions',
        content: result.interviewQuestions
      });
    }

    if (result.salaryRange) {
      sendEvent({
        type: 'analysis',
        section: 'salaryRange',
        content: result.salaryRange
      });
    }

    sendEvent({
      type: 'analysis',
      section: 'selfIntroduction',
      content: result.selfIntroduction
    });

    sendEvent({
      type: 'progress',
      message: '全部完成！',
      percent: 100
    });

    sendEvent({
      type: 'done',
      sessionId
    });

    res.end();
  } catch (error: any) {
    console.error('Stream analysis error:', error);
    sendEvent({
      type: 'error',
      message: error.message || '分析失败，请稍后重试'
    });
    res.end();
  }
});

export default router;
