import { Router } from 'express';
import multer from 'multer';
import { analyzeResume } from '../services/analyzer.js';
import { parseFile } from '../services/fileParser.js';
import { rewriteExperience, optimizeProject, refineContent } from '../services/rewriter.js';
import { recordFeedback, getFeedbackStats, getFeedbacks, analyzeFeedbackTrends } from '../services/feedback.js';

const router = Router();

// 获取模型状态
router.get('/status', (req, res) => {
  res.json({
    success: true,
    model: process.env.GLM_MODEL || 'glm-4-flash',
    hasApiKey: !!process.env.GLM_API_KEY,
    status: 'healthy'
  });
});

// 配置文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 PDF 和 Word 文件'));
    }
  }
});

// 上传并解析文件
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: '请上传文件' });
      return;
    }

    const text = await parseFile(req.file);
    
    res.json({
      success: true,
      text,
      fileName: req.file.originalname
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || '文件解析失败'
    });
  }
});

const MAX_TEXT_LENGTH = 10000;

function validateTextLength(text: string, fieldName: string): string | null {
  if (text.length > MAX_TEXT_LENGTH) {
    return `${fieldName}内容过长，请控制在${MAX_TEXT_LENGTH}字符以内`;
  }
  return null;
}

// 分析简历
router.post('/analyze', async (req, res) => {
  try {
    const { resumeText, jdText, companyBackground } = req.body;

    if (!resumeText?.trim()) {
      res.status(400).json({ success: false, error: '请提供简历内容' });
      return;
    }

    if (!jdText?.trim()) {
      res.status(400).json({ success: false, error: '请提供岗位描述' });
      return;
    }

    const lenError = validateTextLength(resumeText, '简历') || validateTextLength(jdText, '岗位描述');
    if (lenError) {
      res.status(400).json({ success: false, error: lenError });
      return;
    }

    const result = await analyzeResume({
      resumeText: resumeText.trim(),
      jdText: jdText.trim(),
      companyBackground: companyBackground?.trim() || ''
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || '分析失败，请稍后重试'
    });
  }
});

// 经历改写
router.post('/rewrite', async (req, res) => {
  try {
    const { originalText, jdText, rewriteType } = req.body;
    if (!originalText?.trim() || !jdText?.trim()) {
      res.status(400).json({ success: false, error: '缺少必要参数' });
      return;
    }
    const result = await rewriteExperience(originalText, jdText, rewriteType || 'experience');
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('改写错误:', error);
    res.status(500).json({ success: false, error: '改写失败，请稍后重试' });
  }
});

// 项目优化
router.post('/project-optimize', async (req, res) => {
  try {
    const { projectText, jdText } = req.body;
    if (!projectText?.trim() || !jdText?.trim()) {
      res.status(400).json({ success: false, error: '缺少必要参数' });
      return;
    }
    const result = await optimizeProject(projectText, jdText);
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('项目优化错误:', error);
    res.status(500).json({ success: false, error: '优化失败，请稍后重试' });
  }
});

// 二次优化
router.post('/refine', async (req, res) => {
  try {
    const { text, goal } = req.body;
    if (!text?.trim()) {
      res.status(400).json({ success: false, error: '缺少必要参数' });
      return;
    }
    const result = await refineContent(text, goal || 'more-concise');
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('二次优化错误:', error);
    res.status(500).json({ success: false, error: '优化失败，请稍后重试' });
  }
});

// 收集反馈（增强版本）
router.post('/feedback', async (req, res) => {
  try {
    const feedback = req.body;
    await recordFeedback(feedback);
    res.json({ success: true });
  } catch (error: any) {
    console.error('反馈记录错误:', error);
    res.status(500).json({ success: false, error: '记录失败' });
  }
});

// 获取反馈统计
router.get('/feedback/stats', async (req, res) => {
  try {
    const stats = getFeedbackStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    console.error('获取统计错误:', error);
    res.status(500).json({ success: false, error: '获取失败' });
  }
});

// 获取反馈数据
router.get('/feedback/data', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const feedbacks = getFeedbacks(limit);
    res.json({ success: true, feedbacks });
  } catch (error: any) {
    console.error('获取反馈数据错误:', error);
    res.status(500).json({ success: false, error: '获取失败' });
  }
});

// 获取反馈趋势分析
router.get('/feedback/trends', async (req, res) => {
  try {
    const trends = analyzeFeedbackTrends();
    res.json({ success: true, trends });
  } catch (error: any) {
    console.error('获取趋势错误:', error);
    res.status(500).json({ success: false, error: '获取失败' });
  }
});

export default router;
