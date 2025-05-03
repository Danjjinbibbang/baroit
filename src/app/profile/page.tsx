"use client";

import { useState, useEffect } from "react";
import { getCustomerProfile, changeNickname, Postlogout } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit2, Check, X } from "lucide-react";
import { useAuthStore } from "@/zustand/auth";
import Header from "@/components/layout/Header";

// API 응답 형태 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
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

export default function ProfilePage() {
  const { logout } = useAuthStore();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 닉네임 수정 관련 상태
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [updatingNickname, setUpdatingNickname] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        console.log("프로필 조회 시작");

        // API 호출
        const response =
          (await getCustomerProfile()) as unknown as ApiResponse<CustomerProfile>;
        console.log("API 응답 전체:", JSON.stringify(response, null, 2));

        if (response.success && response.data) {
          console.log("프로필 데이터:", response.data);
          setProfile(response.data);
          setNewNickname(response.data.nickname || "");
          setError(null);
        } else {
          console.error("API 응답 형식이 올바르지 않음:", response);
          throw new Error("프로필 정보 형식이 올바르지 않습니다.");
        }
      } catch (err) {
        console.error("프로필 조회 실패:", err);
        setError("프로필 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      setUpdatingNickname(true);
      await changeNickname(newNickname);

      // 프로필 업데이트
      if (profile) {
        setProfile({
          ...profile,
          nickname: newNickname,
        });
      }

      setIsEditingNickname(false);
      alert("닉네임 변경 완료");
    } catch (err) {
      console.error("닉네임 변경 실패:", err);
      alert("닉네임 변경 실패");
    } finally {
      setUpdatingNickname(false);
    }
  };

  const cancelNicknameEdit = () => {
    setIsEditingNickname(false);
    if (profile) {
      setNewNickname(profile.nickname);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">프로필 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 border rounded-lg bg-red-50 text-center">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 border rounded-lg bg-yellow-50 text-center">
        <p className="text-yellow-600">로그인이 필요합니다.</p>
      </div>
    );
  }

  const handleLogout = async () => {
    const confirmed = window.confirm("정말 로그아웃하시겠습니까?");
    if (confirmed) {
      try {
        await Postlogout(); // 로그아웃
      } catch (error) {
        console.log("로그아웃 실패: ", error);
      }

      logout(); // zustand에 있는 로그아웃 -> 로컬 스토리지에서 삭제
      window.location.href = "/"; // 홈으로 이동
    }
  };
  // 디버깅: 프로필 데이터 출력
  console.log("렌더링 시 프로필 데이터:", profile);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm border-b">
        <Header />
      </header>
      <div className="max-w-3xl mx-auto mt-10 p-8 border rounded-lg bg-white max-h-[80vh] overflow-y-auto scroll-custom">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-8">내 정보</h1>
          <Button variant="destructive" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-32 w-32 mb-4">
            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt="프로필 이미지"
                className="rounded-full object-cover"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-bold">
                  {profile.nickname?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 닉네임 */}
        <div className="mb-6">
          <Label className="text-sm text-gray-500 mb-1 block">닉네임</Label>
          {isEditingNickname ? (
            <div className="flex items-center gap-2">
              <Input
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="flex-1"
                placeholder="새 닉네임"
              />
              <Button
                size="icon"
                onClick={handleUpdateNickname}
                disabled={updatingNickname}
              >
                {updatingNickname ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={cancelNicknameEdit}
                disabled={updatingNickname}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg">{profile.nickname || "-"}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNickname(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                수정
              </Button>
            </div>
          )}
        </div>

        {/* 기본 정보 */}
        <div className="space-y-6">
          <div>
            <Label className="text-sm text-gray-500 mb-1 block">아이디</Label>
            <p className="text-lg">{profile.loginId}</p>
          </div>

          <div>
            <Label className="text-sm text-gray-500 mb-1 block">이메일</Label>
            <p className="text-lg">{profile.email || "-"}</p>
          </div>

          <div>
            <Label className="text-sm text-gray-500 mb-1 block">전화번호</Label>
            <p className="text-lg">{profile.phoneNumber || "-"}</p>
          </div>

          {/* 연동된 소셜 계정 */}
          <div>
            <Label className="text-sm text-gray-500 mb-1 block">
              연동된 계정
            </Label>
            <div className="flex gap-3 mt-2">
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  profile.socialAccounts?.includes("kakao")
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                카카오{" "}
                {profile.socialAccounts?.includes("kakao")
                  ? "연동됨"
                  : "미연동"}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  profile.socialAccounts?.includes("naver")
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                네이버{" "}
                {profile.socialAccounts?.includes("naver")
                  ? "연동됨"
                  : "미연동"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
