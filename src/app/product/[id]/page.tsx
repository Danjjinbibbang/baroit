import React from "react";
import ProductDetail from "../../../components/product/ProductDetail";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="container mx-auto py-8 px-4">
      <ProductDetail />
    </div>
  );
}
