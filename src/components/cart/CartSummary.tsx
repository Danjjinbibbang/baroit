"use client";

import { CartItem } from "@/types/cart";
import { calculateDiscountPrice } from "@/utils/cart";

interface CartSummaryProps {
  cartItems: CartItem[];
  onCheckout: () => void;
}

export default function CartSummary({
  cartItems,
  onCheckout,
}: CartSummaryProps) {
  // 유효하고 선택된 아이템만 필터링
  const validSelectedItems = cartItems.filter(
    (item) => item.isSelected && !item.isSoldOut && !item.isDeleted
  );

  // 선택된 아이템 개수
  const selectedItemCount = validSelectedItems.length;

  // 원래 가격 총합
  const originalPrice = validSelectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 할인 적용된 가격 총합
  const totalPrice = validSelectedItems.reduce(
    (sum, item) =>
      sum +
      calculateDiscountPrice(item.price, item.discountRate) * item.quantity,
    0
  );

  // 총 할인액
  const totalDiscount = originalPrice - totalPrice;

  return (
    <div className="sticky bottom-0 bg-gray-50 shadow-md p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">상품금액</span>
              <span className="font-medium">
                {originalPrice.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">할인금액</span>
              <span className="text-red-500 font-medium">
                -{totalDiscount.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-lg font-medium">총 결제예정금액</span>
              <span className="text-xl font-bold text-blue-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              className={`w-full md:w-auto px-6 py-3 rounded-md text-white text-lg font-medium ${
                selectedItemCount > 0
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
              disabled={selectedItemCount === 0}
              onClick={onCheckout}
            >
              {selectedItemCount > 0
                ? `주문하기 (${selectedItemCount})`
                : "상품을 선택해주세요"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
