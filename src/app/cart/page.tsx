"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  groupCartItemsByStore,
  checkLoginStatus,
  filterExpiredCartItems,
} from "@/utils/cart";
import { CartItem } from "@/types/cart";
import StoreCartGroup from "@/components/cart/StoreCartGroup";
import CartSummary from "@/components/cart/CartSummary";
import LoginPromptModal from "@/components/cart/LoginPromptModal";
import { useAuthStore } from "@/zustand/auth";

// 임시 장바구니 데이터
const initialCartItems: CartItem[] = [
  {
    id: "1",
    productId: "p1",
    name: "무농약 당근 (1kg 내외)",
    storeId: "store1",
    storeName: "산지직송 농장",
    price: 6900,
    discountRate: 10,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5d4c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 2,
    options: { 크기: "중" },
    isSelected: true,
    stock: 10,
    isSoldOut: false,
    isDeleted: false,
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
  },
  {
    id: "2",
    productId: "p2",
    name: "유기농 사과 (5개입)",
    storeId: "store1",
    storeName: "산지직송 농장",
    price: 12500,
    discountRate: 5,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 1,
    isSelected: true,
    stock: 5,
    isSoldOut: false,
    isDeleted: false,
    addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10일 전
  },
  {
    id: "3",
    productId: "p3",
    name: "국내산 무항생제 계란 (30구)",
    storeId: "store2",
    storeName: "행복한 닭장",
    price: 8900,
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 1,
    isSelected: true,
    stock: 3,
    isSoldOut: false,
    isDeleted: false,
    addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15일 전
  },
  {
    id: "4",
    productId: "p4",
    name: "유기농 딸기 (500g)",
    storeId: "store1",
    storeName: "산지직송 농장",
    price: 15900,
    discountRate: 8,
    image:
      "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 1,
    isSelected: true,
    stock: 0,
    isSoldOut: true,
    isDeleted: false,
    addedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20일 전
  },
  {
    id: "5",
    productId: "p5",
    name: "친환경 무농약 브로콜리",
    storeId: "store3",
    storeName: "유기농 채소마을",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 2,
    isSelected: true,
    stock: 8,
    isSoldOut: false,
    isDeleted: false,
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
  },
  {
    id: "6",
    productId: "p6",
    name: "삭제된 상품",
    storeId: "store3",
    storeName: "유기농 채소마을",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1588391051157-b4945d66dec3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    quantity: 1,
    isSelected: false,
    stock: 0,
    isSoldOut: false,
    isDeleted: true,
    addedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25일 전
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated, requireAuth } = useAuthStore();

  // 카트 아이템을 스토어별로 그룹화
  const storeGroups = groupCartItemsByStore(cartItems);

  // 컴포넌트 마운트 시 장바구니 데이터 로드
  useEffect(() => {
    const loadCartData = async () => {
      // 실제로는 API 호출로 장바구니 데이터를 가져와야 함
      // 30일이 지난 항목 필터링
      const filteredItems = filterExpiredCartItems(initialCartItems);
      setCartItems(filteredItems);
      setIsLoading(false);
    };

    loadCartData();
  }, []);

  // 전체 선택 상태 업데이트
  const handleSelectAll = (isSelected: boolean) => {
    setCartItems(
      cartItems.map((item) => ({
        ...item,
        isSelected: item.isSoldOut || item.isDeleted ? false : isSelected,
      }))
    );
  };

  // 개별 아이템 선택/해제 핸들러
  const handleSelectItem = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  // 스토어 전체 선택/해제 핸들러
  const handleSelectStore = (storeId: string, isSelected: boolean) => {
    setCartItems(
      cartItems.map((item) =>
        item.storeId === storeId && !item.isSoldOut && !item.isDeleted
          ? { ...item, isSelected }
          : item
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
              quantity: Math.max(1, Math.min(newQuantity, item.stock)),
            }
          : item
      )
    );
  };

  // 주문 핸들러
  const handleCheckout = () => {
    // 로그인 여부 확인 및 주문 처리
    requireAuth(() => {
      const selectedItems = cartItems.filter(
        (item) => item.isSelected && !item.isSoldOut && !item.isDeleted
      );

      if (selectedItems.length === 0) {
        alert("선택된 상품이 없습니다.");
        return;
      }

      // 주문 페이지로 이동
      console.log("주문할 상품:", selectedItems);
      // 주문 api 연동
      // 결제 페이지로 이동
      //window.location.href = "/payment";
    });
  };

  // 모든 아이템이 선택되었는지 확인
  const allSelected =
    cartItems.length > 0 &&
    cartItems
      .filter((item) => !item.isSoldOut && !item.isDeleted)
      .every((item) => item.isSelected);

  // 선택된 유효한 항목 개수
  const selectedValidItemCount = cartItems.filter(
    (item) => item.isSelected && !item.isSoldOut && !item.isDeleted
  ).length;

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 장바구니에 상품이 없는 경우
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>
        <div className="text-center py-16 border-y">
          <p className="text-gray-500 mb-6">장바구니에 담긴 상품이 없습니다.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 pb-32 w-full">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>

      {/* 전체 선택 및 삭제 옵션 */}
      <div className="flex items-center py-4 border-b mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-5 h-5 mr-2 accent-blue-500"
            checked={allSelected}
            onChange={() => handleSelectAll(!allSelected)}
          />
          <label className="text-sm font-medium">
            전체선택 ({selectedValidItemCount}/
            {
              cartItems.filter((item) => !item.isSoldOut && !item.isDeleted)
                .length
            }
            )
          </label>
        </div>
        <button
          className="ml-4 text-sm text-gray-500 hover:text-gray-700"
          onClick={handleRemoveSelected}
          disabled={selectedValidItemCount === 0}
        >
          선택삭제
        </button>
      </div>

      {/* 스토어별 장바구니 그룹 */}
      {storeGroups.map((storeGroup) => (
        <StoreCartGroup
          key={storeGroup.storeId}
          storeGroup={storeGroup}
          onSelectItem={handleSelectItem}
          onSelectStore={handleSelectStore}
          onRemoveItem={handleRemoveItem}
          onQuantityChange={handleQuantityChange}
        />
      ))}

      {/* 주문 요약 영역 */}
      <CartSummary cartItems={cartItems} onCheckout={handleCheckout} />

      {/* 로그인 유도 모달 */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </div>
  );
}
