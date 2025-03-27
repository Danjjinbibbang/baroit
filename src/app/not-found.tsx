import Link from "next/link";

// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="text-center py-20 flex flex-col items-center justify-center w-full min-h-screen">
      <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다.</h1>
      <p>요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.</p>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
