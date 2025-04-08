"use client";

import { Minus, Plus, X } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";
import { calculateDiscountPrice } from "@/utils/cart";

interface CartItemProps {
  item: CartItemType;
  onSelectItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export default function CartItem({
  item,
  onSelectItem,
  onRemoveItem,
  onQuantityChange,
}: CartItemProps) {
  // 할인가 계산
  const discountedPrice = calculateDiscountPrice(item.price, item.discountRate);
  const itemTotalPrice = discountedPrice * item.quantity;

  // 재고 상태에 따른 UI 표시를 위한 변수
  const isLowStock = !item.isSoldOut && item.stock <= 10;
  const isDisabled = item.isSoldOut || item.isDeleted;

  return (
    <div className={`py-4 ${isDisabled ? "opacity-70" : ""}`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          className="w-5 h-5 mt-1 mr-2 accent-blue-500"
          checked={item.isSelected}
          onChange={() => onSelectItem(item.id)}
          disabled={isDisabled}
        />

        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4 relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {item.isSoldOut && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-sm px-2 py-1 bg-red-500 rounded">
                품절됨
              </span>
            </div>
          )}
          {item.isDeleted && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-sm px-2 py-1 bg-gray-500 rounded">
                삭제된 상품
              </span>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <p className="text-sm text-gray-500 mb-1">{item.storeName}</p>
          <h3 className="font-medium mb-1">
            {item.name}
            {isLowStock && !isDisabled && (
              <span className="ml-2 text-sm text-red-500 font-normal">
                품절 임박: {item.stock}개 남음
              </span>
            )}
          </h3>

          {/* 옵션 표시 */}
          {item.options && Object.keys(item.options).length > 0 && (
            <p className="text-sm text-gray-500 mb-2">
              {Object.entries(item.options)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}
            </p>
          )}

          {/* 가격 정보 */}
          <div className="mb-3">
            {item.discountRate ? (
              <div className="flex items-center text-sm mb-1">
                <span className="text-red-500 font-bold mr-1">
                  {item.discountRate}%
                </span>
                <span className="text-gray-400 line-through">
                  {item.price.toLocaleString()}원
                </span>
              </div>
            ) : null}
            <p className="font-bold">{discountedPrice.toLocaleString()}원</p>
          </div>

          {/* 수량 조절 */}
          <div className="flex items-center">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                className={`px-2 py-1 ${
                  isDisabled
                    ? "bg-gray-200 text-gray-400"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1 || isDisabled}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center">{item.quantity}</span>
              <button
                className={`px-2 py-1 ${
                  isDisabled
                    ? "bg-gray-200 text-gray-400"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock || isDisabled}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              className="ml-2 text-gray-400 hover:text-gray-600"
              onClick={() => onRemoveItem(item.id)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-right flex-shrink-0 ml-4">
          <p className="font-bold">{itemTotalPrice.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
}
