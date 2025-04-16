"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getStoreCart,
  updateCartItemQuantity,
  removeFromCart,
  clearStoreCart,
} from "@/utils/cart";
import { StoreCartGroupType } from "@/types/cart";
import StoreCartGroup from "@/components/cart/StoreCartGroup";
import CartSummary from "@/components/cart/CartSummary";
import LoginPromptModal from "@/components/cart/LoginPromptModal";
import { useAuthStore } from "@/zustand/auth";
import { useRouter } from "next/navigation";

// 장바구니 데이터에 UI 상태를 추가하는 함수
const addUiStateToCartItems = (
  items: StoreCartGroupType[]
): StoreCartGroupType[] => {
  return items.map((group) => {
    // 서버에서 온 cartItems에 UI 상태 추가
    const cartItemsWithState = group.data.cartItems.map((item) => ({
      ...item,
      isSelected: item.itemType !== "DELETED", // 기본적으로 삭제된 상품이 아니면 선택
      isSoldOut: item.itemType === "SOLDOUT", // 품절 상태
      isDeleted: item.itemType === "DELETED", // 삭제된 상품
      stock: 100, // 기본 재고값 (실제로는 서버에서 받아와야 함)
    }));

    return {
      ...group,
      data: {
        ...group.data,
        cartItems: cartItemsWithState,
      },
    };
  });
};

