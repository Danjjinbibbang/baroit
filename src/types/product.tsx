// 임시 카테고리 데이터
export interface Product {
  id: number;
  storeId: number;
  name: string;
  storeName?: string; // UI 표시 용도
  description: string;
  registeredId: string;
  fulfillmentMethod: string;
  hasOption: boolean;
  originalPrice: number;
  sellingPrice: number;
  displayCategoryId: number;
  storeCategoryIds: number[];
  options: ProductOption[];
  variants: ProductVariant[];
  discountRate?: number; // UI 표시 용도
  stock: number | null;
  imageKey?: string; // UI 표시 용도
  images?: string[]; // UI 표시 용도
  certifications?: string[]; // UI 표시 용도
  notice?: string; // UI 표시 용도
  detailDescription?: string; // UI 표시 용도
  returnPolicy?: string; // UI 표시 용도
  minPurchaseQuantity?: number; // UI 표시 용도
  maxPurchaseQuantity?: number; // UI 표시 용도
  unit?: string; // UI 표시 용도
}

// 상품 타입 정의
export interface OptionValue {
  optionValueId: number;
  value: string;
}

export interface ProductOption {
  optionId: number;
  optionName: string;
  values: OptionValue[];
}

export interface ProductVariant {
  id: number;
  displayName: string;
  originalPrice: number;
  sellingPrice: number;
  stock: number;
}
