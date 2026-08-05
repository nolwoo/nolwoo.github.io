import { SITE } from "./site";

/* 새 상담이 들어오면 사장님께 메일로 알린다.
   - 발송 실패가 접수 실패로 이어지면 안 된다: 호출부에서 await 하되 절대 throw 하지 않는다.
     (상담은 이미 Supabase에 저장된 뒤라, 메일이 안 가도 기록은 남는다)
   - 환경변수가 없으면 조용히 건너뛴다 → 키 없이도 빌드·배포가 깨지지 않음.
   - 나중에 카카오 알림톡을 붙일 때는 이 파일에 함수 하나만 더 추가하면 된다. */

type Inquiry = {
  name: string;
  phone: string;
  product: string | null;
  message: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function notifyNewInquiry(inquiry: Inquiry): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_TO;
  const from = process.env.INQUIRY_NOTIFY_FROM;
  if (!apiKey || !to || !from) return;

  const received = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  const rows: [string, string][] = [
    ["이름", inquiry.name],
    ["연락처", inquiry.phone],
    ["관심 제품", inquiry.product || "—"],
    ["접수 시각", received],
  ];

  const html = `
    <div style="font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#1d1d1f;line-height:1.7">
      <p style="font-size:18px;font-weight:600;margin:0 0 16px">새 상담 신청이 접수되었습니다</p>
      <table style="border-collapse:collapse;font-size:15px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 16px 6px 0;color:#7a7a82;white-space:nowrap">${k}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 6px;color:#7a7a82;font-size:14px">문의 내용</p>
      <div style="white-space:pre-wrap;background:#f5f5f7;border-radius:8px;padding:14px 16px;font-size:15px">${esc(inquiry.message)}</div>
      <p style="margin-top:24px;font-size:14px">
        <a href="tel:${esc(inquiry.phone)}" style="color:#0066cc">${esc(inquiry.phone)}로 전화하기</a>
      </p>
      <p style="margin-top:20px;color:#7a7a82;font-size:13px">
        ${SITE.brand} ${SITE.branch} 홈페이지 상담 신청
      </p>
    </div>`;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: from, name: `${SITE.brand} ${SITE.branch}` },
        to: [{ email: to }],
        // 제목에 이름·연락처를 넣어 메일함 목록에서 바로 보이게
        subject: `[상담] ${inquiry.name} · ${inquiry.phone}`,
        htmlContent: html,
        // 사장님이 메일에서 바로 '답장'을 누르면 손님에게 가지 않도록 지정하지 않는다
      }),
    });

    if (!res.ok) {
      console.error("inquiry notify failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("inquiry notify error:", err);
  }
}
