"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("카카오 인증 처리 중...");

  useEffect(() => {
    // URL에서 인증 코드 추출
    const code = searchParams.get("code");

    if (!code) {
      setStatusMessage("인증 코드가 없습니다");
      // 일정 시간 후 로그인 페이지로 리다이렉트
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // 코드가 있으면 액세스 토큰 요청 함수 호출
    getKakaoToken(code);
  }, [searchParams, router]);

  // 카카오 액세스 토큰 요청 함수
  const getKakaoToken = async (code: string) => {
    setStatusMessage("액세스 토큰 요청 중...");

    try {
      // 서버 API를 통해 토큰 요청
      const response = await fetch("/api/auth/kakao/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "토큰 요청 실패");
      }

      const data = await response.json();

      // 성공적인 응답 처리
      console.log("카카오 로그인 성공:", data.user);
      setStatusMessage("로그인 성공! 리다이렉트 중...");

      // 사용자 정보를 세션에 저장하는 로직은 서버에서 처리

      // 로그인 성공 후 메인 페이지로 리다이렉트
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      console.error("카카오 로그인 처리 중 오류 발생:", error);
      setStatusMessage("로그인 처리 중 오류가 발생했습니다");

      // 오류 발생 시 로그인 페이지로 리다이렉트
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">카카오 로그인</h1>
        <div className="animate-pulse">
          <p className="text-gray-600 mb-2">{statusMessage}</p>
          <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    </div>
  );
}
