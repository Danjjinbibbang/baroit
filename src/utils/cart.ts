import { CartItem, StoreCartGroup, AddToCartItem } from "@/types/cart";
import { checkIsAuthenticated } from "@/zustand/auth";

// 장바구니 항목을 스토어별로 그룹화하는 함수
export function groupCartItemsByStore(cartItems: CartItem[]): StoreCartGroup[] {
  // 스토어 ID를 기준으로 그룹화
  const storeMap = new Map<string, CartItem[]>();

  cartItems.forEach((item) => {
    if (!storeMap.has(item.storeId)) {
      storeMap.set(item.storeId, []);
    }
    storeMap.get(item.storeId)?.push(item);
  });

  // StoreCartGroup 배열로 변환
  return Array.from(storeMap.entries()).map(([storeId, items]) => {
    const isAllSelected = items.every((item) => item.isSelected);
    return {
      storeId,
      storeName: items[0].storeName, // 모든 아이템이 같은 스토어에 속하므로 첫 번째 아이템의 스토어 이름 사용
      items,
      isAllSelected,
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
export async function addToCart(item: AddToCartItem): Promise<boolean> {
  // 사용자 로그인 상태 확인
  const isLoggedIn = checkLoginStatus();

  if (!isLoggedIn) {
    // 로그인되지 않은 경우 로컬 스토리지에 임시 저장 (실제 구현에서는 사용하지 않음)
    return false;
  }

  // 로그인된 경우 서버 API 호출
  try {
    // 실제 구현에서는 API 호출 코드
    // const response = await fetch('/api/cart', { ... });
    return true;
  } catch (error) {
    console.error("장바구니 추가 실패:", error);
    return false;
  }
}

// 장바구니 항목 삭제 함수
export async function removeFromCart(cartItemId: string): Promise<boolean> {
  try {
    // 실제 구현에서는 API 호출 코드
    // const response = await fetch(`/api/cart/${cartItemId}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error("장바구니 항목 삭제 실패:", error);
    return false;
  }
}

// 장바구니 수량 변경 함수
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<boolean> {
  try {
    // 실제 구현에서는 API 호출 코드
    // const response = await fetch(`/api/cart/${cartItemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) });
    return true;
  } catch (error) {
    console.error("장바구니 수량 변경 실패:", error);
    return false;
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
