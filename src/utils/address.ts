//import { Address } from "@/types/address";

import { useAuthStore } from "@/zustand/auth";

interface Address {
  detailed: string;
  alias: string;
  riderMessage: string | null;
  entrancePassword: string | null;
  deliveryGuideMessage: string;
  road?: string;
  jibun?: string;
  latitude?: number;
  longitude?: number;
}

// 고객 주소지 생성
export async function createAddress(address: Address) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/addresses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
      credentials: "include", // 쿠키를 첨부하기 위한 설정
    }
  );

  if (!response.ok) {
    throw new Error("주소지 생성에 실패했습니다.");
  }

  return response.json();
}

// 고객 주소지 목록 조회
export async function getAddresses() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/addresses/all`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 첨부하기 위한 설정
    }
  );

  if (response.status === 401) {
    console.log("401 발생, 세션 만료");
    useAuthStore.getState().logout();
    window.location.href = "/login";
    throw new Error("세션 만료");
  }
  if (!response.ok) {
    throw new Error("주소지 목록 조회에 실패했습니다.");
  }

  return response.json();
}

// 고객 주소지 상세 조회
export async function getAddress(addressId: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/addresses/${addressId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 첨부하기 위한 설정
    }
  );

  if (!response.ok) {
    throw new Error("주소지 상세 조회에 실패했습니다.");
  }

  return response.json();
}

// 고객 주소지 수정
export async function updateAddress(addressId: number, address: Address) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/addresses/${addressId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("주소지 수정에 실패했습니다.");
    }

    return response.json();
  } catch (error) {
    console.error("주소지 수정 오류:", error);
    throw new Error("주소지 수정에 실패했습니다.");
  }
}

// 고객 주소지 삭제
export async function deleteAddress(addressId: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/addresses/${addressId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("주소지 삭제에 실패했습니다.");
  }

  return response.json();
}

// 고객 기본 주소지 설정
export async function setDefaultAddress(addressId: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/customers/addresses/${addressId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("기본 주소지 설정에 실패했습니다.");
  }
}
