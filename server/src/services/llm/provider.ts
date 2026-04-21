import axios from 'axios';

// 智谱 GLM API 配置
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const GLM_MODEL = process.env.GLM_MODEL || 'glm-4-flash';

interface LLMResponse {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * 标准 LLM 调用接口
 */
export async function callLLM(
  systemPrompt: string,
  userMessage: string,
  temperature: number = 0.7,
  maxTokens: number = 2000
): Promise<LLMResponse> {
  const apiKey = process.env.GLM_API_KEY;

  console.log('LLM 调用信息:', {
    model: GLM_MODEL,
    hasApiKey: !!apiKey,
  });

  if (!apiKey) {
    return { success: false, error: '未配置 GLM_API_KEY，请在 .env 文件中设置' };
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
        temperature,
        max_tokens: maxTokens
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 120000
      }
    );

    return {
      success: true,
      content: response.data.choices[0].message.content
    };
  } catch (error: any) {
    console.error('LLM API 错误:', error.message);
    
    let errorMsg = 'AI 服务错误';
    if (error.response?.status === 401) errorMsg = 'API Key 无效';
    else if (error.response?.status === 404) errorMsg = 'API 地址无效';
    else if (error.response?.status === 429) errorMsg = '请求次数过多';
    else if (error.code === 'ECONNABORTED') errorMsg = '请求超时';
    
    return { success: false, error: errorMsg };
  }
}

/**
 * 流式 LLM 调用（支持 SSE）
 */
export async function callLLMStream(
  systemPrompt: string,
  userMessage: string,
  onChunk: (chunk: string) => void,
  onError: (error: string) => void
): Promise<void> {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    onError('未配置 GLM_API_KEY');
    return;
  }

  try {
    // 先使用普通调用，后续可升级为真正的流式
    const result = await callLLM(systemPrompt, userMessage);
    if (result.success && result.content) {
      // 模拟流式输出
      const words = result.content.split('');
      for (let i = 0; i < words.length; i += 3) {
        onChunk(words.slice(i, i + 3).join(''));
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    } else if (result.error) {
      onError(result.error);
    }
  } catch (error: any) {
    onError(error.message || '流式请求失败');
  }
}
