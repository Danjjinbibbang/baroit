"use client";

import React from "react";
import Link from "next/link";

// 임시 상품 데이터
const products = [
  {
    id: 1,
    name: "맛있는 도시락",
    price: 8900,
    discountRate: 10,
    image: "/products/product1.jpg",
    rating: 4.8,
    reviewCount: 120,
  },
  {
    id: 2,
    name: "신선한 샐러드",
    price: 7500,
    discountRate: 0,
    image: "/products/product2.jpg",
    rating: 4.5,
    reviewCount: 85,
  },
  {
    id: 3,
    name: "프리미엄 과일 세트",
    price: 25000,
    discountRate: 15,
    image: "/products/product3.jpg",
    rating: 4.9,
    reviewCount: 230,
  },
  {
    id: 4,
    name: "건강한 간편식",
    price: 6500,
    discountRate: 5,
    image: "/products/product4.jpg",
    rating: 4.6,
    reviewCount: 95,
  },
  {
    id: 5,
    name: "수제 디저트",
    price: 4500,
    discountRate: 0,
    image: "/products/product5.jpg",
    rating: 4.7,
    reviewCount: 150,
  },
  {
    id: 6,
    name: "유기농 채소 세트",
    price: 18000,
    discountRate: 8,
    image: "/products/product6.jpg",
    rating: 4.4,
    reviewCount: 78,
  },
  {
    id: 7,
    name: "프리미엄 소고기",
    price: 35000,
    discountRate: 5,
    image: "/products/product7.jpg",
    rating: 4.9,
    reviewCount: 210,
  },
  {
    id: 8,
    name: "수제 반찬 세트",
    price: 15000,
    discountRate: 10,
    image: "/products/product8.jpg",
    rating: 4.7,
    reviewCount: 180,
  },
];

export default function ProductSection() {
  // 할인가 계산 함수
  const calculateDiscountPrice = (price: number, discountRate: number) => {
    return price - (price * discountRate) / 100;
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">인기 상품</h2>
        <Link
          href="/products"
          className="text-sm text-gray-500 hover:text-orange-500"
        >
          더보기 &gt;
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              {/* 실제 이미지가 있다면 아래 코드 사용
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              */}

              {product.discountRate > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discountRate}% 할인
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-sm group-hover:text-orange-500 line-clamp-2">
                {product.name}
              </h3>

              <div className="mt-1">
                {product.discountRate > 0 ? (
                  <>
                    <span className="text-red-500 font-bold">
                      {formatPrice(
                        calculateDiscountPrice(
                          product.price,
                          product.discountRate
                        )
                      )}
                      원
                    </span>
                    <span className="text-gray-400 text-xs line-through ml-1">
                      {formatPrice(product.price)}원
                    </span>
                  </>
                ) : (
                  <span className="font-bold">
                    {formatPrice(product.price)}원
                  </span>
                )}
              </div>

              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{product.rating}</span>
                </span>
                <span className="mx-1">·</span>
                <span>리뷰 {product.reviewCount}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
