"use client";

import React from "react";
import Link from "next/link";

// 임시 가게 데이터
const stores = [
  {
    id: 1,
    name: "오로르플라워",
    description: "내일배송 4.9~6.4일",
    minOrderPrice: 100000,
    rating: 5.0,
    reviewCount: 3,
    image: "/stores/store1.jpg",
    discount: 0,
  },
  {
    id: 2,
    name: "꽃마니 M 꽃집이름이 사실은 길어요",
    description: "내일배송 4.9~6.4일",
    minOrderPrice: 90000,
    rating: 5.0,
    reviewCount: 2,
    image: "/stores/store2.jpg",
    discount: 0,
  },
  {
    id: 3,
    name: "다정한꽃다발_꽃_1일",
    description: "어버이날 선물 추천",
    minOrderPrice: 150000,
    rating: 5.0,
    reviewCount: 1,
    image: "/stores/store3.jpg",
    discount: 6,
  },
  {
    id: 4,
    name: "꽃다발 S",
    description: "",
    minOrderPrice: 38000,
    rating: 4.8,
    reviewCount: 16,
    image: "/stores/store4.jpg",
    discount: 5,
  },
  {
    id: 5,
    name: "꽃바구니 L 꽃집이름이 사실은 길어요",
    description: "어버이날 선물 추천",
    minOrderPrice: 125000,
    rating: 5.0,
    reviewCount: 2,
    image: "/stores/store5.jpg",
    discount: 3,
  },
];

export default function StoreSection() {
  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">오로르플라워</h2>
        <Link
          href="/store/1"
          className="text-sm text-gray-500 hover:text-orange-500"
        >
          더 보기 &gt;
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stores.map((store) => (
          <Link key={store.id} href={`/store/${store.id}`} className="group">
            <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative mb-2">
              {/* 실제 이미지가 없으므로 임시 박스로 대체 */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">가게 이미지</span>
              </div>

              {store.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {store.discount}%
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-sm group-hover:text-orange-500 truncate">
                {store.name}
              </h3>

              {store.description && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {store.description}
                </p>
              )}

              <div className="mt-1">
                <span className="font-bold text-sm">
                  {formatPrice(store.minOrderPrice)}원~
                </span>
              </div>

              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{store.rating}</span>
                </span>
                <span className="mx-1">·</span>
                <span>리뷰 {store.reviewCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
