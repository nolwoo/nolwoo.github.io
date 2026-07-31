"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "접수에 실패했습니다.");
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "접수에 실패했습니다.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-hairline bg-canvas p-8 text-center">
        <p className="text-[40px]">✅</p>
        <h3 className="mt-3 text-[21px] font-semibold text-ink">
          상담 신청이 접수되었어요
        </h3>
        <p className="mt-2 text-[15px] text-ink-muted">
          확인 후 빠르게 연락드리겠습니다. 급하시면 전화로도 문의해 주세요.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-[15px] font-medium text-blue hover:underline"
        >
          새 상담 신청하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-hairline bg-canvas p-8"
    >
      <h3 className="text-[22px] font-semibold text-ink">온라인 상담 신청</h3>
      <p className="mt-2 text-[14px] text-ink-muted">
        남겨주시면 확인 후 연락드려요. (실시간 답변은 아니에요)
      </p>

      {/* 허니팟 — 사람 눈엔 안 보이고, 봇이 채우면 차단됨 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-6 space-y-4">
        <Field label="이름" name="name" placeholder="성함을 입력해 주세요" required />
        <Field
          label="연락처"
          name="phone"
          type="tel"
          placeholder="010-0000-0000"
          required
        />
        <Field
          label="관심 제품 (선택)"
          name="product"
          placeholder="예: 가정용 디자인금고, OARCFX 등"
        />
        <label className="block">
          <span className="text-[14px] font-medium text-ink">문의 내용</span>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="설치 장소·보관할 물건·예산 등을 알려주시면 더 정확히 추천해 드려요."
            className="mt-1.5 w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-[15px] text-ink outline-none focus:border-blue-focus"
          />
        </label>
      </div>

      {status === "error" && (
        <p className="mt-4 text-[14px] text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-pill bg-ink px-7 py-3.5 text-[16px] font-medium text-white transition-transform active:scale-95 hover:bg-black disabled:opacity-60"
      >
        {status === "sending" ? "접수 중…" : "상담 신청하기"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[14px] font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-hairline bg-canvas px-4 py-3 text-[15px] text-ink outline-none focus:border-blue-focus"
      />
    </label>
  );
}
