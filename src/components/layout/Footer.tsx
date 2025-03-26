import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-bold mb-4">바로잇</h3>
            <p className="text-sm text-gray-600 mb-2">
              (주)바로잇 | 대표이사: 홍길동
            </p>
            <p className="text-sm text-gray-600 mb-2">
              사업자등록번호: 123-45-67890
            </p>
            <p className="text-sm text-gray-600 mb-2">
              주소: 서울특별시 강남구 테헤란로 123
            </p>
            <p className="text-sm text-gray-600">
              고객센터: 1234-5678 (평일 09:00 ~ 18:00)
            </p>
          </div>

          {/* 고객 지원 */}
          <div>
            <h3 className="text-lg font-bold mb-4">고객지원</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-600 hover:text-orange-500"
                >
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-orange-500"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-orange-500"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-orange-500"
                >
                  고객센터
                </Link>
              </li>
            </ul>
          </div>

          {/* 소셜 미디어 */}
          <div>
            <h3 className="text-lg font-bold mb-4">소셜 미디어</h3>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com"
                className="text-gray-600 hover:text-orange-500"
              >
                인스타그램
              </Link>
              <Link
                href="https://facebook.com"
                className="text-gray-600 hover:text-orange-500"
              >
                페이스북
              </Link>
              <Link
                href="https://blog.naver.com"
                className="text-gray-600 hover:text-orange-500"
              >
                블로그
              </Link>
            </div>
          </div>
        </div>

        {/* 저작권 정보 */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 바로잇. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
