import React from "react";
import ProductDetail from "../../../components/product/ProductDetail";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <ProductDetail />
    </div>
  );
}
