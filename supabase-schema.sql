-- ============================================================
-- 心语陪伴 · Supabase Schema: app5
-- 在 Supabase Dashboard → SQL Editor 中运行此文件
-- 运行后还需：Settings → API → Extra API Schemas → 添加 app5
-- ============================================================

-- 1. 创建 schema
CREATE SCHEMA IF NOT EXISTS app5;

-- 2. 聊天会话表（每次打开页面创建一条）
CREATE TABLE IF NOT EXISTS app5.sessions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 聊天消息表
CREATE TABLE IF NOT EXISTS app5.messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID        NOT NULL REFERENCES app5.sessions(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL CHECK (role IN ('user', 'ai')),
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. 情绪记录表（/mood 页面打卡）
CREATE TABLE IF NOT EXISTS app5.mood_records (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id   TEXT        NOT NULL,
  emotion_label  TEXT,
  emotion_level  TEXT,
  emotion_emoji  TEXT,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. 索引
CREATE INDEX IF NOT EXISTS idx_sessions_anon   ON app5.sessions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_messages_sid    ON app5.messages(session_id);
CREATE INDEX IF NOT EXISTS idx_mood_anon       ON app5.mood_records(anonymous_id);

-- 6. 启用行级安全（RLS）
ALTER TABLE app5.sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE app5.messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE app5.mood_records ENABLE ROW LEVEL SECURITY;

-- 7. 授予 anon / authenticated 角色访问 app5 schema 的权限
GRANT USAGE ON SCHEMA app5 TO anon;
GRANT USAGE ON SCHEMA app5 TO authenticated;

GRANT ALL ON ALL TABLES    IN SCHEMA app5 TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA app5 TO anon;
GRANT ALL ON ALL TABLES    IN SCHEMA app5 TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA app5 TO authenticated;

-- 8. 匿名用户 RLS 策略（anon key 可读写，生产环境可按需收紧）
CREATE POLICY "anon_sessions"     ON app5.sessions     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_messages"     ON app5.messages     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_mood_records" ON app5.mood_records FOR ALL TO anon USING (true) WITH CHECK (true);
