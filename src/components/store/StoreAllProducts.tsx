"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
const categoryData = {
  1: [
    { id: "all", name: "전체" },
    { id: "premium", name: "프리미엄한우" },
    { id: "domestic", name: "돼지고기(국내산)" },
    { id: "imported", name: "소고기(수입산)" },
    { id: "chicken", name: "돼지고기(수입산)" },
    { id: "set", name: "특별한우선물세트" },
    { id: "pork", name: "양념 소고기(국내산)" },
  ],
  2: [
    { id: "all", name: "전체" },
    { id: "bouquet", name: "꽃다발" },
    { id: "box", name: "플라워박스" },
    { id: "basket", name: "꽃바구니" },
    { id: "plant", name: "화분" },
  ],
  3: [
    { id: "all", name: "전체" },
    { id: "bouquet", name: "꽃다발" },
    { id: "special", name: "특별한 날" },
  ],
  4: [
    { id: "all", name: "전체" },
    { id: "mini", name: "미니 꽃다발" },
    { id: "standard", name: "스탠다드 꽃다발" },
  ],
  5: [
    { id: "all", name: "전체" },
    { id: "basket", name: "꽃바구니" },
    { id: "luxury", name: "럭셔리 꽃바구니" },
  ],
};

// 임시 전체 상품 데이터
const allProductsData: Record<number, Product[]> = {
  1: [
    {
      id: 101,
      storeId: 1,
      name: "명품LA소갈비(언양식,초이스A등급)구이용1kg(프리미엄)",
      description: "최상급 LA 소갈비",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 98000,
      sellingPrice: 98000,
      displayCategoryId: 1,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/meat1.jpg",
    },
    {
      id: 102,
      storeId: 1,
      name: "부채살 스테이크용300g(1등급)",
      description: "부드러운 육질의 부채살",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 20400,
      sellingPrice: 20400,
      displayCategoryId: 1,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/meat2.jpg",
    },
    {
      id: 103,
      storeId: 1,
      name: "특블랙한우 전산적살(프리미엄) 구이용 100g",
      description: "희소가치 높은 전산적살",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 36000,
      sellingPrice: 36000,
      displayCategoryId: 1,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/meat3.jpg",
    },
    {
      id: 104,
      storeId: 1,
      name: "(혜산식품)명품한돈삼겹 구이용 300g",
      description: "두툼한 삼겹살",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 15900,
      sellingPrice: 12500,
      displayCategoryId: 1,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 21,
      stock: 10,
      imageKey: "/products/meat4.jpg",
    },
    {
      id: 105,
      storeId: 1,
      name: "한우 등심 스테이크 200g",
      description: "부드러운 한우 등심",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 28000,
      sellingPrice: 28000,
      displayCategoryId: 1,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/meat5.jpg",
    },
    {
      id: 106,
      storeId: 1,
      name: "양념 불고기 500g",
      description: "특제 양념의 불고기",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 20000,
      sellingPrice: 18000,
      displayCategoryId: 1,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 10,
      stock: 10,
      imageKey: "/products/meat6.jpg",
    },
  ],
  2: [
    {
      id: 201,
      storeId: 2,
      name: "로즈 꽃다발",
      description: "아름다운 장미 꽃다발",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 55000,
      sellingPrice: 55000,
      displayCategoryId: 2,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/flower1.jpg",
    },
    {
      id: 202,
      storeId: 2,
      name: "믹스 플라워 박스",
      description: "다양한 꽃으로 구성된 플라워 박스",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 72000,
      sellingPrice: 65000,
      displayCategoryId: 2,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 10,
      stock: 10,
      imageKey: "/products/flower2.jpg",
    },
    {
      id: 203,
      storeId: 2,
      name: "작은 화분",
      description: "귀여운 작은 화분",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 35000,
      sellingPrice: 35000,
      displayCategoryId: 2,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/flower3.jpg",
    },
  ],
  3: [
    {
      id: 301,
      storeId: 3,
      name: "프리미엄 꽃다발",
      description: "특별한 날을 위한 프리미엄 꽃다발",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 120000,
      sellingPrice: 120000,
      displayCategoryId: 3,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/flower3.jpg",
    },
    {
      id: 302,
      storeId: 3,
      name: "생일 축하 꽃다발",
      description: "생일을 위한 특별한 꽃다발",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 89000,
      sellingPrice: 85000,
      displayCategoryId: 3,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 5,
      stock: 10,
      imageKey: "/products/flower4.jpg",
    },
  ],
  4: [
    {
      id: 401,
      storeId: 4,
      name: "미니 꽃다발",
      description: "작고 귀여운 미니 꽃다발",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 38000,
      sellingPrice: 38000,
      displayCategoryId: 4,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/flower4.jpg",
    },
    {
      id: 402,
      storeId: 4,
      name: "스탠다드 꽃다발",
      description: "기본 스타일의 꽃다발",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 58000,
      sellingPrice: 58000,
      displayCategoryId: 4,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/flower5.jpg",
    },
  ],
  5: [
    {
      id: 501,
      storeId: 5,
      name: "대형 꽃바구니",
      description: "풍성한 대형 꽃바구니",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 125000,
      sellingPrice: 125000,
      displayCategoryId: 5,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 0,
      stock: 10,
      imageKey: "/products/flower5.jpg",
    },
    {
      id: 502,
      storeId: 5,
      name: "럭셔리 꽃바구니",
      description: "고급스러운 럭셔리 꽃바구니",
      registeredId: "admin",
      fulfillmentMethod: "BOTH",
      hasOption: false,
      originalPrice: 195000,
      sellingPrice: 180000,
      displayCategoryId: 5,
      storeCategoryIds: [],
      options: [],
      variants: [],
      discountRate: 8,
      stock: 10,
      imageKey: "/products/flower6.jpg",
    },
  ],
};

interface StoreAllProductsProps {
  storeId: string;
}

export default function StoreAllProducts({ storeId }: StoreAllProductsProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  // 실제 구현에서는 storeId를 사용하여 카테고리 및 상품 정보를 가져옵니다.
  const categories =
    categoryData[Number(storeId) as keyof typeof categoryData] || [];
  const allProducts =
    allProductsData[Number(storeId) as keyof typeof allProductsData] || [];

  // 선택된 카테고리에 따라 상품 필터링
  const filteredProducts =
    activeCategory === "all"
      ? allProducts
      : allProducts.filter((product) => product.category === activeCategory);

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (categories.length === 0 || allProducts.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold mb-4">전체 메뉴</h2>

      {/* 카테고리 탭 */}
      <div className="overflow-x-auto pb-2 mb-4">
        <div className="flex space-x-2 whitespace-nowrap">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1.5 text-sm rounded-full ${
                activeCategory === category.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
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

              {product.discountRate && product.discountRate > 0 && (
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
                {product.discountRate && product.discountRate > 0 ? (
                  <>
                    <span className="text-red-500 font-bold">
                      {formatPrice(product.sellingPrice)}원
                    </span>
                    <span className="text-gray-400 text-xs line-through ml-1">
                      {formatPrice(product.originalPrice || 0)}원
                    </span>
                  </>
                ) : (
                  <span className="font-bold">
                    {formatPrice(product.sellingPrice)}원
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>해당 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
