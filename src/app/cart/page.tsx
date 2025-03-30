"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";

// 장바구니 상품 타입 정의
interface CartItem {
  id: string;
  name: string;
  storeName: string;
  price: number;
  discountRate?: number;
  image: string;
  quantity: number;
  options?: { [key: string]: string };
  isSelected: boolean;
  maxQuantity: number;
}

// 임시 장바구니 데이터
const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "무농약 당근 (1kg 내외)",
    storeName: "산지직송 농장",
    price: 6900,
    discountRate: 10,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5d4c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 2,
    options: { 크기: "중" },
    isSelected: true,
    maxQuantity: 10,
  },
  {
    id: "2",
    name: "유기농 사과 (5개입)",
    storeName: "친환경 과일 농장",
    price: 12500,
    discountRate: 5,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 1,
    isSelected: true,
    maxQuantity: 5,
  },
  {
    id: "3",
    name: "국내산 무항생제 계란 (30구)",
    storeName: "행복한 닭장",
    price: 8900,
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 1,
    isSelected: true,
    maxQuantity: 3,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [allSelected, setAllSelected] = useState(true);

  // 전체 선택 상태 업데이트
  useEffect(() => {
    const allItemsSelected = cartItems.every((item) => item.isSelected);
    setAllSelected(allItemsSelected);
  }, [cartItems]);

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    const newSelectAll = !allSelected;
    setAllSelected(newSelectAll);
    setCartItems(
      cartItems.map((item) => ({
        ...item,
        isSelected: newSelectAll,
      }))
    );
  };

  // 개별 선택/해제 핸들러
  const handleSelectItem = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  // 아이템 삭제 핸들러
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // 선택 항목 삭제 핸들러
  const handleRemoveSelected = () => {
    setCartItems(cartItems.filter((item) => !item.isSelected));
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)),
            }
          : item
      )
    );
  };

  // 할인가 계산 함수
  const calculateDiscountPrice = (price: number, discountRate?: number) => {
    if (!discountRate) return price;
    return Math.floor(price * (1 - discountRate / 100));
  };

  // 선택된 항목의 총 가격
  const totalPrice = cartItems
    .filter((item) => item.isSelected)
    .reduce(
      (sum, item) =>
        sum +
        calculateDiscountPrice(item.price, item.discountRate) * item.quantity,
      0
    );

  // 선택된 항목의 할인 전 가격
  const originalPrice = cartItems
    .filter((item) => item.isSelected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 총 할인액
  const totalDiscount = originalPrice - totalPrice;

  // 선택된 항목 개수
  const selectedItemCount = cartItems.filter((item) => item.isSelected).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 border-y">
          <p className="text-gray-500 mb-6">장바구니에 담긴 상품이 없습니다.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <>
          {/* 상품 목록 헤더 */}
          <div className="flex items-center py-4 border-b">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-5 h-5 mr-2 accent-blue-500"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <label className="text-sm font-medium">
                전체선택 ({selectedItemCount}/{cartItems.length})
              </label>
            </div>
            <button
              className="ml-4 text-sm text-gray-500 hover:text-gray-700"
              onClick={handleRemoveSelected}
              disabled={selectedItemCount === 0}
            >
              선택삭제
            </button>
          </div>

          {/* 상품 목록 */}
          <ul className="divide-y">
            {cartItems.map((item) => {
              const discountedPrice = calculateDiscountPrice(
                item.price,
                item.discountRate
              );
              const itemTotalPrice = discountedPrice * item.quantity;

              return (
                <li key={item.id} className="py-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="w-5 h-5 mt-1 mr-2 accent-blue-500"
                      checked={item.isSelected}
                      onChange={() => handleSelectItem(item.id)}
                    />

                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="text-sm text-gray-500 mb-1">
                        {item.storeName}
                      </p>
                      <h3 className="font-medium mb-1">{item.name}</h3>

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
                        <p className="font-bold">
                          {discountedPrice.toLocaleString()}원
                        </p>
                      </div>

                      {/* 수량 조절 */}
                      <div className="flex items-center">
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxQuantity}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold">
                        {itemTotalPrice.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* 가격 정보 요약 */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">상품금액</span>
              <span className="font-medium">
                {originalPrice.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">할인금액</span>
              <span className="font-medium text-red-500">
                -{totalDiscount.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-lg font-medium">결제예정금액</span>
              <span className="text-xl font-bold text-blue-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 주문 및 쇼핑 계속하기 버튼 */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors"
            >
              상품 더 둘러보기
            </Link>
            <button
              className={`flex-1 px-4 py-3 rounded-md text-white text-center ${
                selectedItemCount > 0
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
              disabled={selectedItemCount === 0}
            >
              주문하기 ({selectedItemCount})
            </button>
          </div>
        </>
      )}
    </div>
  );
}
