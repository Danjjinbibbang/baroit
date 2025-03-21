"use client";

import React from "react";
import Link from "next/link";

// 임시 편의점 상품 데이터
const convenienceProducts = [
  {
    id: 1,
    name: "내슈빌핫양념치킨맛버거",
    price: 1800,
    discountRate: 0,
    image: "/products/conv1.jpg",
    rating: 0,
    reviewCount: 0,
    store: "GS25",
  },
  {
    id: 2,
    name: "[SALE] 바나나우유 200ml",
    price: 1900,
    discountRate: 41,
    image: "/products/conv2.jpg",
    rating: 0,
    reviewCount: 0,
    store: "CU",
  },
  {
    id: 3,
    name: "베이킹초코칩쿠키 50g",
    price: 1200,
    discountRate: 0,
    image: "/products/conv3.jpg",
    rating: 0,
    reviewCount: 0,
    store: "세븐일레븐",
  },
  {
    id: 4,
    name: "더블초코바나나맛 50g",
    price: 1600,
    discountRate: 0,
    image: "/products/conv4.jpg",
    rating: 5.0,
    reviewCount: 1,
    store: "이마트24",
  },
];

export default function ConvenienceSection() {
  // 할인가 계산 함수
  const calculateDiscountPrice = (price: number, discountRate: number) => {
    return price - (price * discountRate) / 100;
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">이마트24</h2>
        </div>
        <Link
          href="/convenience/1"
          className="text-sm text-gray-500 hover:text-orange-500"
        >
          더 보기 &gt;
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {convenienceProducts.map((product) => (
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

              {product.rating > 0 && (
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{product.rating}</span>
                  </span>
                  <span className="mx-1">·</span>
                  <span>리뷰 {product.reviewCount}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
