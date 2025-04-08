"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressListModal from "../address/AddressListModal";

export default function Header() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색어:", searchQuery);
    // 검색 로직 구현
  };

  // 주소 아이콘 클릭 핸들러
  const handleAddressClick = () => {
    setIsAddressModalOpen(true);
  };

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
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 주소 검색 모달 */}
      {isAddressModalOpen && (
        <AddressListModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          customerId={1} // 실제 사용자 ID로 변경 필요
        />
      )}
    </div>
  );
}
