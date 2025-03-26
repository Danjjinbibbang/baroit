"use client";

import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import "../../styles/payment.css"; // 기존 App.css에서 옮긴 파일

const clientKey = "test_ck_0RnYX2w532EOoMKvMyAR8NeyqApQ";
const customerKey = "qMeoiFz0puFKj5lrGh35l"; // 실제 서비스에선 유저 ID로 동적으로 생성

export default function CheckoutPage() {
  const [payment, setPayment] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const amount = {
    currency: "KRW",
    value: 50000,
  };

  useEffect(() => {
    async function initPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const paymentInstance = tossPayments.payment({
          customerKey,
        });
        setPayment(paymentInstance);
      } catch (error) {
        console.error("❌ 결제창 로딩 실패:", error);
      }
    }

    initPayment();
  }, [clientKey, customerKey]);

  const orderId = `ORDER_${Date.now()}`; // 주문번호가 겹치지 않게 랜덤 생성

  const requestPayment = async () => {
    if (!payment) return;

    try {
      await payment.requestPayment({
        method: "CARD",
        amount,
        orderId: orderId, // 실제 서비스에서는 서버에서 생성
        orderName: "토스 티셔츠 외 2건",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
        customerMobilePhone: "01012341234",
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error) {
      console.error("❌ 결제 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button className="button" onClick={requestPayment}>
        결제하기
      </button>
    </div>
  );
}
