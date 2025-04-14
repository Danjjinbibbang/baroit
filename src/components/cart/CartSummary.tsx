"use client";

import { StoreCartGroupType } from "@/types/cart";

interface CartSummaryProps {
  cartItems: StoreCartGroupType[];
  onCheckout: () => void;
}

export default function CartSummary({
  cartItems,
  onCheckout,
}: CartSummaryProps) {
  // 선택된 상품만 계산
  const selectedItems = cartItems.flatMap((group) =>
    group.data.cartItems.filter(
      (item) => item.isSelected && item.itemType !== "DELETED"
    )
  );

  // 총 상품 금액
  const totalOriginalPrice = selectedItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );

  // 총 할인 금액
  const totalDiscountPrice = selectedItems.reduce(
    (sum, item) =>
      sum + (item.originalPrice - item.sellingPrice) * item.quantity,
    0
  );

  // 최종 결제 금액
  const totalPaymentPrice = selectedItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">총 상품금액</span>
          <span>{totalOriginalPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">총 할인금액</span>
          <span className="text-red-500">
            -{totalDiscountPrice.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t mt-2">
          <span className="font-medium">총 결제예정금액</span>
          <span className="font-bold text-blue-600 text-xl">
            {totalPaymentPrice.toLocaleString()}원
          </span>
        </div>
        <button
          className="w-full mt-4 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCheckout}
          disabled={selectedItems.length === 0}
        >
          {selectedItems.length > 0
            ? `${selectedItems.length}개 상품 주문하기`
            : "상품을 선택해주세요"}
        </button>
      </div>
    </div>
  );
}
