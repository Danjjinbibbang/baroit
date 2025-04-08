import { useAuthStore } from "@/zustand/auth";

// 고객 인증 관련 인터페이스
interface LoginData {
  loginId: string;
  password: string;
}

interface LoginResponse {
  name: string;
}

interface CustomerProfile {
  customerId: number;
  loginId: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
  socialAccounts: string[];
}

interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  uploadUrl: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// 로그인 함수
export async function loginCustomer(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/customers/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // 쿠키를 받기 위한 설정
    }
  );

  if (!response.ok) {
    throw new Error("로그인에 실패했습니다.");
  }

  const responseData = await response.json();

  // 세션 쿠키는 자동으로 브라우저에 저장됨
  // 사용자 정보 가져오기
  try {
    const profileResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/profile`,
      {
        credentials: "include",
      }
    );

    if (profileResponse.ok) {
      const userData = await profileResponse.json();

      // Zustand 스토어에 사용자 정보 저장
      useAuthStore.getState().login({
        id: userData.customerId.toString(),
        loginId: userData.loginId,
        name: userData.name,
        email: userData.email,
        tel: userData.phoneNumber,
        profileImageUrl: userData.profileImageUrl,
      });
    }
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error);
  }

  return responseData;
}

// 현재 로그인된 사용자 정보 가져오기
export function getCurrentUser() {
  return useAuthStore.getState().user;
}

// 프로필 정보 조회
export async function getCustomerProfile(): Promise<CustomerProfile> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("프로필 정보 조회에 실패했습니다.");
  }

  return response.json();
}

// 프로필 이미지 업로드 URL 발급
export async function getProfileImageUploadUrl(
  data: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/profile-image/upload-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("업로드 URL 발급에 실패했습니다.");
  }

  return response.json();
}

// 프로필 이미지 등록
export async function registerProfileImage(imageUrl: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/profile-image`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    }
  );

  if (!response.ok) {
    throw new Error("프로필 이미지 등록에 실패했습니다.");
  }
}

// 비밀번호 변경
export async function changePassword(data: PasswordChangeData): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/my/password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("비밀번호 변경에 실패했습니다.");
  }
}

// 닉네임 변경
export async function changeNickname(newName: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/profile/nickname`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newName }),
    }
  );

  if (!response.ok) {
    throw new Error("닉네임 변경에 실패했습니다.");
  }
}
