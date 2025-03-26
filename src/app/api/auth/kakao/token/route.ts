import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 요청 본문에서 인증 코드 추출
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "인증 코드가 없습니다" },
        { status: 400 }
      );
    }

    // 환경 변수에서 카카오 API 키 가져오기
    const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    // 카카오 OAuth 토큰 엔드포인트 URL
    const tokenUrl = "https://kauth.kakao.com/oauth/token";

    // 토큰 요청을 위한 폼 데이터 준비
    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", KAKAO_REST_API_KEY || "");
    formData.append("redirect_uri", REDIRECT_URI || "");
    formData.append("code", code);

    // 카카오 API에 토큰 요청
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: formData.toString(),
    });

    // 토큰 응답 확인
    if (!response.ok) {
      const error = await response.text();
      console.error("카카오 토큰 요청 실패:", error);
      return NextResponse.json(
        { error: "토큰 요청 실패" },
        { status: response.status }
      );
    }

    // 토큰 응답 파싱
    const tokenResponse = await response.json();

    // 액세스 토큰으로 사용자 정보 요청
    const userInfoResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    if (!userInfoResponse.ok) {
      console.error("카카오 사용자 정보 요청 실패");
      return NextResponse.json(
        { error: "사용자 정보 요청 실패" },
        { status: userInfoResponse.status }
      );
    }

    // 사용자 정보 파싱
    const userInfo = await userInfoResponse.json();

    // 세션 저장 로직을 구현할 수 있습니다
    // 예: cookies나 서버 세션 스토어에 사용자 정보 저장

    // 응답으로 사용자 정보 반환
    return NextResponse.json({
      success: true,
      user: {
        id: userInfo.id,
        nickname: userInfo.properties?.nickname || "",
        email: userInfo.kakao_account?.email || "",
        profileImage: userInfo.properties?.profile_image || "",
      },
    });
  } catch (error) {
    console.error("카카오 인증 처리 중 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
