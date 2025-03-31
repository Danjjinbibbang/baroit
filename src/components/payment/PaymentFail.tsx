"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentFail() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "에러 메시지가 없습니다.";
  const code = searchParams.get("code") || "에러 코드 없음";

  return (
    <div
      id="info"
      className="box_section"
      style={{ width: "600px", margin: "auto", padding: "2rem" }}
    >
      <Image
        width={100}
        height={100}
        src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
        alt="에러 이미지"
      />
      <h2 style={{ marginTop: "1rem" }}>결제를 실패했어요</h2>

      <div style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <b>에러메시지</b>
          <span>{message}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}
        >
          <b>에러코드</b>
          <span>{code}</span>
        </div>
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link
          href="https://docs.tosspayments.com/guides/v2/payment-widget/integration"
          target="_blank"
        >
          <button className="button">연동 문서</button>
        </Link>
        <Link href="https://discord.gg/A4fRFXQhRu" target="_blank">
          <button
            className="button"
            style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
          >
            실시간 문의
          </button>
        </Link>
      </div>
    </div>
  );
}
