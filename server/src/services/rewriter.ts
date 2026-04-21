import { callLLM } from './llm/provider';

function parseJSONResponse(text: string): any | null {
  try {
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      return JSON.parse(codeBlockMatch[1].trim());
    }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
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
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch {
    return null;
  }
}

export async function rewriteExperience(originalText: string, jdText: string, rewriteType: string) {
  const prompt = `你是一位专业的简历优化顾问。请根据以下信息优化这段经历描述：

原始经历：
${originalText}

目标岗位 JD：
${jdText}

请以 JSON 格式返回结果，包含以下字段：
{
  "rewrittenTextBasic": "保守优化版，保持原意但更专业",
  "rewrittenTextAdvanced": "更强表达版，更有冲击力和量化",
  "rewriteReason": "说明优化了哪些方面，100字左右"
}

注意：不要编造事实，基于原始内容优化。只返回JSON，不要包含其他文字。`;

  try {
    const result = await callLLM('你是专业的简历优化顾问。', prompt);
    if (!result.success || !result.content) {
      throw new Error(result.error || '调用失败');
    }
    const parsed = parseJSONResponse(result.content);
    if (!parsed) throw new Error('JSON解析失败');
    return {
      originalText,
      rewrittenTextBasic: parsed.rewrittenTextBasic || originalText,
      rewrittenTextAdvanced: parsed.rewrittenTextAdvanced || originalText,
      rewriteReason: parsed.rewriteReason || '优化完成'
    };
  } catch (error) {
    console.error('改写失败:', error);
    return {
      originalText,
      rewrittenTextBasic: originalText,
      rewrittenTextAdvanced: originalText,
      rewriteReason: '请稍后重试'
    };
  }
}

export async function optimizeProject(projectText: string, jdText: string) {
  const prompt = `你是一位专业的简历优化顾问。请优化这个项目经历描述：

项目原始描述：
${projectText}

目标岗位 JD：
${jdText}

请以 JSON 格式返回结果：
{
  "projectIntro": "简洁的项目简介，讲清楚项目背景和目标",
  "personalContribution": "个人贡献拆解，用 bullet point 形式",
  "starVersion": "STAR 风格的面试讲述版本",
  "quantizationTips": ["建议补充的量化维度1", "建议补充的量化维度2"]
}

注意：不要编造事实，基于原始内容优化。只返回JSON，不要包含其他文字。`;

  try {
    const result = await callLLM('你是专业的简历优化顾问。', prompt);
    if (!result.success || !result.content) {
      throw new Error(result.error || '调用失败');
    }
    const parsed = parseJSONResponse(result.content);
    if (!parsed) throw new Error('JSON解析失败');
    return {
      projectIntro: parsed.projectIntro || projectText,
      personalContribution: parsed.personalContribution || projectText,
      starVersion: parsed.starVersion || projectText,
      quantizationTips: parsed.quantizationTips || []
    };
  } catch (error) {
    console.error('项目优化失败:', error);
    return {
      projectIntro: projectText,
      personalContribution: projectText,
      starVersion: projectText,
      quantizationTips: []
    };
  }
}

export async function refineContent(text: string, goal: string) {
  const goalMap: Record<string, string> = {
    'more-concise': '让内容更简洁精炼',
    'more-product': '让内容更偏向产品经理视角',
    'more-interview': '让内容更适合面试讲述'
  };
  const goalDesc = goalMap[goal] || '优化内容';

  const prompt = `${goalDesc}：
${text}

请只返回优化后的文本内容。`;

  try {
    const result = await callLLM('你是专业的文案优化专家。', prompt);
    if (!result.success || !result.content) {
      throw new Error(result.error || '调用失败');
    }
    return { refinedText: result.content.trim() };
  } catch (error) {
    console.error('二次优化失败:', error);
    return { refinedText: text };
  }
}
