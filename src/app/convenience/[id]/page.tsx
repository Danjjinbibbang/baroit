"use client";

//import React, { useState } from "react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreSearch from "@/components/store/StoreSearch";
import StoreFeaturedProducts from "@/components/store/StoreFeaturedProducts";
import StoreAllProducts from "@/components/store/StoreAllProducts";
import ConvenienceCategories from "@/components/store/ConvenienceCategories";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ConveniencePage({params} : PageProps){
  const storeId = params.id;
  //const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    //setSelectedCategory(categoryId);
    // 실제 구현에서는 여기서 선택된 카테고리에 따라 상품을 필터링합니다.
    console.log("선택된 카테고리:", categoryId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-grow flex justify-center">
        <main className="w-full max-w-5xl bg-white">
          <StoreHeader storeId={storeId} />
          <StoreSearch storeId={storeId} />
          <ConvenienceCategories onSelectCategory={handleCategorySelect} />
          <StoreFeaturedProducts storeId={storeId} />
          <StoreAllProducts storeId={storeId} />
        </main>
      </div>
    </div>
  );
}
