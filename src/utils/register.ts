// 회원가입 처리 유틸 함수
interface CustomerSignUpData {
  loginId: string;
  nickname: string;
  email: string;
  password: string;
  tel: string;
}

interface SignUpResponse {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }

    const result = await response.json();

    return {
      data: {
        customerId: result.customerId,
        signUpTime: result.signUpTime,
      },
    };
  } catch (error) {
    console.log("회원가입 실패: ", error);
    return { data: { customerId: undefined } };
  }
}
