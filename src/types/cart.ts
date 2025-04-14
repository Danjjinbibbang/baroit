// 장바구니 상품 추가 시 사용하는 인터페이스
export interface CartItems {
  itemId: number;
  itemName: string;
  itemType: string;
  imageUrl: string;
  originalPrice: number;
  sellingPrice: number;
  quantity: number;
  isSelected?: boolean;
  isSoldOut?: boolean;
  isDeleted?: boolean;
  stock?: number;
}

// UI에서 사용할 카트 아이템 (서버 데이터 + 클라이언트 상태)
export interface UiCartItem {
  itemId: number;
  itemName: string;
  storeId: number;
  storeName: string;
  price: number;
  discountRate?: number;
  imageUrl: string;
  quantity: number;
  isSelected: boolean; // 클라이언트 상태
  stock: number; // 재고 정보
  isSoldOut: boolean; // 품절 여부
  isDeleted: boolean; // 삭제 여부
  image?: string; // 호환성을 위한 필드
  name?: string; // 호환성을 위한 필드
  options?: Record<string, string>; // 상품 옵션
}

// 스토어별로 그룹화된 장바구니 아이템
// 장바구니 조회 시
export interface StoreCartGroupType {
  success: boolean;
  data: {
    storeId: number;
    customerId: number;
    totalOriginalPrice: number;
    totalSellingPrice: number;
    totalDiscountPrice: number;
    cartItems: CartItems[];
  };
}

// 고객 체크아웃용 장바구니 아이템
export interface CartItem extends UiCartItem {
  id: number; // 이전 코드와의 호환성을 위한 필드
}

// 장바구니에 상품 추가 시 필요한 데이터
export interface AddToCartItem {
  itemId: number;
  itemName: string;
  itemType: string;
  imageKey: string;
  originalPrice: number;
  sellingPrice: number;
  quantity: number;
}

export interface UiAddCartItem extends AddToCartItem {
  options?: Record<string, string>;
}
