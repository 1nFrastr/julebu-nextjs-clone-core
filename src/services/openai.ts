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

const WORD_LIST_PROMPT = `生成{{count}}个与"{{topic}}"主题相关的英语单词。

输出格式要求：
每行一个单词，格式为：英文单词|中文含义
示例：
coffee|咖啡
tea|茶

要求：
- 单词要贴合主题且难度适中
- 首字母不需要大写，除非必要
- 中文释义要简洁准确
- 每行必须包含英文、中文，用|分隔
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
      temperature: 0.3, // 降低随机性，提高生成速度
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("未获得 AI 响应");
    }

    try {
      // 将文本格式转换为 JSON 格式
      const words = response.split('\n')
        .filter(line => line.trim()) // 移除空行
        .map(line => {
          const [english, chinese] = line.split('|').map(s => s.trim());
          if (!english || !chinese) {
            throw new Error(`单词数据格式不完整: ${line}`);
          }
          return { english, chinese, soundmark: "" }; // soundmark 目前为空字符串
        });

      if (words.length === 0) {
        throw new Error("未生成任何单词");
      }

      return { words };
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
