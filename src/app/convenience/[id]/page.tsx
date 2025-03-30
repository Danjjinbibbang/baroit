//import React, { useState } from "react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreSearch from "@/components/store/StoreSearch";
import StoreFeaturedProducts from "@/components/store/StoreFeaturedProducts";
import StoreAllProducts from "@/components/store/StoreAllProducts";
//import ConvenienceCategories from "@/components/store/ConvenienceCategories";
import ConvenienceClient from "@/components/store/ConvenienceClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ConveniencePage({params} : PageProps){
  const storeId = params.id;
  //const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-grow flex justify-center">
        <main className="w-full max-w-5xl bg-white">
          <StoreHeader storeId={storeId} />
          <StoreSearch storeId={storeId} />
          <ConvenienceClient storeId={storeId} />
          <StoreFeaturedProducts storeId={storeId} />
          <StoreAllProducts storeId={storeId} />
        </main>
      </div>
    </div>
  );
}
