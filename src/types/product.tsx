// 임시 카테고리 데이터
export interface Product {
  id: number;
  name: string;
  price: number;
  discountRate: number;
  image: string;
  description: string;
  category: string;
  originalPrice?: number;
}
