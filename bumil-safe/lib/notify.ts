import { createHmac, randomBytes } from "crypto";
import { SITE } from "./site";

/* 새 상담이 들어오면 사장님께 알린다.
   - 주 채널은 카카오 알림톡, 실패하거나 미설정이면 이메일로 대신 보낸다.
   - 발송 실패가 접수 실패로 이어지면 안 된다: 호출부에서 await 하되 절대 throw 하지 않는다.
     (상담은 이미 Supabase에 저장된 뒤라, 알림이 안 가도 기록은 남는다)
   - 환경변수가 없으면 조용히 건너뛴다 → 키 없이도 빌드·배포가 깨지지 않음. */

type Inquiry = {
  name: string;
  phone: string;
  product: string | null;
  message: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const receivedAt = () =>
  new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

export async function notifyNewInquiry(inquiry: Inquiry): Promise<void> {
  // 알림톡이 나가면 그걸로 끝. 안 나갔을 때만 메일로 대신 알린다.
  const sent = await sendAlimtalk(inquiry);
  if (!sent) await sendEmail(inquiry);
}

/* ── 카카오 알림톡 (솔라피) ──
   보냈으면 true. 미설정·실패면 false를 돌려 호출부가 메일로 넘어가게 한다. */
async function sendAlimtalk(inquiry: Inquiry): Promise<boolean> {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const pfId = process.env.SOLAPI_PFID;
  const templateId = process.env.SOLAPI_TEMPLATE_ID;
  const to = process.env.INQUIRY_NOTIFY_PHONE;
  const from = process.env.SOLAPI_SENDER_PHONE;
  if (!apiKey || !apiSecret || !pfId || !templateId || !to || !from) return false;

  // 서명: HMAC-SHA256(날짜 + salt)를 API Secret으로 해시
  const date = new Date().toISOString();
  const salt = randomBytes(16).toString("hex");
  const signature = createHmac("sha256", apiSecret).update(date + salt).digest("hex");

  const digits = (s: string) => s.replace(/[^0-9]/g, "");

  try {
    const res = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          to: digits(to),
          from: digits(from),
          kakaoOptions: {
            pfId,
            templateId,
            // 심사 통과한 템플릿의 변수명과 정확히 일치해야 한다
            variables: {
              "#{이름}": inquiry.name,
              "#{연락처}": inquiry.phone,
              "#{관심제품}": inquiry.product || "미기재",
              "#{접수시각}": receivedAt(),
            },
          },
        },
      }),
    });

    if (!res.ok) {
      console.error("alimtalk failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("alimtalk error:", err);
    return false;
  }
}

/* ── 이메일 (Brevo) — 알림톡이 못 나갔을 때의 대비책 ── */
async function sendEmail(inquiry: Inquiry): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_TO;
  const from = process.env.INQUIRY_NOTIFY_FROM;
  if (!apiKey || !to || !from) return;

  const rows: [string, string][] = [
    ["이름", inquiry.name],
    ["연락처", inquiry.phone],
    ["관심 제품", inquiry.product || "—"],
    ["접수 시각", receivedAt()],
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
        
      }),
    });

    if (!res.ok) {
      console.error("email notify failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("email notify error:", err);
  }
}
