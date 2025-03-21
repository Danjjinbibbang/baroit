"use client";

import React, { useState } from "react";
import { Share2, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// 임시 가게 데이터
const storeData = {
  1: {
    id: 1,
    name: "명품한우 정육점",
    rating: 5.0,
    reviewCount: 17,
    deliveryTime: "24~39분",
    minOrderPrice: 20000,
    deliveryFee: 3000,
    image: "/stores/store1.jpg",
    description: "신선하고 품질 좋은 한우를 판매하는 정육점입니다.",
    operatingHours: "매일 10:00 - 22:00 (명절 당일 휴무)",
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
  },
  2: {
    id: 2,
    name: "꽃마니 M 꽃집",
    rating: 5.0,
    reviewCount: 2,
    deliveryTime: "30~45분",
    minOrderPrice: 90000,
    deliveryFee: 0,
    image: "/stores/store2.jpg",
    description: "아름다운 꽃다발과 화분을 판매하는 꽃집입니다.",
    operatingHours: "매일 09:00 - 20:00 (일요일 휴무)",
    address: "서울시 강남구 역삼로 456",
    phone: "02-2345-6789",
  },
  3: {
    id: 3,
    name: "다정한꽃다발_꽃_1일",
    rating: 5.0,
    reviewCount: 1,
    deliveryTime: "25~40분",
    minOrderPrice: 150000,
    deliveryFee: 0,
    image: "/stores/store3.jpg",
    description: "특별한 날을 위한 프리미엄 꽃다발 전문점입니다.",
    operatingHours: "매일 10:00 - 21:00",
    address: "서울시 강남구 선릉로 789",
    phone: "02-3456-7890",
  },
  4: {
    id: 4,
    name: "꽃다발 S",
    rating: 4.8,
    reviewCount: 16,
    deliveryTime: "20~35분",
    minOrderPrice: 38000,
    deliveryFee: 2500,
    image: "/stores/store4.jpg",
    description: "합리적인 가격의 꽃다발을 제공합니다.",
    operatingHours: "매일 09:00 - 19:00 (공휴일 휴무)",
    address: "서울시 강남구 논현로 321",
    phone: "02-4567-8901",
  },
  5: {
    id: 5,
    name: "꽃바구니 L",
    rating: 5.0,
    reviewCount: 2,
    deliveryTime: "30~50분",
    minOrderPrice: 125000,
    deliveryFee: 0,
    image: "/stores/store5.jpg",
    description: "특별한 날을 위한 고급 꽃바구니 전문점입니다.",
    operatingHours: "매일 10:00 - 20:00",
    address: "서울시 강남구 삼성로 654",
    phone: "02-5678-9012",
  },
};

interface StoreHeaderProps {
  storeId: string;
}

export default function StoreHeader({ storeId }: StoreHeaderProps) {
  const [activeTab, setActiveTab] = useState<"info" | "hours">("info");

  // 실제 구현에서는 storeId를 사용하여 가게 정보를 가져옵니다.
  const store =
    storeData[Number(storeId) as keyof typeof storeData] || storeData[1];

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: store.name,
          text: `${store.name} - ${store.description}`,
          url: window.location.href,
        })
        .catch((error) => console.log("공유 실패:", error));
    } else {
      // 공유 API를 지원하지 않는 브라우저의 경우
      alert("현재 브라우저에서는 공유 기능을 지원하지 않습니다.");
    }
  };

  return (
    <div className="w-full">
      {/* 가게 이미지 배너 */}
      <div className="w-full h-48 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          가게 배너 이미지
        </div>
      </div>

      {/* 가게 정보 */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{store.name}</h1>
            <div className="flex items-center mt-2">
              <span className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 font-medium">{store.rating}</span>
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-gray-600">
                리뷰 {store.reviewCount}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">🕒</span>
                <span>배민배달 {store.deliveryTime}</span>
              </div>
              <div className="flex items-center mt-1">
                <span>최소주문금액 {formatPrice(store.minOrderPrice)}원</span>
                <span className="mx-2 text-gray-300">|</span>
                <span>배달팁 {formatPrice(store.deliveryFee)}원</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} className="mr-1" />
            공유
          </Button>
        </div>

        {/* 탭 메뉴 */}
        <div className="mt-6 border-b">
          <div className="flex">
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "info"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("info")}
            >
              <Info size={16} className="inline mr-1" />
              가게정보
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "hours"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("hours")}
            >
              <Clock size={16} className="inline mr-1" />
              운영시간
            </button>
          </div>
        </div>

        {/* 탭 내용 */}
        <div className="py-4">
          {activeTab === "info" && (
            <div className="space-y-3 text-sm">
              <p>{store.description}</p>
              <p>
                <span className="font-medium">주소:</span> {store.address}
              </p>
              <p>
                <span className="font-medium">전화번호:</span> {store.phone}
              </p>
            </div>
          )}
          {activeTab === "hours" && (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">영업시간:</span>{" "}
                {store.operatingHours}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
