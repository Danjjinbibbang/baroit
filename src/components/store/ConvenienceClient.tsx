"use client";

import { useState } from "react";
import ConvenienceCategories from "@/components/store/ConvenienceCategories";

interface ConvenienceClientProps {
  storeId: string;
}

export default function ConvenienceClient({ storeId }: ConvenienceClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // 실제 구현에서는 여기서 선택된 카테고리에 따라 상품을 필터링합니다.
    console.log("선택된 카테고리:", categoryId, "스토어 ID:", storeId);
  };

  return (
    <ConvenienceCategories onSelectCategory={handleCategorySelect} />
  );
}