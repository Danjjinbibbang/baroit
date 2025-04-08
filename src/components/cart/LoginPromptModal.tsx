"use client";

import Link from "next/link";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({
  isOpen,
  onClose,
}: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-600 mb-6">
          장바구니 기능을 이용하려면 로그인이 필요합니다. 지금
          로그인하시겠습니까?
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/login"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            로그인 하기
          </Link>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
