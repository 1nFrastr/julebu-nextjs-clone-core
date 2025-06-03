import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { topic, count } = await req.json();

    if (!topic || !count) {
      return NextResponse.json({ error: "主题和数量是必需的" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
作为一个英语教育专家，请根据主题"${topic}"生成${count}个相关的英语单词。
要求:
1. 单词要与主题高度相关
2. 单词难度要适中，避免过于生僻的词
3. 中文释义要准确且符合主题场景
4. 音标必须准确规范

输出格式要求(JSON):
{
  "words": [
    {
      "english": "单词",
      "chinese": "释义",
      "soundmark": "音标"
    }
  ]
}
`,
        },
      ],
      model: "gpt-4",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      return NextResponse.json({ error: "AI 响应为空" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(response));
  } catch (error) {
    console.error("Dictionary generation error:", error);
    return NextResponse.json({ error: "生成词库失败" }, { status: 500 });
  }
}
