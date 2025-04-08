// 장바구니 관련 타입 정의

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  storeId: string;
  storeName: string;
  price: number;
  discountRate?: number;
  image: string;
  quantity: number;
  options?: { [key: string]: string };
  isSelected: boolean;
  stock: number;
  isSoldOut: boolean;
  isDeleted: boolean;
  addedAt: Date; // 장바구니에 추가된 날짜 (30일 후 자동 삭제용)
}

// 스토어별로 그룹화된 장바구니 아이템
export interface StoreCartGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
  isAllSelected: boolean;
}

// 로그인 상태에 관계없이 장바구니에 담을 때 사용하는 인터페이스
export interface AddToCartItem {
  productId: string;
  quantity: number;
  options?: { [key: string]: string };
}
