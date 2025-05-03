"use client";

import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useSearchParams } from "next/navigation";
import "../../styles/payment.css"; // 기존 App.css에서 옮긴 파일

const clientKey = "test_ck_0RnYX2w532EOoMKvMyAR8NeyqApQ";
const customerKey = "qMeoiFz0puFKj5lrGh35l"; // 실제 서비스에선 유저 ID로 동적으로 생성

// 타입 정의
interface PaymentAmount {
  currency: string;
  value: number;
}

interface PaymentRequest {
  method: string;
  amount: PaymentAmount;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail: string;
  customerName: string;
  customerMobilePhone: string;
  card: {
    useEscrow: boolean;
    flowMode: string;
    useCardPoint: boolean;
    useAppCardOnly: boolean;
  };
}

export default function CheckoutPage() {
  const [payment, setPayment] = useState<any>(null);
  const searchParams = useSearchParams();

  // URL 파라미터에서 값 가져오기 또는 기본값 사용
  const totalAmount = Number(searchParams.get("amount")) || 50000;
  const orderName = searchParams.get("orderName") || "토스 티셔츠 외 2건";

  // 결제 정보 상태
  const [paymentInfo, setPaymentInfo] = useState<PaymentRequest>({
    method: "CARD",
    amount: {
      currency: "KRW",
      value: totalAmount,
    },
    orderId: `ORDER_${Date.now()}`, // 주문번호가 겹치지 않게 랜덤 생성
    orderName: orderName,
    successUrl: `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/payment/success`,
    failUrl: `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/payment/fail`,
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
  }, []);

  // 결제 방법 선택 핸들러
  const handlePaymentMethodChange = (method: string) => {
    setPaymentInfo((prev) => ({
      ...prev,
      method,
    }));
  };

  // 결제 요청 함수
  const requestPayment = async () => {
    if (!payment) return;

    try {
      // 주문번호 업데이트 (매번 새로운 주문번호 생성)
      const updatedPaymentInfo = {
        ...paymentInfo,
        orderId: `ORDER_${Date.now()}`,
      };

      await payment.requestPayment(updatedPaymentInfo);
    } catch (error) {
      console.error("❌ 결제 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">주문/결제</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
        <div className="mb-4">
          <p className="text-gray-600">주문명: {paymentInfo.orderName}</p>
          <p className="text-gray-600">
            총 결제 금액: {paymentInfo.amount.value.toLocaleString()}원
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">결제 수단 선택</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            className={`p-3 border rounded-md ${
              paymentInfo.method === "CARD"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => handlePaymentMethodChange("CARD")}
          >
            카드 결제
          </button>
          {/* <button
            className={`p-3 border rounded-md ${
              paymentInfo.method === "VIRTUAL_ACCOUNT"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => handlePaymentMethodChange("VIRTUAL_ACCOUNT")}
          >
            가상계좌
          </button> */}
        </div>
      </div>

      <button
        className="w-full py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        onClick={requestPayment}
      >
        {paymentInfo.amount.value.toLocaleString()}원 결제하기
      </button>
    </div>
  );
}
