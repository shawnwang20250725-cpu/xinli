import { supabase } from "./supabase";

const ANON_ID_KEY = "xinyu_anon_id";
const SESSION_ID_KEY = "xinyu_session_id";

/** 获取或生成匿名用户 ID（存于 localStorage，跨会话持久） */
export const getAnonymousId = (): string => {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
};

/** 获取或创建当前对话 session（存于 sessionStorage，刷新页面开新会话） */
export const getOrCreateSession = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  const cached = sessionStorage.getItem(SESSION_ID_KEY);
  if (cached) return cached;

  const anonymousId = getAnonymousId();
  const { data, error } = await supabase
    .from("sessions")
    .insert({ anonymous_id: anonymousId })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[Supabase] 创建 session 失败:", error?.message);
    return null;
  }

  sessionStorage.setItem(SESSION_ID_KEY, data.id);
  return data.id;
};

/** 持久化单条消息 */
export const saveMessage = async (
  sessionId: string,
  role: "user" | "ai",
  content: string
): Promise<void> => {
  const { error } = await supabase
    .from("messages")
    .insert({ session_id: sessionId, role, content });

  if (error) {
    console.error("[Supabase] 保存消息失败:", error.message);
  }
};
