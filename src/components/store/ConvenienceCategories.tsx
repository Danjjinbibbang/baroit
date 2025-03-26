"use client";

import React from "react";

// 임시 카테고리 데이터
const convenienceCategories = [
  {
    id: "snack",
    name: "과자/스낵",
    image: "/categories/snack.jpg",
    description: "다양한 과자와 스낵",
  },
  {
    id: "drink",
    name: "음료/주류",
    image: "/categories/drink.jpg",
    description: "시원한 음료와 주류",
  },
  {
    id: "instant",
    name: "즉석식품",
    image: "/categories/instant.jpg",
    description: "간편한 즉석식품",
  },
  {
    id: "daily",
    name: "생활용품",
    image: "/categories/daily.jpg",
    description: "필수 생활용품",
  },
  {
    id: "food",
    name: "식품",
    image: "/categories/food.jpg",
    description: "신선한 식품",
  },
  {
    id: "ice",
    name: "아이스크림",
    image: "/categories/ice.jpg",
    description: "시원한 아이스크림",
  },
];

interface ConvenienceCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
}

export default function ConvenienceCategories({
  onSelectCategory,
}: ConvenienceCategoriesProps) {
  return (
    <div className="px-4 py-3">
      <h2 className="text-base font-bold mb-2">카테고리</h2>
      <div className="grid grid-cols-5 gap-2">
        {convenienceCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group w-full"
          >
            <div className="rounded-md overflow-hidden bg-gray-100 aspect-square relative mb-1 w-full max-w-[52px] mx-auto">
              {/* 실제 이미지가 없으므로 임시 박스로 대체 */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-[10px]">이미지</span>
              </div>
            </div>
            <div>
              <h3 className="text-[11px] text-center group-hover:text-orange-500 text-gray-700">
                {category.name}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
