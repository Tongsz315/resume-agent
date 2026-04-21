import { Router } from 'express';
import multer from 'multer';
import { analyzeResume } from '../services/analyzer.js';
import { parseFile } from '../services/fileParser.js';

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

export default router;