export default function CartPage() {
  const { requireAuth } = useAuthStore();
  const [cartItems, setCartItems] = useState<StoreCartGroupType[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 초기 로드 시 전체 장바구니 조회
  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      // API를 통해 장바구니 데이터 가져오기 (storeId 없이 호출)
      const response = await getStoreCart(1);
      console.log("장바구니 조회 데이터: ", response);

      if (response) {
        // response가 배열인지 확인하고 처리
        const items = Array.isArray(response) ? response : [response];
        console.log("items: ", items.length);

        // data가 null이 아닌 항목만 필터링
        const validItems = items.filter((item) => item.data != null);

        if (validItems.length > 0) {
          const cartItemsWithState = addUiStateToCartItems(validItems);
          setCartItems(cartItemsWithState);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("장바구니 로드 실패:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // 상품 선택 처리
  const handleSelectItem = (itemId: number) => {
    setCartItems((prevItems) =>
      prevItems.map((group) => ({
        ...group,
        data: {
          ...group.data,
          cartItems: group.data.cartItems.map((item) =>
            item.itemId === itemId
              ? { ...item, isSelected: !item.isSelected }
              : item
          ),
        },
      }))
    );
  };

  // 스토어 전체 상품 선택 처리
  const handleSelectStore = (storeId: number, isSelected: boolean) => {
    setCartItems((prevItems) =>
      prevItems.map((group) => {
        if (group.data.storeId === storeId) {
          return {
            ...group,
            data: {
              ...group.data,
              cartItems: group.data.cartItems.map((item) =>
                item.itemType !== "DELETED" ? { ...item, isSelected } : item
              ),
            },
          };
        }
        return group;
      })
    );
  };

  // 상품 삭제 처리
  const handleRemoveItem = async (itemId: number) => {
    try {
      // 해당 상품이 속한 스토어 찾기
      const storeGroup = cartItems.find((group) =>
        group.data.cartItems.some((item) => item.itemId === itemId)
      );

      if (!storeGroup) {
        console.error("삭제할 상품을 찾을 수 없습니다.");
        return;
      }

      const storeId = storeGroup.data.storeId;

      // API를 통해 장바구니에서 상품 삭제
      const success = await removeFromCart(itemId, storeId);

      if (success) {
        // 장바구니 데이터 다시 로드
        await fetchCartItems();
      } else {
        alert("상품 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
  };

  // 선택된 상품 삭제
  const handleRemoveSelected = async () => {
    try {
      const confirmed = window.confirm(
        "선택한 상품을 장바구니에서 삭제하시겠습니까?"
      );
      if (!confirmed) return;

      // 선택된 상품 찾기
      const selectedItems = cartItems.flatMap((group) =>
        group.data.cartItems
          .filter((item) => item.isSelected && item.itemType !== "DELETED")
          .map((item) => ({
            itemId: item.itemId,
            storeId: group.data.storeId,
          }))
      );

      if (selectedItems.length === 0) {
        alert("선택된 상품이 없습니다.");
        return;
      }

      // 각 상품에 대해 서버에 삭제 요청
      const deletePromises = selectedItems.map((item) =>
        removeFromCart(item.itemId, item.storeId)
      );
      const results = await Promise.all(deletePromises);

      // 모든 삭제 요청이 성공적으로 처리되었는지 확인
      const allSuccessful = results.every((success) => success);

      if (allSuccessful) {
        // 장바구니 데이터 다시 로드
        await fetchCartItems();
      } else {
        alert("일부 상품 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("선택 삭제 실패:", error);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  };

  // 수량 변경 처리
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // 최소 수량은 1

    // 해당 상품이 속한 스토어 찾기
    const storeGroup = cartItems.find((group) =>
      group.data.cartItems.some((item) => item.itemId === itemId)
    );

    if (storeGroup) {
      const storeId = storeGroup.data.storeId;

      try {
        // API를 통해 수량 변경
        const success = await updateCartItemQuantity(
          newQuantity,
          storeId,
          itemId
        );
        console.log("장바구니 수량 변경: ", success);
        if (success) {
          // UI 업데이트
          setCartItems((prevItems) =>
            prevItems.map((group) => ({
              ...group,
              data: {
                ...group.data,
                cartItems: group.data.cartItems.map((item) =>
                  item.itemId === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
                ),
              },
            }))
          );
        }
      } catch (error) {
        console.error("수량 변경 실패:", error);
      }
    }
  };

  // 전체 선택 처리
  const handleSelectAll = (selectAll: boolean) => {
    setCartItems((prevItems) =>
      prevItems.map((group) => ({
        ...group,
        data: {
          ...group.data,
          cartItems: group.data.cartItems.map((item) =>
            item.itemType !== "DELETED"
              ? { ...item, isSelected: selectAll }
              : item
          ),
        },
      }))
    );
  };

  // 주문 핸들러
  const handleCheckout = () => {
    // 로그인 여부 확인 및 주문 처리
    requireAuth(() => {
      const selectedItems = cartItems.flatMap((group) =>
        group.data.cartItems.filter(
          (item) => item.isSelected && item.itemType !== "DELETED"
        )
      );

      if (selectedItems.length === 0) {
        alert("선택된 상품이 없습니다.");
        return;
      }
      // 주문 api 연동할 것 -> 아직 주문 api가 없음
      // 주문 api 성공 시 -> 결제 창으로 넘어가도록 수정할 것
      // 임의로 그냥 결제창으로 넘어가도록 함 /payment
      // 결제창으로 가격을 넘겨줘야함
      // 총 금액 계산
      const totalAmount = selectedItems.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
      );

      // 주문명 생성
      const orderName =
        selectedItems.length > 0
          ? `${selectedItems[0].itemName} ${
              selectedItems.length > 1 ? `외 ${selectedItems.length - 1}건` : ""
            }`
          : "장바구니 상품";

      // 주문 api 연동할 것 -> 아직 주문 api가 없음
      // 주문 api 성공 시 -> 결제 창으로 넘어가도록 수정할 것

      console.log("주문 처리:", selectedItems);

      // 결제 페이지로 이동하면서 값 전달
      router.push(
        `/payment?amount=${totalAmount}&orderName=${encodeURIComponent(
          orderName
        )}`
      );

      console.log("주문 처리:", selectedItems);
    });
  };

  // 선택된 유효한 항목 가져오기
  const selectedItems = cartItems.flatMap((group) =>
    group.data.cartItems.filter(
      (item) => item.itemType !== "DELETED" && item.isSelected
    )
  );

  // 전체 선택 여부 확인 로직
  const allItems = cartItems.flatMap((group) =>
    group.data.cartItems.filter((item) => item.itemType !== "DELETED")
  );

  const allSelected =
    allItems.length > 0 && allItems.every((item) => item.isSelected);

  // 선택된 유효한 항목 개수
  const selectedValidItemCount = selectedItems.length;

  // 스토어 장바구니 비우기 처리
  const handleClearStore = async (storeId: number) => {
    try {
      const confirmed = window.confirm(
        "이 스토어의 모든 상품을 장바구니에서 비우시겠습니까?"
      );
      if (!confirmed) return;

      // API를 통해 스토어 장바구니 비우기
      const success = await clearStoreCart(storeId);

      if (success) {
        // 장바구니 데이터 다시 로드
        await fetchCartItems();
      }
    } catch (error) {
      console.error("스토어 장바구니 비우기 실패:", error);
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return <div className="text-center py-8">장바구니 로딩 중...</div>;
  }

  // 장바구니에 상품이 없는 경우
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>
        <div className="py-12">
          <p className="mb-4 text-gray-500">장바구니에 상품이 없습니다.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
            전체선택 ({selectedValidItemCount}/{allItems.length})
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
      {cartItems.map((storeGroup) => (
        <StoreCartGroup
          key={storeGroup.data.storeId}
          storeGroup={storeGroup}
          onSelectItem={handleSelectItem}
          onSelectStore={handleSelectStore}
          onRemoveItem={handleRemoveItem}
          onQuantityChange={handleQuantityChange}
          onClearStore={handleClearStore}
        />
      ))}

      {/* 주문 요약 영역 */}
      <CartSummary cartItems={cartItems} onCheckout={handleCheckout} />

      {/* 로그인 유도 모달 */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
