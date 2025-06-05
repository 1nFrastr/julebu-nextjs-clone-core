import type { ClientOptions } from "openai";

import OpenAI from "openai";

export type GenerateWordListResponse = {
  words: Array<{
    english: string;
    chinese: string;
    soundmark: string;
  }>;
};

// 自定义配置初始化
const config: ClientOptions = {
  apiKey: "b53fc557-8a3b-4db6-a4e6-91fb9a8066ae",
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
  timeout: 30000, // 30秒超时
  maxRetries: 3, // 最大重试次数
  dangerouslyAllowBrowser: true, // 允许在浏览器环境中使用
};

const openaiClient = new OpenAI(config);

const WORD_LIST_PROMPT = `
作为一个英语教育专家，请根据用户给定的主题生成一个相关的英语单词列表。

要求:
1. 单词要与主题高度相关
2. 单词难度要适中，避免过于生僻的词
3. 中文释义要准确且符合主题场景
4. 音标必须准确规范，且必须使用引号包裹

输出格式要求(JSON):
{
  "words": [
    {
      "english": "coffee",
      "chinese": "咖啡",
      "soundmark": "/ˈkɒfi/"
    }
  ]
}

主题场景示例：
- 如果是"打车"主题，应该包含: taxi (/ˈtæksi/), driver (/ˈdraɪvə/), destination (/ˌdestɪˈneɪʃn/) 等相关词汇
- 如果是"酒店"主题，应该包含: check-in (/tʃek ɪn/), reservation (/ˌrezəˈveɪʃn/), suite (/swiːt/) 等相关词汇  
- 如果是"托福/雅思"主题，应该包含常见的学术类词汇

请根据以下信息生成单词列表:
主题: {{topic}}
所需单词数量: {{count}}

注意:
- 确保输出为有效的 JSON 格式
- 所有单词必须与主题相关
- 不要重复单词
- 音标必须用引号包裹（如 "/ˈkɒfi/"），否则会导致 JSON 解析错误
- 中文释义要简洁明了
`;

export async function generateWordList(
  topic: string,
  count: number,
): Promise<GenerateWordListResponse> {
  const prompt = WORD_LIST_PROMPT.replace("{{topic}}", topic).replace("{{count}}", String(count));

  try {
    const completion = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "doubao-lite-4k-character-240828",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("未获得 AI 响应");
    }

    try {
      const parsedResponse = JSON.parse(response) as GenerateWordListResponse;
      if (!parsedResponse.words || !Array.isArray(parsedResponse.words)) {
        throw new Error("AI 响应格式错误");
      }

      // 验证每个单词的格式
      parsedResponse.words.forEach((word, index) => {
        if (!word.english || !word.chinese || !word.soundmark) {
          throw new Error(`第 ${index + 1} 个单词数据格式不完整`);
        }
      });

      return parsedResponse;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`解析 AI 响应失败: ${e.message}`);
      }
      throw new Error("AI 返回的数据格式无效");
    }
  } catch (error) {
    if (error instanceof Error) {
      // API 调用错误处理
      if (error.message.includes("429")) {
        throw new Error("API 调用次数超限");
      }
      if (error.message.includes("401")) {
        throw new Error("API 密钥无效");
      }
      if (error.message.includes("timeout")) {
        throw new Error("请求超时，请重试");
      }
      throw new Error(`生成词库失败: ${error.message}`);
    }
    throw new Error("生成词库时发生未知错误");
  }
}
