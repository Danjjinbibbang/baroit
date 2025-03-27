// 상품 관련 API 유틸리티 함수들

export interface ProductCreateRequest {
  name: string;
  description: string;
  displayCategoryId: number;
  storeCategoryIds: number[];
  saleStatus: "ON_SALE" | "OFF_SALE" | "SOLD_OUT"; // 예: 추가 상태 있을 경우 확장 가능
  salePeriod: {
    startDate: string; // ISO 형식 (예: "2025-04-01T00:00:00")
    endDate: string;
  };
  optionGroups: OptionGroup[];
}

export interface OptionGroup {
  name: string; // ex: "컬러", "사이즈"
  options: ProductOption[];
}

export interface ProductOption {
  values: string[]; // 단일 옵션이라도 배열로 구성됨
  originalPrice: number;
  sellingPrice: number;
  stock: number;
  reorderMultiple: number;
  minPurchaseQty: number;
  maxPurchaseQty: number;
  active: boolean;
}

// 상품 등록
export async function postProduct(
  storeId: number,
  productData: ProductCreateRequest
): Promise<Response> {
  const res = await fetch(`/api/stores/${storeId}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "상품 등록에 실패했습니다.");
  }

  return res;
}
