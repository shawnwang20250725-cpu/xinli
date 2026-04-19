import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `你是一位温和、稳定、善于倾听的心理陪伴助手。

你的职责是：
- 接住用户的情绪
- 帮助用户表达和梳理感受
- 在合适的时候提出轻柔的问题
- 在用户需要时提供温和、具体、可执行的小建议

你的定位不是精神科医生，也不是医疗诊断工具。
你不能做疾病诊断、药物建议、治疗承诺，也不要使用绝对化表达。

对话原则：
1. 先共情，后分析
2. 先理解，后建议
3. 用户想倾诉时，优先陪伴，不急着解决问题
4. 用户想找办法时，再提供简短、具体、可执行的建议
5. 每次只推进一小步，不一次问很多问题
6. 回复自然、温柔、简洁，不说教，不评判，不空泛

表达风格：
- 中文回答
- 像一个成熟、可靠、耐心的人在陪用户说话
- 避免模板化重复
- 避免频繁重复"我理解你"
- 避免生硬使用专业术语

安全规则：
- 如果用户提到自杀、自伤、伤害他人、极端绝望、活不下去等高风险内容，立即切换到安全响应
- 安全响应应包含：
  1. 表达真实关切
  2. 鼓励用户立即联系当地紧急援助、心理危机热线、家人朋友或专业人士
  3. 鼓励用户不要独自承受，优先寻求现实支持
  4. 不继续普通安慰式闲聊

每次回复优先顺序：
1. 简短回应用户情绪
2. 用一句话概括对方核心困扰
3. 视情况提出一个温和的问题
4. 如有必要，给一个小建议`;

// ─── 从 env 读取配置（全部可在 .env.local 中覆盖）──────────
const getConfig = () => ({
  apiKey:  process.env.ARK_API_KEY ?? "",
  baseUrl: (process.env.ARK_BASE_URL ?? "https://ark.cn-beijing.volces.com/api/v3").replace(/\/$/, ""),
  model:   process.env.ARK_MODEL   ?? "doubao-seed-2-0-pro-260215",
});

type ChatMsg = { role: "user" | "assistant"; content: string };

// ─── 从 Chat Completions SSE 块中提取文本 ────────────────────
// 兼容 string 和数组两种 content 格式，过滤 reasoning_content（思考过程）
function extractChatDelta(parsed: Record<string, unknown>): string {
  const choices = parsed?.choices as Array<{ delta?: Record<string, unknown> }> | undefined;
  const d = choices?.[0]?.delta;
  if (!d) return "";
  // reasoning_content 是思考过程，不展示给用户
  if (typeof d.content === "string") return d.content;
  if (Array.isArray(d.content)) {
    return (d.content as Array<{ type?: string; text?: string }>)
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("");
  }
  return "";
}

// ─── 将上游 SSE 流标准化后透传给前端 ─────────────────────────
function transformStream(
  upstream: ReadableStream<Uint8Array>,
  extractor: (parsed: Record<string, unknown>) => string
): ReadableStream<Uint8Array> {
  const reader  = upstream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const raw = trimmed.slice(5).trim();
          if (raw === "[DONE]") {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            return;
          }
          try {
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            const text = extractor(parsed);
            if (!text) continue;

            // 统一输出格式（前端 SSE 解析器无需改动）
            const out = JSON.stringify({ choices: [{ delta: { content: text } }] });
            controller.enqueue(encoder.encode(`data: ${out}\n\n`));
          } catch { /* 忽略非 JSON 行 */ }
        }
      }
    },
    cancel() { reader.cancel(); },
  });
}

// ─── Route Handler ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as { messages: ChatMsg[] };

  const { apiKey, baseUrl, model } = getConfig();

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "未配置 ARK_API_KEY，请在 .env.local 中添加" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  // 统一使用 Chat Completions API（/chat/completions）
  // doubao-seed 同样支持此端点，且格式更简单稳定
  const endpoint = `${baseUrl}/chat/completions`;

  const body = {
    model,
    stream: true,
    max_tokens: 1024,
    temperature: 0.85,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
  };

  console.log(`[API] Chat → ${endpoint} (model: ${model})`);

  let upstream: Response;
  try {
    upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[API] 连接失败:", err);
    return new Response(
      JSON.stringify({ error: `连接 API 失败: ${err}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    console.error(`[API] 上游错误 ${upstream.status}:`, text);
    return new Response(
      JSON.stringify({ error: `API 错误 ${upstream.status}: ${text}` }),
      { status: upstream.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(transformStream(upstream.body, extractChatDelta), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
