"use client";

import React from "react";
import Link from "next/link";

// 임시 대표 상품 데이터
const featuredProductsData = {
  1: [
    {
      id: 101,
      name: "명품LA소갈비(언양식,초이스A등급)구이용1kg(프리미엄)",
      price: 98000,
      discountRate: 0,
      image: "/products/meat1.jpg",
      description: "최상급 LA 소갈비",
    },
    {
      id: 102,
      name: "부채살 스테이크용300g(1등급)",
      price: 20400,
      discountRate: 0,
      image: "/products/meat2.jpg",
      description: "부드러운 육질의 부채살",
    },
    {
      id: 103,
      name: "특블랙한우 전산적살(프리미엄) 구이용 100g",
      price: 36000,
      discountRate: 0,
      image: "/products/meat3.jpg",
      description: "희소가치 높은 전산적살",
    },
    {
      id: 104,
      name: "(혜산식품)명품한돈삼겹 구이용 300g",
      price: 12500,
      discountRate: 21,
      originalPrice: 15900,
      image: "/products/meat4.jpg",
      description: "두툼한 삼겹살",
    },
  ],
  2: [
    {
      id: 201,
      name: "로즈 꽃다발",
      price: 55000,
      discountRate: 0,
      image: "/products/flower1.jpg",
      description: "아름다운 장미 꽃다발",
    },
    {
      id: 202,
      name: "믹스 플라워 박스",
      price: 65000,
      discountRate: 10,
      originalPrice: 72000,
      image: "/products/flower2.jpg",
      description: "다양한 꽃으로 구성된 플라워 박스",
    },
  ],
  3: [
    {
      id: 301,
      name: "프리미엄 꽃다발",
      price: 120000,
      discountRate: 0,
      image: "/products/flower3.jpg",
      description: "특별한 날을 위한 프리미엄 꽃다발",
    },
  ],
  4: [
    {
      id: 401,
      name: "미니 꽃다발",
      price: 38000,
      discountRate: 0,
      image: "/products/flower4.jpg",
      description: "작고 귀여운 미니 꽃다발",
    },
  ],
  5: [
    {
      id: 501,
      name: "대형 꽃바구니",
      price: 125000,
      discountRate: 0,
      image: "/products/flower5.jpg",
      description: "풍성한 대형 꽃바구니",
    },
  ],
};

interface StoreFeaturedProductsProps {
  storeId: string;
}

export default function StoreFeaturedProducts({
  storeId,
}: StoreFeaturedProductsProps) {
  // 실제 구현에서는 storeId를 사용하여 대표 상품 정보를 가져옵니다.
  const products =
    featuredProductsData[
      Number(storeId) as keyof typeof featuredProductsData
    ] || [];

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-6 border-b">
      <h2 className="text-xl font-bold mb-4">대표 메뉴</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square relative mb-2">
              {/* 실제 이미지가 없으므로 임시 박스로 대체 */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">상품 이미지</span>
              </div>

              {product.discountRate > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discountRate}%
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-sm group-hover:text-orange-500 line-clamp-2">
                {product.name}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {product.description}
              </p>

              <div className="mt-1">
                {product.discountRate > 0 ? (
                  <>
                    <span className="text-red-500 font-bold">
                      {formatPrice(product.price)}원
                    </span>
                    <span className="text-gray-400 text-xs line-through ml-1">
                      {formatPrice(product.originalPrice || 0)}원
                    </span>
                  </>
                ) : (
                  <span className="font-bold">
                    {formatPrice(product.price)}원
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
