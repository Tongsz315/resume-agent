import axios from 'axios';

// 智谱 GLM API 配置（正确的 API 地址）
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const GLM_MODEL = process.env.GLM_MODEL || 'glm-4-flash';

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

/**
 * 调用智谱 GLM API
 */
async function callGLM(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GLM_API_KEY;

  console.log('API 调用信息:', {
    apiUrl: GLM_API_URL,
    model: GLM_MODEL,
    hasApiKey: !!apiKey,
  });

  if (!apiKey) {
    throw new Error('未配置 GLM_API_KEY，请在 .env 文件中设置');
  }

  try {
    const response = await axios.post(
      GLM_API_URL,
      {
        model: GLM_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 120000
      }
    );

    console.log('API 响应:', response.status);
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('GLM API 错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    if (error.response?.status === 401) {
      throw new Error('API Key 无效，请检查配置');
    }
    if (error.response?.status === 404) {
      throw new Error('API 地址无效，请检查配置');
    }
    if (error.response?.status === 429) {
      throw new Error('请求次数过多，请稍后重试');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请稍后重试');
    }
    throw new Error(`AI 服务错误: ${error.message}`);
  }
}

/**
 * 分析简历
 */
export async function analyzeResume(input: AnalyzeInput): Promise<AnalyzeResult> {
  const { resumeText, jdText, companyBackground } = input;

  // 步骤1：分析简历与 JD 的匹配度
  const analysisPrompt = `你是一位专业的 HR 顾问，擅长简历分析和岗位匹配评估。

请分析以下简历与岗位描述的匹配程度，并给出详细分析报告。

## 简历内容：
${resumeText}

## 岗位描述（JD）：
${jdText}
${companyBackground ? `## 公司背景：\n${companyBackground}` : ''}

请以 JSON 格式返回分析结果，包含以下字段：
{
  "strengths": ["优势1", "优势2", ...],  // 简历中的亮点，与JD匹配的优点
  "weaknesses": ["劣势1", "劣势2", ...],  // 需要提升的方面，与JD要求有差距的地方
  "keywordMatch": 75,  // 0-100的匹配度分数
  "matchAnalysis": "详细的匹配分析说明，100-200字",  // 包含如何弥补劣势的建议
  "interviewQuestions": ["面试问题1", "面试问题2", ...],  // 根据简历和JD预测5-8个高频面试问题
  "resumeScore": {  // 简历评分
    "completeness": 80,  // 完整度 0-100
    "formatting": 70,  // 规范性 0-100
    "keywords": 75  // 关键词匹配度 0-100
  },
  "optimizationTips": [  // 简历优化建议
    {"category": "教育背景", "content": "建议描述...", "priority": "high"},
    {"category": "实习经历", "content": "建议描述...", "priority": "medium"}
  ],
  "salaryRange": {  // 市场薪资参考
    "min": 8000,  // 最低月薪
    "max": 15000,  // 最高月薪
    "currency": "CNY",
    "unit": "月"
  }
}

请确保返回的是合法的 JSON 格式，不要包含其他内容。`;

  let analysisResult: any;
  try {
    const analysisText = await callGLM(
      '你是一位专业的 HR 顾问，擅长简历分析和岗位匹配评估。',
      analysisPrompt
    );
    
    // 尝试解析 JSON
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      analysisResult = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('无法解析分析结果');
    }
  } catch (error) {
    console.error('Analysis parsing error:', error);
    // 使用默认结果
    analysisResult = {
      strengths: ['简历内容已读取'],
      weaknesses: ['请检查简历格式'],
      keywordMatch: 50,
      matchAnalysis: '分析服务暂时不可用，请稍后重试',
      interviewQuestions: [],
      resumeScore: { completeness: 50, formatting: 50, keywords: 50 },
      optimizationTips: [],
      salaryRange: { min: 5000, max: 10000, currency: 'CNY', unit: '月' }
    };
  }

  // 步骤2：生成定制化自我介绍
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

  let selfIntroduction: string;
  try {
    selfIntroduction = await callGLM(
      '你是一位求职辅导专家，擅长为大学生撰写有针对性的自我介绍。',
      introPrompt
    );
  } catch (error) {
    console.error('Self-intro generation error:', error);
    selfIntroduction = '自我介绍生成失败，请稍后重试';
  }

  return {
    strengths: analysisResult.strengths || [],
    weaknesses: analysisResult.weaknesses || [],
    keywordMatch: analysisResult.keywordMatch || 50,
    matchAnalysis: analysisResult.matchAnalysis || '',
    selfIntroduction: selfIntroduction.trim(),
    interviewQuestions: analysisResult.interviewQuestions || [],
    resumeScore: analysisResult.resumeScore || { completeness: 50, formatting: 50, keywords: 50 },
    optimizationTips: analysisResult.optimizationTips || [],
    salaryRange: analysisResult.salaryRange || { min: 5000, max: 10000, currency: 'CNY', unit: '月' }
  };
}