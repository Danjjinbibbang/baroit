"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Search, Menu, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressSearch, AddressData } from "@/components/address/AddressSearch";
import { CurrentLocation } from "../address/CurrentLocation";
import AddressListModal from "../address/AddressListModal";

export default function Header() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("서울시 강남구");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const handleAddressSelect = (address: AddressData) => {
    setCurrentAddress(address.roadAddress || address.jibunAddress);
    //setIsAddressModalOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색어:", searchQuery);
    // 검색 로직 구현
  };

  // const handleLocationDetected = async (location: {
  //   lat: number;
  //   lng: number;
  // }) => {
  //   console.log("현재 위치:", location);
  //   setIsLoadingAddress(true);
  //   setAddressError(null);

  //   try {
  //     // API 경로를 사용하여 주소 변환 요청
  //     const response = await fetch(
  //       `/api/address/reverse-geocode?lat=${location.lat}&lng=${location.lng}`
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "주소를 가져오는데 실패했습니다.");
  //     }

  //     const data = await response.json();
  //     console.log("주소 데이터:", data);

  //     // 카카오 API 응답 구조에 맞게 주소 추출
  //     if (data.documents && data.documents.length > 0) {
  //       const addressInfo = data.documents[0];

  //       let formattedAddress = "";

  //       // 도로명 주소가 있는 경우 우선 사용
  //       if (addressInfo.road_address) {
  //         formattedAddress = `${addressInfo.road_address.address_name}`;
  //       }
  //       // 도로명 주소가 없으면 지번 주소 사용
  //       else if (addressInfo.address) {
  //         formattedAddress = `${addressInfo.address.address_name}`;
  //       }

  //       if (formattedAddress) {
  //         setCurrentAddress(formattedAddress);
  //         //setIsAddressModalOpen(false);
  //       } else {
  //         setAddressError("주소를 찾을 수 없습니다.");
  //       }
  //     } else {
  //       setAddressError("주소를 찾을 수 없습니다.");
  //     }
  //   } catch (error) {
  //     console.error("주소 변환 오류:", error);
  //     setAddressError("주소를 가져오는데 실패했습니다.");
  //   } finally {
  //     setIsLoadingAddress(false);
  //   }
  // };

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
            <span className="text-xl font-bold text-blue-500">바로잇</span>
          </Link>

          {/* 현재 위치 */}
          <button
            className="flex items-center text-sm ml-4 hover:text-blue-500"
            onClick={handleAddressClick}
          >
            <MapPin size={16} className="mr-1" />
            <span className="truncate max-w-[150px]">{currentAddress}</span>
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
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </div>
        </div>

        {/* 카테고리 네비게이션
        <nav className="flex items-center py-2 overflow-x-auto scrollbar-hide">
          <Button variant="ghost" className="whitespace-nowrap">
            <Menu size={16} className="mr-2" />
            전체 카테고리
          </Button>
          <div className="flex space-x-4 ml-4">
            {["신상품", "베스트", "특가/혜택", "추천식단", "간편식"].map(
              (category) => (
                <Link
                  key={category}
                  href={`/category/${category}`}
                  className="whitespace-nowrap text-sm hover:text-orange-500"
                >
                  {category}
                </Link>
              )
            )}
          </div>
        </nav> */}
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
