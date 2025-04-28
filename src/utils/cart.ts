import { CartItem, StoreCartGroupType, AddToCartItem } from "@/types/cart";
import { checkIsAuthenticated, useAuthStore } from "@/zustand/auth";

// 장바구니 항목을 스토어별로 그룹화하는 함수
export function groupCartItemsByStore(
  cartItems: CartItem[]
): StoreCartGroupType[] {
  // 스토어 ID를 기준으로 그룹화
  const storeMap = new Map<number, CartItem[]>();

  cartItems.forEach((item) => {
    const storeId = Number(item.storeId);
    if (!storeMap.has(storeId)) {
      storeMap.set(storeId, []);
    }
    storeMap.get(storeId)?.push(item);
  });

  // StoreCartGroup 배열로 변환
  return Array.from(storeMap.entries()).map(([storeId, items]) => {
    // 가격 계산
    const totalOriginalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const totalSellingPrice = items.reduce((sum, item) => {
      const sellingPrice = calculateDiscountPrice(
        item.price,
        item.discountRate
      );
      return sum + sellingPrice * item.quantity;
    }, 0);

    const totalDiscountPrice = totalOriginalPrice - totalSellingPrice;

    // CartItems 형식으로 변환
    const cartItems = items.map((item) => ({
      itemId: Number(item.id),
      itemName: item.name,
      itemType: "PRODUCT",
      imageUrl: item.image,
      originalPrice: item.price,
      sellingPrice: calculateDiscountPrice(item.price, item.discountRate),
      quantity: item.quantity,
    }));

    return {
      success: true,
      data: {
        storeId: storeId,
        customerId: 0, // 임시값, 실제로는 로그인한 사용자 ID를 사용해야 함
        totalOriginalPrice,
        totalSellingPrice,
        totalDiscountPrice,
        cartItems,
      },
    };
  });
}

// 할인가 계산 함수
export function calculateDiscountPrice(
  price: number,
  discountRate?: number
): number {
  if (!discountRate) return price;
  return Math.floor(price * (1 - discountRate / 100));
}

// 장바구니에 상품 추가 함수 (실제로는 API 호출이 있어야 함)
export async function addToCart(
  item: AddToCartItem,
  storeId: number
): Promise<boolean> {
  // 사용자 로그인 상태 확인
  const isLoggedIn = checkLoginStatus();

  if (!isLoggedIn) {
    // 로그인되지 않은 경우 로컬 스토리지에 임시 저장 (실제 구현에서는 사용하지 않음)
    return false;
  }

  // 로그인된 경우 서버 API 호출
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts/stores/${storeId}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
        credentials: "include",
      }
    );
    return response.ok;
  } catch (error) {
    console.error("장바구니 추가 실패:", error);
    return false;
  }
}

// 장바구니 항목 삭제 함수
export async function removeFromCart(
  storeId: number,
  itemId: number
): Promise<boolean> {
  try {
    // 실제 구현에서는 API 호출 코드
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts/stores/${storeId}/items`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
        credentials: "include",
      }
    );
    return response.ok;
  } catch (error) {
    console.error("장바구니 항목 삭제 실패:", error);
    return false;
  }
}

// 장바구니 수량 변경 함수
export async function updateCartItemQuantity(
  quantity: number,
  storeId: number,
  itemId: number
): Promise<boolean> {
  try {
    // 실제 구현에서는 API 호출 코드
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts/stores/${storeId}/items/quantity`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity }),
        credentials: "include",
      }
    );
    return response.ok;
  } catch (error) {
    console.error("장바구니 수량 변경 실패:", error);
    return false;
  }
}

// 가게 장바구니 비우기
export async function clearStoreCart(storeId: number): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts/stores/${storeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return response.ok;
  } catch (error) {
    console.error("가게 장바구니 비우기 실패:", error);
    return false;
  }
}

// 가게 장바구니 조회
export async function getStoreCart(
  storeId: number
): Promise<StoreCartGroupType[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/carts/stores/${storeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.status === 401) {
      console.log("401 발생, 세션 만료");
      useAuthStore.getState().logout();
      window.location.href = "/login";
      throw new Error("세션 만료");
    }
    return response.json();
  } catch (error) {
    console.error("가게 장바구니 조회 실패:", error);
    return [];
  }
}

// 로그인 상태 확인 함수
export function checkLoginStatus(): boolean {
  return checkIsAuthenticated();
}

// 장바구니에 오래된 항목(30일)을 확인하고 필터링하는 함수
export function filterExpiredCartItems(cartItems: CartItem[]): CartItem[] {
  const now = new Date();
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

  return cartItems.filter((item) => {
    const addedDate = new Date(item.addedAt);
    const ageInMs = now.getTime() - addedDate.getTime();
    return ageInMs < thirtyDaysInMs;
  });
}
