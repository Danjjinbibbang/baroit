"use client";

import React, { useState } from "react";
import { Save, Edit, Clock, Store, Phone, Calendar, Info } from "lucide-react";

// 가게 정보 타입 정의
interface StoreInfo {
  name: string;
  introduction: string;
  businessHours: string;
  closedDays: string;
  phoneNumber: string;
  address: string;
  logoImage: string;
  bannerImage: string;
}

export default function Management() {
  // 초기 가게 정보 상태
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "바로잇 푸드",
    introduction: "신선한 식재료로 만든 건강한 음식을 제공합니다.",
    businessHours: "10:00 - 21:00",
    closedDays: "매주 월요일",
    phoneNumber: "02-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
    logoImage: "",
    bannerImage: "",
  });

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  // 임시 저장 상태 (편집 중인 데이터)
  const [tempStoreInfo, setTempStoreInfo] = useState<StoreInfo>(storeInfo);
  // 활성 탭 상태
  const [activeTab, setActiveTab] = useState<"basic" | "hours">("basic");

  // 편집 취소 핸들러
  const handleCancel = () => {
    setIsEditing(false);
    setTempStoreInfo(storeInfo);
  };

  // 저장 핸들러
  const handleSave = () => {
    setStoreInfo(tempStoreInfo);
    setIsEditing(false);
  };

  // 입력 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "logoImage" | "bannerImage"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempStoreInfo((prev) => ({
          ...prev,
          [imageType]: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">가게 정보 관리</h1>
        {!isEditing ? (
          <button
            className="px-3 py-1.5 border rounded-md text-sm flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4" />
            정보 수정
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 border rounded-md text-sm flex items-center gap-1 hover:bg-gray-50"
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              className="px-3 py-1.5 border rounded-md text-sm flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          </div>
        )}
      </header>

      {/* 탭 네비게이션 */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === "basic"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("basic")}
        >
          <div className="flex items-center gap-1">
            <Store className="w-4 h-4" />
            가게 기본 정보
          </div>
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === "hours"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("hours")}
        >
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            운영 정보
          </div>
        </button>
      </div>

      {/* 가게 기본 정보 탭 */}
      {activeTab === "basic" && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 가게 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Store className="w-4 h-4" />
                  상호명
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={tempStoreInfo.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {storeInfo.name}
                </div>
              )}
            </div>

            {/* 가게 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  주소
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={tempStoreInfo.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {storeInfo.address}
                </div>
              )}
            </div>
          </div>

          {/* 가게 소개 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <Info className="w-4 h-4" />
                가게 소개
              </div>
            </label>
            {isEditing ? (
              <textarea
                name="introduction"
                value={tempStoreInfo.introduction}
                onChange={handleChange}
                className="w-full p-2 border rounded-md h-24"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md min-h-[4rem]">
                {storeInfo.introduction}
              </div>
            )}
          </div>

          {/* 이미지 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 로고 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가게 로고 이미지
              </label>
              {isEditing ? (
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  {tempStoreInfo.logoImage ? (
                    <div className="relative">
                      <img
                        src={tempStoreInfo.logoImage}
                        alt="로고"
                        className="max-h-40 mx-auto"
                      />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() =>
                          setTempStoreInfo({
                            ...tempStoreInfo,
                            logoImage: "",
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-500 mb-2">
                        로고 이미지를 업로드하세요
                      </div>
                      <label className="px-4 py-2 bg-blue-50 text-blue-500 rounded-md cursor-pointer hover:bg-blue-100">
                        이미지 선택
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "logoImage")}
                        />
                      </label>
                    </>
                  )}
                </div>
              ) : (
                <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center h-40">
                  {storeInfo.logoImage ? (
                    <img
                      src={storeInfo.logoImage}
                      alt="로고"
                      className="max-h-32"
                    />
                  ) : (
                    <div className="text-gray-400">로고 이미지 없음</div>
                  )}
                </div>
              )}
            </div>

            {/* 배너 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가게 배너 이미지
              </label>
              {isEditing ? (
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  {tempStoreInfo.bannerImage ? (
                    <div className="relative">
                      <img
                        src={tempStoreInfo.bannerImage}
                        alt="배너"
                        className="max-h-40 mx-auto"
                      />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() =>
                          setTempStoreInfo({
                            ...tempStoreInfo,
                            bannerImage: "",
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-500 mb-2">
                        배너 이미지를 업로드하세요
                      </div>
                      <label className="px-4 py-2 bg-blue-50 text-blue-500 rounded-md cursor-pointer hover:bg-blue-100">
                        이미지 선택
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "bannerImage")}
                        />
                      </label>
                    </>
                  )}
                </div>
              ) : (
                <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center h-40">
                  {storeInfo.bannerImage ? (
                    <img
                      src={storeInfo.bannerImage}
                      alt="배너"
                      className="max-h-32"
                    />
                  ) : (
                    <div className="text-gray-400">배너 이미지 없음</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 운영 정보 탭 */}
      {activeTab === "hours" && (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 영업 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  운영 시간
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="businessHours"
                  value={tempStoreInfo.businessHours}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="예: 09:00 - 18:00"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {storeInfo.businessHours}
                </div>
              )}
            </div>

            {/* 휴무일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  휴무일
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="closedDays"
                  value={tempStoreInfo.closedDays}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="예: 매주 월요일, 공휴일"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {storeInfo.closedDays}
                </div>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  전화번호
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={tempStoreInfo.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="예: 02-1234-5678"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {storeInfo.phoneNumber}
                </div>
              )}
            </div>
          </div>

          {/* 운영 가이드 */}
          <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-600">
            <h3 className="font-medium mb-2">운영 정보 안내</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>운영 시간은 고객에게 표시되는 영업 시간입니다.</li>
              <li>
                휴무일을 명확하게 기재하면 불필요한 문의를 줄일 수 있습니다.
              </li>
              <li>전화번호는 하이픈(-)을 포함한 전체 번호를 입력해주세요.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
