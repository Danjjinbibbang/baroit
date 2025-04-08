"use client";

import { StoreCartGroup as StoreCartGroupType } from "@/types/cart";
import { calculateDiscountPrice } from "@/utils/cart";
import CartItem from "./CartItem";

interface StoreCartGroupProps {
  storeGroup: StoreCartGroupType;
  onSelectItem: (id: string) => void;
  onSelectStore: (storeId: string, isSelected: boolean) => void;
  onRemoveItem: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export default function StoreCartGroup({
  storeGroup,
  onSelectItem,
  onSelectStore,
  onRemoveItem,
  onQuantityChange,
}: StoreCartGroupProps) {
  // 스토어 내 유효한(삭제되지 않고 품절되지 않은) 선택된 상품의 총 금액 계산
  const validItems = storeGroup.items.filter(
    (item) => !item.isSoldOut && !item.isDeleted
  );
  const selectedValidItems = validItems.filter((item) => item.isSelected);

  // 원래 가격 총합
  const originalPrice = selectedValidItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 할인 적용된 가격 총합
  const totalPrice = selectedValidItems.reduce(
    (sum, item) =>
      sum +
      calculateDiscountPrice(item.price, item.discountRate) * item.quantity,
    0
  );

  // 총 할인액
  const totalDiscount = originalPrice - totalPrice;

  return (
    <div className="mb-8 border rounded-lg overflow-hidden mx-4">
      {/* 스토어 헤더 */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-5 h-5 mr-2 accent-blue-500"
            checked={storeGroup.isAllSelected}
            onChange={() =>
              onSelectStore(storeGroup.storeId, !storeGroup.isAllSelected)
            }
          />
          <h3 className="font-medium">{storeGroup.storeName}</h3>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="divide-y px-4">
        {storeGroup.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onSelectItem={onSelectItem}
            onRemoveItem={onRemoveItem}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>

      {/* 스토어별 결제 정보 요약 */}
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">상품금액</span>
          <span>{originalPrice.toLocaleString()}원</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">할인금액</span>
            <span className="text-red-500">
              -{totalDiscount.toLocaleString()}원
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t mt-2">
          <span className="font-medium">결제예정금액</span>
          <span className="font-bold text-blue-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
