"use client";

import React, { useState } from "react";
import {
  Save,
  Edit,
  Clock,
  Store,
  Phone,
  Calendar,
  Info,
  MapPin,
} from "lucide-react";
import { AddressSearch } from "@/components/address/AddressSearch";
import {
  DayOfWeek,
  BusinessHours,
  updateBusinessHours,
  updateStoreStatus,
  createHomeCategory,
  getHomeCategories,
  deleteHomeCategory,
  updateHomeCategory,
} from "@/utils/store";
import { Button } from "@/components/ui/button";

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

interface Store {
  id: number;
  name: string;
  detailed: string;
  tel: string;
  bizNumber: string;
  addressCode: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
  jibun: string;
  road: string;
  orderType: "DELIVERY" | "PICKUP" | "BOTH";
  deliveryType: "SELF" | "AGENCY" | "BOTH";
  minOrderPrice: number;
}

interface AddressSearchResult {
  addressCode: string;
  jibun: string;
  road: string;
  latitude: number;
  longitude: number;
}

interface AddressData {
  zonecode: string;
  jibunAddress: string;
  roadAddress: string;
  latitude?: number;
  longitude?: number;
}

interface StoreInfo extends Omit<Store, "id"> {
  // businessHours와 closedDays 제거
}

// 가게 상태 타입 정의
type StoreStatus = "ACTIVE" | "INACTIVE";

