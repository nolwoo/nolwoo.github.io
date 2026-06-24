import { cookies } from "next/headers";
import { Container } from "@/components/Container";
import { AdminLogin } from "@/components/AdminLogin";
import { getSupabase, INQUIRY_TABLE, type Inquiry } from "@/lib/supabase";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "판매자 · 상담 접수" };

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get(ADMIN_COOKIE)?.value === adminToken();

  if (!authed) {
    return (
      <Container className="py-10">
        <AdminLogin />
      </Container>
    );
  }

  const supabase = getSupabase();
  let inquiries: Inquiry[] = [];
  let dbError = "";

  if (!supabase) {
    dbError = "Supabase가 연결되지 않았습니다. .env.local 설정을 확인하세요.";
  } else {
    const { data, error } = await supabase
      .from(INQUIRY_TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) dbError = error.message;
    else inquiries = (data as Inquiry[]) ?? [];
  }

  return (
    <Container className="py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-ink">상담 접수 내역</h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            총 {inquiries.length}건 · 새로고침하면 최신 내역이 보여요.
          </p>
        </div>
        <a
          href="/api/admin-login"
          className="text-[14px] text-ink-faint hover:text-blue"
        >
          로그아웃
        </a>
      </div>

      {dbError && (
        <p className="mt-6 rounded-lg bg-parchment px-4 py-3 text-[14px] text-red-600">
          {dbError}
        </p>
      )}

      {!dbError && inquiries.length === 0 && (
        <p className="mt-10 rounded-lg border border-hairline bg-parchment px-6 py-10 text-center text-[15px] text-ink-muted">
          아직 접수된 상담이 없습니다.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {inquiries.map((q) => (
          <article
            key={q.id}
            className="rounded-lg border border-hairline bg-canvas p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <h3 className="text-[18px] font-semibold text-ink">{q.name}</h3>
                <span className="rounded-pill bg-parchment px-2.5 py-0.5 text-[12px] font-medium text-ink-muted">
                  {q.status}
                </span>
              </div>
              <time className="text-[13px] text-ink-faint">
                {new Date(q.created_at).toLocaleString("ko-KR")}
              </time>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-ink-muted">
              <span>
                연락처{" "}
                <a href={`tel:${q.phone}`} className="font-medium text-blue">
                  {q.phone}
                </a>
              </span>
              {q.product && <span>관심제품 · {q.product}</span>}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
              {q.message}
            </p>
          </article>
        ))}
      </div>
    </Container>
  );
}
