"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressListModal from "../address/AddressListModal";
import { useAuthStore, checkIsAuthenticated } from "@/zustand/auth";

export default function Header() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { requireAuth, user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    // 세션/쿠키 기반 인증 상태 확인
    const authStatus = checkIsAuthenticated();
    console.log("인증 상태 확인:", authStatus, user);
    setIsLoading(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색어:", searchQuery);
    // 검색 로직 구현
  };

  // 주소 아이콘 클릭 핸들러
  const handleAddressClick = () => {
    console.log("주소 아이콘 클릭, 인증 상태:", isAuthenticated);

    // 로컬에 저장된 인증 상태와 세션 쿠키 모두 확인
    const authStatus = checkIsAuthenticated();
    console.log("세션 쿠키 확인 결과:", authStatus);

    // 로그인이 필요한 기능으로 처리
    requireAuth(() => {
      setIsAddressModalOpen(true);
    });
  };

  // 프로필 페이지 이동 핸들러
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      window.location.href = "/profile";
    });
  };

  // 로딩 중일 때는 기본 레이아웃 표시
  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl px-4">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center">
              <img className="w-30" src="/baroit.png" />
            </Link>
            <div>로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl px-4">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between py-3">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <img className="w-30" src="/baroit.png" />
          </Link>

          {/* 현재 위치 */}
          <button
            className="flex items-center text-sm ml-4 hover:text-blue-500"
            onClick={handleAddressClick}
          >
            <MapPin size={16} className="mr-1" />
            <span className="truncate max-w-[150px]">{
              /*currentAddress*/ `서울시 강남구`
            }</span>
          </button>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="상품을 검색해보세요"
                className="w-full py-2 pl-4 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingBag size={20} />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User size={20} />
              {isAuthenticated && (
                <span className="ml-1 text-xs bg-green-500 w-2 h-2 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 주소 검색 모달 */}
      {isAddressModalOpen && (
        <AddressListModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          customerId={user?.id ? parseInt(user.id) : 0} // 실제 사용자 ID 활용
        />
      )}
    </div>
  );
}
