import type { ClientOptions } from "openai";

import OpenAI from "openai";

// 统一使用的模型名称
const MODEL_NAME = "doubao-lite-4k-character-240828";

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
- 必须严格生成{{count}}个单词，不能多也不能少
- 单词要贴合主题且难度适中
- 首字母不需要大写，除非必要
- 中文释义要简洁准确
- 每行必须包含英文、中文，用|分隔
- 请确保没有重复的单词
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
      model: MODEL_NAME,
      temperature: 0.3, // 降低随机性，提高生成速度
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("未获得 AI 响应");
    }

    try {
      // 将文本格式转换为 JSON 格式
      let words = response.split('\n')
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

      // 如果生成的单词数量超过要求，随机选择指定数量的单词
      if (words.length > count) {
        words = words
          .sort(() => Math.random() - 0.5) // 随机打乱顺序
          .slice(0, count); // 截取需要的数量
      } 
      // 如果生成的单词数量不足，抛出错误
      else if (words.length < count) {
        throw new Error(`生成的单词数量不足，需要 ${count} 个，但只生成了 ${words.length} 个`);
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

const SUGGEST_TOPICS_PROMPT = `请生成多个新颖且多样化的日常生活场景建议。每次生成的场景要尽量不同，覆盖不同的生活领域。

输出格式要求：
所有场景用竖线(|)分隔，输出为单行文本
示例：餐厅点餐|机场值机|酒店入住

要求：
- 生成8-12个场景
- 每次生成要有新意，避免总是相似的场景
- 可以包含传统场景和新兴场景的组合
- 考虑当代生活中的各种情境（如远程工作、社交媒体、在线购物等）
- 每个场景名称控制在10个中文之内
- 每个场景名称不要出现"英语"或"对话"等字样
- 严格按照竖线分隔符格式输出

当前时间: ${new Date().toISOString()}
提示：利用时间信息随机选择不同的场景组合`;

export async function generateSuggestedTopics(): Promise<string[]> {
  try {
    const completion = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: SUGGEST_TOPICS_PROMPT,
        },
      ],
      model: MODEL_NAME,
      temperature: 0.95, // 提高随机性
      presence_penalty: 0.6, // 降低重复内容的可能性
      frequency_penalty: 0.8, // 鼓励使用更多样的词汇
    });

    const content = completion.choices[0]?.message?.content || "";
    return content.split("|").map(topic => topic.trim()).filter(topic => topic.length > 0);
  } catch (error) {
    console.error("生成推荐场景失败:", error);
    // 返回默认场景列表
    return ["面试英语对话", "餐厅点餐", "机场值机", "酒店入住", "购物交流"];
  }
}
