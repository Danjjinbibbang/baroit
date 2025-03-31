"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    async function confirm() {
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const paymentKey = searchParams.get("paymentKey");

      if (!orderId || !amount || !paymentKey) {
        router.push("/payment/fail?code=MISSING_PARAMS&message=필수 정보 누락");
        return;
      }

      try {
        const response = await fetch("/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, amount, paymentKey }),
        });

        const json = await response.json();

        if (!response.ok) {
          throw { code: json.code, message: json.message };
        }

        setResponseData(json);
      } catch (error: any) {
        router.push(
          `/payment/fail?code=${error.code}&message=${encodeURIComponent(
            error.message
          )}`
        );
      }
    }

    confirm();
  }, [searchParams, router]);

  const amount = Number(searchParams.get("amount") || 0).toLocaleString();
  const orderId = searchParams.get("orderId") || "";
  const paymentKey = searchParams.get("paymentKey") || "";

  return (
    <>
      <div
        className="box_section"
        style={{ width: "600px", margin: "0 auto", padding: "2rem" }}
      >
        <img
          width="100"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="결제 완료"
        />
        <h2 style={{ marginTop: "1rem" }}>결제를 완료했어요</h2>

        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {amount}원
          </div>
        </div>

        {/* 나머지 UI 구성요소들 */}

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {orderId}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div
            className="p-grid-col text--right"
            id="paymentKey"
            style={{ whiteSpace: "initial", width: "250px" }}
          >
            {paymentKey}
          </div>
        </div>

        <div
          className="p-grid-col"
          style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}
        >
          <Link
            href="https://docs.tosspayments.com/guides/v2/payment-widget/integration"
            target="_blank"
          >
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link href="https://discord.gg/A4fRFXQhRu" target="_blank">
            <button
              className="button p-grid-col5"
              style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
            >
              실시간 문의
            </button>
          </Link>
        </div>
      </div>

      <div
        className="box_section"
        style={{ width: "600px", textAlign: "left", margin: "0 auto" }}
      >
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
