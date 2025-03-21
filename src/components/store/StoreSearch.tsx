"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface StoreSearchProps {
  storeId: string;
}

export default function StoreSearch({ storeId }: StoreSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("가게 내 검색:", searchQuery, "가게 ID:", storeId);
    // 실제 구현에서는 여기서 검색 로직을 수행합니다.
  };

  return (
    <div className="px-4 py-3 border-b">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder="이 가게 내 메뉴 검색"
            className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </form>
    </div>
  );
}
