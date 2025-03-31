import React from "react";
import StoreHeader from "@/components/store/StoreHeader";
import StoreSearch from "@/components/store/StoreSearch";
import StoreFeaturedProducts from "@/components/store/StoreFeaturedProducts";
import StoreAllProducts from "@/components/store/StoreAllProducts";

export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const storeId = (await params).id;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-grow flex justify-center">
        <main className="w-full max-w-5xl bg-white">
          <StoreHeader storeId={storeId} />
          <StoreSearch storeId={storeId} />
          <StoreFeaturedProducts storeId={storeId} />
          <StoreAllProducts storeId={storeId} />
        </main>
      </div>
    </div>
  );
}
