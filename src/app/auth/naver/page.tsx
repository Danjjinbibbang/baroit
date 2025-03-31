import { Suspense } from "react";
import NaverCallback from "@/components/auth/NaverCallback";

export default function NaverAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">네이버 로그인</h1>
            <div className="animate-pulse">
              <p className="text-gray-600 mb-2">네이버 인증 처리 중...</p>
              <div className="w-8 h-8 border-4 border-t-green-500 border-b-green-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mt-4"></div>
            </div>
          </div>
        </div>
      }
    >
      <NaverCallback />
    </Suspense>
  );
}
