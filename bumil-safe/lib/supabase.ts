import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* 서버 전용 Supabase 클라이언트 — service_role 키는 절대 브라우저로 나가면 안 됨.
   환경변수가 없으면 null 반환 → 호출부에서 친절한 안내로 처리(빌드는 깨지지 않음). */
let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return cached;
}

export type Inquiry = {
  id: number;
  name: string;
  phone: string;
  product: string | null;
  message: string;
  status: string;
  created_at: string;
};

export const INQUIRY_TABLE = "inquiries";
