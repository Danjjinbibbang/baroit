import { create } from "zustand";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // 액션
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

// 인증 확인 함수 - 쿠키 존재 여부도 확인
export const checkIsAuthenticated = (): boolean => {
  // 1. Zustand 스토어 확인
  const { isAuthenticated } = useAuthStore.getState();

  if (isAuthenticated) return true;

  // 2. 쿠키 확인 (세션 쿠키)
  const hasCookie = checkSessionCookie();

  // 쿠키가 있으면 사용자 정보 가져오기
  if (hasCookie) {
    fetchUserInfo().catch(() => {
      // 쿠키는 있지만 API 호출 실패 시 로그아웃 처리
      useAuthStore.getState().logout();
    });
  }

  return hasCookie;
};

// 세션 쿠키 확인 함수
const checkSessionCookie = (): boolean => {
  if (typeof document === "undefined") return false; // SSR 환경에서 실행 방지

  // 세션 쿠키 확인 (세션 쿠키 이름은 실제 사용하는 이름으로 변경)
  return document.cookie
    .split(";")
    .some(
      (cookie) =>
        cookie.trim().startsWith("sessionId=") ||
        cookie.trim().startsWith("JSESSIONID=")
    );
};

// 사용자 정보 가져오기 함수
const fetchUserInfo = async (): Promise<void> => {
  try {
    // API를 호출하여 현재 로그인한 사용자 정보 가져오기
    const response = await fetch("/api/users/customers/my/profile");

    if (!response.ok) {
      throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    }

    const userData = await response.json();

    // Zustand 스토어에 사용자 정보 저장
    useAuthStore.getState().login({
      id: userData.customerId.toString(),
      loginId: userData.loginId,
      name: userData.name,
      email: userData.email,
      tel: userData.phoneNumber,
      profileImageUrl: userData.profileImageUrl,
    });
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
    throw error;
  }
};
