"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "로그인 실패");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "로그인 실패");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-20 max-w-[360px] rounded-lg border border-hairline bg-canvas p-8 text-center"
    >
      <p className="text-[40px]">🔒</p>
      <h1 className="mt-3 text-[22px] font-semibold text-ink">판매자 전용</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        상담 접수 내역을 보려면 비밀번호를 입력하세요.
      </p>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="비밀번호"
        className="mt-6 w-full rounded-md border border-hairline px-4 py-3 text-[15px] outline-none focus:border-blue"
      />
      {err && <p className="mt-3 text-[14px] text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-pill bg-blue px-7 py-3.5 text-[16px] font-medium text-white active:scale-95 disabled:opacity-60"
      >
        {busy ? "확인 중…" : "들어가기"}
      </button>
    </form>
  );
}
