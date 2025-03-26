"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NaverAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("네이버 인증 처리 중...");

  useEffect(() => {
    // URL에서 인증 코드와 상태 값 추출
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // 세션에 저장된 상태 값 가져오기
    const storedState = sessionStorage.getItem("naverLoginState");

    // CSRF 공격 방지를 위한 상태 값 검증
    if (!code || !state || state !== storedState) {
      setStatusMessage("인증 실패: 유효하지 않은 요청입니다");
      // 일정 시간 후 로그인 페이지로 리다이렉트
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // 인증 코드 및 상태 값이 유효하면 토큰 요청
    getNaverToken(code, state);

    // 사용 후 세션에서 상태 값 제거
    sessionStorage.removeItem("naverLoginState");
  }, [searchParams, router]);

  // 네이버 액세스 토큰 요청 함수
  const getNaverToken = async (code: string, state: string) => {
    setStatusMessage("액세스 토큰 요청 중...");

    try {
      // 서버 API를 통해 토큰 요청
      const response = await fetch("/api/auth/naver/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "토큰 요청 실패");
      }

      const data = await response.json();

      // 성공적인 응답 처리
      console.log("네이버 로그인 성공:", data.user);
      setStatusMessage("로그인 성공! 리다이렉트 중...");

      // 로그인 성공 후 메인 페이지로 리다이렉트
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      console.error("네이버 로그인 처리 중 오류 발생:", error);
      setStatusMessage("로그인 처리 중 오류가 발생했습니다");

      // 오류 발생 시 로그인 페이지로 리다이렉트
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">네이버 로그인</h1>
        <div className="animate-pulse">
          <p className="text-gray-600 mb-2">{statusMessage}</p>
          <div className="w-8 h-8 border-4 border-t-green-500 border-b-green-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mt-4"></div>
        </div>
      </div>
    </div>
  );
}
