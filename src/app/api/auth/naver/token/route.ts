// 네이버 로그인 토큰 발급

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 요청 본문에서 인증 코드와 상태 값 추출
    const { code, state } = await req.json();

    if (!code || !state) {
      return NextResponse.json(
        { error: "인증 코드 또는 상태 값이 없습니다" },
        { status: 400 }
      );
    }

    // 환경 변수에서 네이버 API 키 가져오기
    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_APP_KEY;
    const NAVER_CLIENT_SECRET = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET; // 서버 측 환경 변수
    const REDIRECT_URI = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;

    // 네이버 OAuth 토큰 엔드포인트 URL
    const tokenUrl = "https://nid.naver.com/oauth2.0/token";

    // 토큰 요청 URL 구성
    const tokenRequestUrl = `${tokenUrl}?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}&state=${state}`;

    // 네이버 API에 토큰 요청
    const response = await fetch(tokenRequestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    // 토큰 응답 확인
    if (!response.ok) {
      const error = await response.text();
      console.error("네이버 토큰 요청 실패:", error);
      return NextResponse.json(
        { error: "토큰 요청 실패" },
        { status: response.status }
      );
    }

    // 토큰 응답 파싱
    const tokenResponse = await response.json();

    // 액세스 토큰으로 사용자 정보 요청
    const userInfoResponse = await fetch(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      console.error("네이버 사용자 정보 요청 실패");
      return NextResponse.json(
        { error: "사용자 정보 요청 실패" },
        { status: userInfoResponse.status }
      );
    }

    // 사용자 정보 파싱
    const userInfoData = await userInfoResponse.json();

    // 네이버는 응답을 response 객체 내에 넣어서 반환
    if (userInfoData.resultcode !== "00") {
      return NextResponse.json(
        { error: "사용자 정보 요청 실패: " + userInfoData.message },
        { status: 400 }
      );
    }

    const userInfo = userInfoData.response;

    // 세션 저장 로직을 구현할 수 있습니다
    // 예: cookies나 서버 세션 스토어에 사용자 정보 저장

    // 응답으로 사용자 정보 반환
    return NextResponse.json({
      success: true,
      user: {
        id: userInfo.id,
        name: userInfo.name,
        nickname: userInfo.nickname,
        email: userInfo.email,
        profileImage: userInfo.profile_image,
      },
    });
  } catch (error) {
    console.error("네이버 인증 처리 중 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
