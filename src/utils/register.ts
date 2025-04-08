// 회원가입 처리 유틸 함수
interface CustomerSignUpData {
  loginId: string;
  nickname: string;
  email: string;
  password: string;
  tel: string;
}

interface SignUpResponse {
  success: boolean;
  data: {
    customerId?: number;
    signUpTime?: string;
  };
}

export async function registerCustomer(
  data: CustomerSignUpData
): Promise<SignUpResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/customers/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (result.success === false) {
      throw new Error("회원가입에 실패했습니다.");
    }

    return result;
  } catch (error) {
    console.log("회원가입 실패: ", error);
    throw error;
  }
}