export default function Management() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "basic" | "hours" | "status" | "home-categories"
  >("basic");

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "",
    detailed: "",
    tel: "",
    bizNumber: "",
    addressCode: "",
    addressDetail: "",
    latitude: 0,
    longitude: 0,
    jibun: "",
    road: "",
    orderType: "DELIVERY",
    deliveryType: "SELF",
    minOrderPrice: 15000,
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    mode: "PER_DAY",
    timeSlots: {
      MONDAY: { startTime: "10:00", endTime: "20:00" },
      TUESDAY: { startTime: "10:00", endTime: "20:00" },
      WEDNESDAY: { startTime: "10:00", endTime: "20:00" },
      THURSDAY: { startTime: "10:00", endTime: "20:00" },
      FRIDAY: { startTime: "10:00", endTime: "20:00" },
      SATURDAY: { startTime: "11:00", endTime: "18:00" },
      SUNDAY: { startTime: "12:00", endTime: "17:00" },
    },
  });

  // 가게 상태를 별도의 상태로 관리
  const [storeStatus, setStoreStatus] = useState<StoreStatus>("ACTIVE");

  const dayLabels: Record<DayOfWeek, string> = {
    MONDAY: "월요일",
    TUESDAY: "화요일",
    WEDNESDAY: "수요일",
    THURSDAY: "목요일",
    FRIDAY: "금요일",
    SATURDAY: "토요일",
    SUNDAY: "일요일",
  };

  // 필요한 상태들 추가
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [homeCategories, setHomeCategories] = useState<HomeCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryOrder, setNewCategoryOrder] = useState(1);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  // 주소 검색 결과 처리
  const handleAddressSelect = (address: AddressData) => {
    setStoreInfo((prev) => ({
      ...prev,
      addressCode: address.zonecode,
      jibun: address.jibunAddress,
      road: address.roadAddress,
      latitude: address.latitude || 0,
      longitude: address.longitude || 0,
    }));
    setShowAddressSearch(false);
  };

  // 가게 선택 시 store 정보 세팅은 그대로 유지하되, businessHours도 따로 불러와야 함
  const handleStoreSelect = async (storeId: number) => {
    setSelectedStoreId(storeId);
    const store = stores.find((s) => s.id === storeId);

    if (store) {
      setStoreInfo({
        name: store.name,
        detailed: store.detailed,
        tel: store.tel,
        bizNumber: store.bizNumber,
        addressCode: store.addressCode,
        addressDetail: store.addressDetail,
        latitude: store.latitude,
        longitude: store.longitude,
        jibun: store.jibun,
        road: store.road,
        orderType: store.orderType,
        deliveryType: store.deliveryType,
        minOrderPrice: store.minOrderPrice,
      });

      // 영업시간도 별도로 로드 (예시)
      try {
        // 실제로는 fetchBusinessHours 같은 함수를 utils/store.ts에 추가하여 사용
        const hours = await fetch(`/api/stores/${storeId}/business-hours`).then(
          (res) => res.json()
        );
        setBusinessHours(hours);
      } catch (error) {
        console.error("영업시간 로드 실패:", error);
      }

      // 가게 상태 로드
      try {
        const statusResponse = await fetch(`/api/stores/${storeId}/status`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setStoreStatus(statusData.status);
        }
      } catch (error) {
        console.error("가게 상태 로드 실패:", error);
      }
    }
  };

  // 가게 저장
  const handleSave = async () => {
    try {
      if (isAddingNew) {
        const response = await fetch("/api/stores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storeInfo),
        });

        if (!response.ok) throw new Error("가게 등록에 실패했습니다.");

        const newStore = await response.json();
        setStores((prev) => [...prev, newStore]);
      } else {
        const response = await fetch(`/api/stores/${selectedStoreId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storeInfo),
        });

        if (!response.ok) throw new Error("가게 정보 수정에 실패했습니다.");

        setStores((prev) =>
          prev.map((store) =>
            store.id === selectedStoreId ? { ...store, ...storeInfo } : store
          )
        );
      }

      setIsEditing(false);
      setIsAddingNew(false);
    } catch (error) {
      console.error("가게 저장 실패:", error);
      alert(error instanceof Error ? error.message : "저장에 실패했습니다.");
    }
  };

  // 영업시간 저장은 별도 함수로 유지
  const handleBusinessHoursSave = async () => {
    if (!selectedStoreId) return;

    try {
      await updateBusinessHours(selectedStoreId, businessHours);
      alert("영업시간이 저장되었습니다.");
    } catch (error) {
      console.error("영업시간 저장 실패:", error);
      alert(
        error instanceof Error ? error.message : "영업시간 저장에 실패했습니다."
      );
    }
  };

  // 가게 상태 저장 함수
  const handleStatusSave = async () => {
    if (!selectedStoreId) return;

    try {
      await updateStoreStatus(selectedStoreId, storeStatus);
      alert("가게 상태가 저장되었습니다.");
    } catch (error) {
      console.error("가게 상태 저장 실패:", error);
      alert(error instanceof Error ? error.message : "저장에 실패했습니다.");
    }
  };

  // 홈 카테고리 생성
  const handleAddCategory = async () => {
    if (!selectedStoreId) return;

    try {
      await createHomeCategory(selectedStoreId, {
        name: newCategoryName,
        displayOrder: newCategoryOrder,
      });

      setHomeCategories((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newCategoryName,
          displayOrder: newCategoryOrder,
        },
      ]);

      setNewCategoryName("");
      setNewCategoryOrder(1);
    } catch (error) {
      console.error("홈 카테고리 생성 실패:", error);
      alert(error instanceof Error ? error.message : "생성에 실패했습니다.");
    }
  };

  // 홈 카테고리 수정
  const handleEditCategory = async (categoryId: number) => {
    if (!selectedStoreId) return;

    try {
      await updateHomeCategory(selectedStoreId, categoryId, {
        name: newCategoryName,
        displayOrder: newCategoryOrder,
      });

      setHomeCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                name: newCategoryName,
                displayOrder: newCategoryOrder,
              }
            : category
        )
      );
      setIsEditingCategory(false);
      setEditingCategoryId(null);
    } catch (error) {
      console.error("홈 카테고리 수정 실패:", error);
      alert(error instanceof Error ? error.message : "수정에 실패했습니다.");
    }
  };

  // 홈 카테고리 삭제
  const handleDeleteCategory = async (categoryId: number) => {
    if (!selectedStoreId) return;

    try {
      await deleteHomeCategory(selectedStoreId, categoryId);
      setHomeCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("홈 카테고리 삭제 실패:", error);
      alert(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    }
  };

  // 영업시간 탭 내용 수정
  const renderHoursTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">요일별 영업시간 설정</h3>
        {isEditing && (
          <button
            onClick={handleBusinessHoursSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            영업시간 저장
          </button>
        )}
      </div>

      <div className="space-y-4">
        {(Object.keys(businessHours.timeSlots) as DayOfWeek[]).map((day) => (
          <div key={day} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-2 font-medium">{dayLabels[day]}</div>
            <div className="col-span-5">
              <input
                type="time"
                value={businessHours.timeSlots[day].startTime}
                onChange={(e) =>
                  setBusinessHours((prev) => ({
                    ...prev,
                    timeSlots: {
                      ...prev.timeSlots,
                      [day]: {
                        ...prev.timeSlots[day],
                        startTime: e.target.value,
                      },
                    },
                  }))
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="col-span-5">
              <input
                type="time"
                value={businessHours.timeSlots[day].endTime}
                onChange={(e) =>
                  setBusinessHours((prev) => ({
                    ...prev,
                    timeSlots: {
                      ...prev.timeSlots,
                      [day]: {
                        ...prev.timeSlots[day],
                        endTime: e.target.value,
                      },
                    },
                  }))
                }
                disabled={!isEditing}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">안내사항</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>영업시간은 24시간 형식으로 입력해주세요. (예: 09:00)</li>
          <li>휴무일은 시작 시간과 종료 시간을 비워두세요.</li>
          <li>변경사항은 반드시 저장 버튼을 눌러 적용해주세요.</li>
        </ul>
      </div>
    </div>
  );

  // 가게 상태 탭 렌더링 함수
  const renderStatusTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">가게 노출 상태 설정</h3>
        {isEditing && (
          <button
            onClick={handleStatusSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            상태 저장
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">노출 상태</label>

          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="status-active"
                name="store-status"
                value="ACTIVE"
                checked={storeStatus === "ACTIVE"}
                onChange={() => isEditing && setStoreStatus("ACTIVE")}
                disabled={!isEditing}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="status-active" className="text-sm">
                노출중
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="status-inactive"
                name="store-status"
                value="INACTIVE"
                checked={storeStatus === "INACTIVE"}
                onChange={() => isEditing && setStoreStatus("INACTIVE")}
                disabled={!isEditing}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="status-inactive" className="text-sm">
                노출중지
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-md mt-6">
          <h4 className="font-medium mb-2">가게 노출 상태 안내</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>
              <span className="font-medium">노출중</span>: 고객이 가게를
              검색하고 주문할 수 있습니다.
            </li>
            <li>
              <span className="font-medium">노출중지</span>: 고객에게 가게가
              표시되지 않으며 주문을 받을 수 없습니다.
            </li>
            <li>긴급 상황이나 영업 중단 시 노출중지로 설정하세요.</li>
            <li>노출중지 상태에서도 기존 주문 관리는 가능합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // 현재 위치를 받아와서 주소로 변환하는 함수
  const handleLocationDetected = async (location: {
    lat: number;
    lng: number;
  }) => {
    setIsLoadingAddress(true);
    setAddressError(null);

    try {
      const response = await fetch(
        `/api/address/reverse-geocode?lat=${location.lat}&lng=${location.lng}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "주소를 가져오는데 실패했습니다.");
      }

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const addressInfo = data.documents[0];
        let roadAddress = "";
        let jibunAddress = "";
        let latitude = location.lat;
        let longitude = location.lng;

        if (addressInfo.road_address) {
          roadAddress = addressInfo.road_address.address_name;
        }
        if (addressInfo.address) {
          jibunAddress = addressInfo.address.address_name;
        }

        setStoreInfo({
          ...storeInfo,
          road: roadAddress,
          jibun: jibunAddress,
          latitude: latitude,
          longitude: longitude,
        });
      } else {
        setAddressError("주소를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("주소 변환 오류:", error);
      setAddressError("주소를 가져오는데 실패했습니다.");
    } finally {
      setIsLoadingAddress(false);
      setShowAddressSearch(false);
    }
  };

  // 새 가게 등록 시 상태 초기화
  const handleNewStore = () => {
    setIsAddingNew(true);
    setSelectedStoreId(null);
    setIsEditing(true);
    setStoreInfo({
      name: "",
      detailed: "",
      tel: "",
      bizNumber: "",
      addressCode: "",
      addressDetail: "",
      latitude: 0,
      longitude: 0,
      jibun: "",
      road: "",
      orderType: "DELIVERY",
      deliveryType: "SELF",
      minOrderPrice: 15000,
    });
    setBusinessHours({
      mode: "PER_DAY",
      timeSlots: {
        // 기본 영업시간 설정
        MONDAY: { startTime: "10:00", endTime: "20:00" },
        TUESDAY: { startTime: "10:00", endTime: "20:00" },
        WEDNESDAY: { startTime: "10:00", endTime: "20:00" },
        THURSDAY: { startTime: "10:00", endTime: "20:00" },
        FRIDAY: { startTime: "10:00", endTime: "20:00" },
        SATURDAY: { startTime: "11:00", endTime: "18:00" },
        SUNDAY: { startTime: "12:00", endTime: "17:00" },
      },
    });
    setStoreStatus("ACTIVE"); // 기본값은 노출중
  };

  // 카테고리 탭 렌더링 함수
  const renderHomeCategoriesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">가게 홈 카테고리 관리</h3>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="카테고리 이름"
          className="w-full p-2 border rounded-md"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <input
          type="number"
          placeholder="디스플레이 순서"
          className="w-24 p-2 border rounded-md"
          value={newCategoryOrder}
          onChange={(e) => setNewCategoryOrder(Number(e.target.value))}
        />
        <button
          onClick={isEditingCategory ? handleEditCategory : handleAddCategory}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isEditingCategory ? "수정" : "추가"}
        </button>
      </div>

      <ul className="list-disc pl-5">
        {homeCategories.map((category) => (
          <li key={category.id} className="flex justify-between items-center">
            <span>
              {category.name} (순서: {category.displayOrder})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEditingCategory(true);
                  setEditingCategoryId(category.id);
                  setNewCategoryName(category.name);
                  setNewCategoryOrder(category.displayOrder);
                }}
                className="text-blue-500"
              >
                수정
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <header className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleNewStore}
            className="px-3 py-1.5 border rounded-md bg-green-50 text-green-600 hover:bg-green-100"
          >
            새 가게 등록
          </button>
        </div>

        {(selectedStoreId || isAddingNew) && !isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 border rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            정보 수정
          </button>
        ) : null}

        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                if (isAddingNew) {
                  setIsAddingNew(false);
                }
              }}
              className="px-3 py-1.5 border rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        )}
      </header>

      {(selectedStoreId || isAddingNew) && (
        <>
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
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === "status"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("status")}
            >
              <div className="flex items-center gap-1">
                <Info className="w-4 h-4" />
                가게 상태
              </div>
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === "home-categories"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("home-categories")}
            >
              <div className="flex items-center gap-1">
                <Store className="w-4 h-4" />홈 카테고리
              </div>
            </button>
          </div>

          {/* 기본 정보 탭 */}
          {activeTab === "basic" && (
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상호명
                  </label>
                  <input
                    type="text"
                    value={storeInfo.name}
                    onChange={(e) =>
                      setStoreInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    value={storeInfo.bizNumber}
                    onChange={(e) =>
                      setStoreInfo((prev) => ({
                        ...prev,
                        bizNumber: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              {/* 주소 정보 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={storeInfo.road}
                    readOnly
                    className="w-full p-2 border rounded-md"
                    placeholder="주소 검색"
                    onClick={() => isEditing && setShowAddressSearch(true)}
                  />
                  {isEditing && (
                    <button
                      onClick={() => setShowAddressSearch(true)}
                      className="px-4 py-2 border rounded-md bg-gray-50"
                    >
                      주소 검색
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={storeInfo.addressDetail}
                  onChange={(e) =>
                    setStoreInfo((prev) => ({
                      ...prev,
                      addressDetail: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full mt-2 p-2 border rounded-md"
                  placeholder="상세주소"
                />
              </div>

              {/* 주문 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주문 유형
                  </label>
                  <select
                    value={storeInfo.orderType}
                    onChange={(e) =>
                      setStoreInfo((prev) => ({
                        ...prev,
                        orderType: e.target.value as Store["orderType"],
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="DELIVERY">배달</option>
                    <option value="PICKUP">포장</option>
                    <option value="BOTH">배달/포장</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    배달 유형
                  </label>
                  <select
                    value={storeInfo.deliveryType}
                    onChange={(e) =>
                      setStoreInfo((prev) => ({
                        ...prev,
                        deliveryType: e.target.value as Store["deliveryType"],
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="SELF">자체배달</option>
                    <option value="AGENCY">배달대행</option>
                    <option value="BOTH">자체/대행</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최소주문금액
                  </label>
                  <input
                    type="number"
                    value={storeInfo.minOrderPrice}
                    onChange={(e) =>
                      setStoreInfo((prev) => ({
                        ...prev,
                        minOrderPrice: Number(e.target.value),
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 운영 정보 탭 */}
          {activeTab === "hours" && renderHoursTab()}

          {/* 가게 상태 탭 */}
          {activeTab === "status" && renderStatusTab()}

          {/* 홈 카테고리 탭 */}
          {activeTab === "home-categories" && renderHomeCategoriesTab()}
        </>
      )}

      {/* 주소 검색 모달 */}
      {showAddressSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold mb-4">주소 검색</h2>

            <div className="flex flex-col gap-4">
              <AddressSearch
                onSelectAddress={handleAddressSelect}
                buttonLabel="주소 검색"
                className="w-[30%] border rounded-md self-center"
              />

              <div className="flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="flex w-[30%] items-center justify-center self-center"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        handleLocationDetected({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        });
                      },
                      (error) => {
                        setAddressError("위치 정보를 가져올 수 없습니다.");
                      }
                    );
                  } else {
                    setAddressError(
                      "위치 정보가 지원되지 않는 브라우저입니다."
                    );
                  }
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                현재 위치로 설정
              </Button>

              {addressError && (
                <p className="text-sm text-red-500 mt-2">{addressError}</p>
              )}
              {isLoadingAddress && (
                <p className="text-sm text-gray-500 mt-2">
                  주소를 가져오는 중...
                </p>
              )}
            </div>

            <button
              onClick={() => setShowAddressSearch(false)}
              className="mt-4 w-full py-2 border rounded-md"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
