export interface AddressRequest {
  name: string;
  recipient: string;
  postalCode: string;
  address1: string;
  address2: string;
  phoneNumber: string;
  isDefault: boolean;
}

// 사용자 타입
export interface User {
  id: string;
  loginId: string;
  nickname: string;
  email: string;
  tel: string;
  profileImageUrl?: string;
}

// 회원가입 데이터
export interface CustomerSignUpData {
  loginId: string;
  nickname: string;
  email: string;
  password: string;
  tel: string;
}

// 로그인 데이터
export interface LoginData {
  loginId: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  name: string;
  // 기타 세션/쿠키 관련 응답이 있다면 추가
}
