import { callLLM } from './llm/provider';

interface AnalyzeInput {
  resumeText: string;
  jdText: string;
  companyBackground: string;
}

interface AnalyzeResult {
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

function parseJSONResponse(text: string): any | null {
  try {
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      return JSON.parse(codeBlockMatch[1].trim());
    }
    let depth = 0;
    let startIdx = -1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{') {
        if (depth === 0) startIdx = i;
        depth++;
      } else if (text[i] === '}') {
        depth--;
        if (depth === 0 && startIdx !== -1) {
          try {
            return JSON.parse(text.substring(startIdx, i + 1));
          } catch {
            continue;
          }
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function analyzeResume(input: AnalyzeInput): Promise<AnalyzeResult> {
  const { resumeText, jdText, companyBackground } = input;

  const analysisPrompt = `你是一位专业的 HR 顾问，擅长简历分析和岗位匹配评估。

请分析以下简历与岗位描述的匹配程度，并给出详细分析报告。

## 简历内容：
${resumeText}

## 岗位描述（JD）：
${jdText}
${companyBackground ? `## 公司背景：\n${companyBackground}` : ''}

请以 JSON 格式返回分析结果，包含以下字段：
{
  "strengths": ["优势1", "优势2", "优势3", ...],
  "weaknesses": ["劣势1", "劣势2", "劣势3", ...],
  "keywordMatch": 75,
  "matchAnalysis": "详细的匹配分析说明，150-200字",
  "interviewQuestions": ["面试问题1", "面试问题2", ...],
  "resumeScore": {
    "completeness": 80,
    "formatting": 70,
    "keywords": 75
  },
  "optimizationTips": [
    {"category": "教育背景", "content": "建议描述...", "priority": "high"},
    {"category": "实习经历", "content": "建议描述...", "priority": "medium"}
  ],
  "salaryRange": {
    "min": 8000,
    "max": 15000,
    "currency": "CNY",
    "unit": "月"
  }
}

要求：strengths至少3个，weaknesses至少2个，interviewQuestions至少6个，optimizationTips至少6-8个覆盖教育背景/实习经历/技能描述/项目经验/简历排版/关键词优化/成果展示/时间线等方面。只返回JSON，不要包含其他文字。`;

  const introPrompt = `你是一位求职辅导专家，擅长为大学生撰写有针对性的自我介绍。

请根据以下简历内容和目标岗位，生成一段专业、突出亮点的自我介绍。

## 简历内容：
${resumeText}

## 岗位描述（JD）：
${jdText}
${companyBackground ? `## 公司背景：\n${companyBackground}` : ''}

要求：
1. 长度控制在 200-300 字
2. 突出与岗位最相关的经验和技能
3. 体现个人优势和价值
4. 语言专业、有感染力
5. 适合面试开场使用
6. 不要使用占位符，直接生成完整内容`;

  const defaultResult = {
    strengths: ['简历内容已读取'],
    weaknesses: ['请检查简历格式'],
    keywordMatch: 50,
    matchAnalysis: '分析服务暂时不可用，请稍后重试',
    interviewQuestions: [] as string[],
    resumeScore: { completeness: 50, formatting: 50, keywords: 50 },
    optimizationTips: [] as { category: string; content: string; priority: 'high' | 'medium' | 'low' }[],
    salaryRange: { min: 5000, max: 10000, currency: 'CNY', unit: '月' }
  };

  const [analysisResponse, introResponse] = await Promise.all([
    callLLM('你是一位专业的 HR 顾问，擅长简历分析和岗位匹配评估。', analysisPrompt),
    callLLM('你是一位求职辅导专家，擅长为大学生撰写有针对性的自我介绍。', introPrompt)
  ]);

  let analysisResult: any = defaultResult;
  if (analysisResponse.success && analysisResponse.content) {
    const parsed = parseJSONResponse(analysisResponse.content);
    if (parsed) {
      analysisResult = parsed;
    }
  }

  let selfIntroduction = '自我介绍生成失败，请稍后重试';
  if (introResponse.success && introResponse.content) {
    selfIntroduction = introResponse.content.trim();
  }

  return {
    strengths: analysisResult.strengths || defaultResult.strengths,
    weaknesses: analysisResult.weaknesses || defaultResult.weaknesses,
    keywordMatch: analysisResult.keywordMatch || defaultResult.keywordMatch,
    matchAnalysis: analysisResult.matchAnalysis || defaultResult.matchAnalysis,
    selfIntroduction,
    interviewQuestions: analysisResult.interviewQuestions || defaultResult.interviewQuestions,
    resumeScore: analysisResult.resumeScore || defaultResult.resumeScore,
    optimizationTips: analysisResult.optimizationTips || defaultResult.optimizationTips,
    salaryRange: analysisResult.salaryRange || defaultResult.salaryRange
  };
}
