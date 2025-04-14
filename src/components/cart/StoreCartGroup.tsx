"use client";

import { StoreCartGroupType } from "@/types/cart";
import CartItem from "./CartItem";
import { X } from "lucide-react";

interface StoreCartGroupProps {
  storeGroup: StoreCartGroupType;
  onSelectItem: (id: number) => void;
  onSelectStore: (storeId: number, isSelected: boolean) => void;
  onRemoveItem: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onClearStore: (storeId: number) => void;
}

export default function StoreCartGroup({
  storeGroup,
  onSelectItem,
  onSelectStore,
  onRemoveItem,
  onQuantityChange,
  onClearStore,
}: StoreCartGroupProps) {
  // storeGroup.data에서 필요한 값들을 추출
  const { storeId, cartItems } = storeGroup.data;

  // 유효한 상품 필터링 (삭제되지 않은 상품)
  const validItems = cartItems.filter((item) => item.itemType !== "DELETED");

  // 모든 유효한 상품이 선택되었는지 확인
  const isAllSelected =
    validItems.length > 0 && validItems.every((item) => item.isSelected);

  // 선택된 항목들의 금액 계산
  const selectedItems = cartItems.filter(
    (item) => item.isSelected && item.itemType !== "DELETED"
  );

  // 선택된 상품의 원가 총액
  const calculatedOriginalPrice = selectedItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );

  // 선택된 상품의 판매가 총액
  const calculatedSellingPrice = selectedItems.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  // 선택된 상품의 할인 총액
  const calculatedDiscountPrice =
    calculatedOriginalPrice - calculatedSellingPrice;

  return (
    <div className="mb-8 border rounded-lg overflow-hidden mx-4">
      {/* 스토어 헤더 */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-5 h-5 mr-2 accent-blue-500"
              checked={isAllSelected}
              onChange={() => onSelectStore(storeId, !isAllSelected)}
            />
            <h3 className="font-medium">
              {cartItems[0]?.itemName || "알 수 없는 스토어"}
            </h3>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => onClearStore(storeId)}
            title="스토어 장바구니 비우기"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="divide-y px-4">
        {cartItems.map(
          (item) =>
            item.itemType !== "DELETED" && (
              <CartItem
                key={item.itemId}
                item={{
                  itemId: item.itemId,
                  itemName: item.itemName,
                  storeId: storeId,
                  storeName: cartItems[0]?.itemName || "알 수 없는 스토어",
                  price: item.originalPrice,
                  discountRate:
                    item.originalPrice > item.sellingPrice
                      ? Math.round(
                          (1 - item.sellingPrice / item.originalPrice) * 100
                        )
                      : 0,
                  imageUrl: item.imageUrl,
                  image: item.imageUrl, // 호환성 추가
                  name: item.itemName, // 호환성 추가
                  quantity: item.quantity,
                  isSelected: item.isSelected || false,
                  stock: item.stock || 100,
                  isSoldOut: item.isSoldOut || item.itemType === "SOLDOUT",
                  isDeleted: item.isDeleted || item.itemType === "DELETED",
                }}
                onSelectItem={onSelectItem}
                onRemoveItem={onRemoveItem}
                onQuantityChange={onQuantityChange}
              />
            )
        )}
      </div>

      {/* 스토어별 결제 정보 요약 */}
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">상품금액</span>
          <span>{calculatedOriginalPrice.toLocaleString()}원</span>
        </div>
        {calculatedDiscountPrice > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">할인금액</span>
            <span className="text-red-500">
              -{calculatedDiscountPrice.toLocaleString()}원
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t mt-2">
          <span className="font-medium">결제예정금액</span>
          <span className="font-bold text-blue-600">
            {calculatedSellingPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
