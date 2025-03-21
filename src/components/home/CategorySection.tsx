"use client";

import React from "react";
import Link from "next/link";

// 카테고리 데이터
const categories = [
  { id: 1, name: "간편식", icon: "/icons/convenience.png" },
  { id: 2, name: "반찬", icon: "/icons/banchan.png" },
  { id: 3, name: "정육 구이", icon: "/icons/meat.png" },
  { id: 4, name: "과일", icon: "/icons/fruit.png" },
  { id: 5, name: "디저트", icon: "/icons/dessert.png" },
  { id: 6, name: "샐러드", icon: "/icons/salad.png" },
  { id: 7, name: "간편식", icon: "/icons/convenience-food.png" },
  { id: 8, name: "건강식품", icon: "/icons/health-food.png" },
  { id: 9, name: "음료", icon: "/icons/beverage.png" },
  { id: 10, name: "전체보기", icon: "/icons/all.png" },
];

export default function CategorySection() {
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">카테고리</h2>

      <div className="grid grid-cols-5 gap-4 md:grid-cols-10">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-blue-50">
              {/* 실제 아이콘 이미지가 없으므로 임시로 텍스트 표시 */}
              <div className="w-8 h-8 flex items-center justify-center text-blue-500">
                {category.name.charAt(0)}
              </div>
              {/* 실제 이미지가 있다면 아래 코드 사용
              <Image 
                src={category.icon} 
                alt={category.name} 
                width={32} 
                height={32} 
              />
              */}
            </div>
            <span className="text-xs text-center group-hover:text-blue-500">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
