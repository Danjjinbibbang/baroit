"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore, checkIsAuthenticated } from "@/zustand/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const { isInitialized } = useAuthStore();

  useEffect(() => {
    // 인증 상태 초기화
    if (!isInitialized) {
      // 세션 쿠키 및 로컬 스토리지 확인으로 인증 상태 초기화
      const authStatus = checkIsAuthenticated();
      console.log("AuthProvider 초기화:", authStatus);
    }

    // 짧은 지연 후 로딩 상태 해제
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [isInitialized]);

  // 로딩 중에는 간단한 로딩 화면 표시
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-lg">로딩 중...</div>
      </div>
    );
  }

  return <>{children}</>;
}
