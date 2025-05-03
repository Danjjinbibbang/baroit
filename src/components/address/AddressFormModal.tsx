"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Address, AddressFormData } from "@/types/address";
import { MapPin } from "lucide-react";
import { AddressSearch } from "@/components/address/AddressSearch";
import { createAddress, updateAddress } from "@/utils/address";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address: Address | null;
  customerId: number;
}

const DELIVERY_MESSAGES = [
  "문 앞에 두고 벨 눌러주세요",
  "문 앞에 두고 노크해주세요",
  "문 앞에 두면 가져갈게요(벨x, 노크x)",
  "직접 받을게요",
  "전화주시면 마중 나갈게요",
  "직접 입력",
];

export default function AddressFormModal({
  isOpen,
  onClose,
  onSuccess,
  address,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    detailed: "",
    alias: "",
    riderMessage: "",
    entrancePassword: "",
    deliveryGuideMessage: "",
    road: "",
    jibun: "",
    latitude: 0,
    longitude: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isCustomMessageSelected, setIsCustomMessageSelected] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    if (address) {
      setFormData({
        detailed: address.detailed,
        alias: address.alias,
        riderMessage: address.riderMessage || "",
        entrancePassword: address.entrancePassword,
        deliveryGuideMessage: address.deliveryGuideMessage || "",
        road: address.road || "",
        jibun: address.jibun || "",
        latitude: address.latitude || 0,
        longitude: address.longitude || 0,
      });

      // 커스텀 알리아스와 메시지 설정
      if (address.alias !== "집" && address.alias !== "회사") {
        setIsOtherSelected(true);
        setCustomAlias(address.alias);
      }

      if (!DELIVERY_MESSAGES.includes(address.riderMessage || "")) {
        setIsCustomMessageSelected(true);
        setCustomMessage(address.riderMessage || "");
      }
    } else {
      resetForm();
    }
  }, [address]);

  // 폼 초기화 함수
  const resetForm = () => {
    setFormData({
      detailed: "",
      alias: "",
      riderMessage: "",
      entrancePassword: null,
      deliveryGuideMessage: "",
      road: "",
      jibun: "",
      latitude: 0,
      longitude: 0,
    });
    setIsOtherSelected(false);
    setCustomAlias("");
    setIsCustomMessageSelected(false);
    setCustomMessage("");
  };

  // 주소 저장 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 필수 필드 검증
      if (!formData.alias) {
        throw new Error("배송지 구분을 선택해주세요.");
      }

      // 주소 데이터 준비
      const addressData = {
        ...formData,
      };

      // 주소 수정 시 데이터 준비
      const updateAddressData = {
        detailed: formData.detailed,
        alias: formData.alias,
        riderMessage: formData.riderMessage,
        entrancePassword: formData.entrancePassword,
        deliveryGuideMessage: formData.deliveryGuideMessage,
      };

      // 콘솔에 로그 출력 (디버깅용)
      console.log("API 호출 전 데이터:", addressData);

      if (address) {
        // 주소 수정 - updateAddress 유틸 함수 사용
        await updateAddress(address.addressId, updateAddressData);
      } else {
        // 신규 주소 생성 - createAddress 유틸 함수 사용
        await createAddress(addressData);
      }

      // 성공 콜백 호출
      onSuccess();
    } catch (error) {
      // 에러 처리
      const errorMessage =
        error instanceof Error ? error.message : "주소 저장에 실패했습니다.";
      console.error(address ? "주소 수정 실패:" : "주소 생성 실패:", error);

      // 사용자에게 오류 표시 (옵션)
      setAddressError(errorMessage);

      // 여기서 alert 대신 더 우아한 방식으로 오류를 표시할 수 있습니다
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log("주소 정보:", data);
      if (data.documents && data.documents.length > 0) {
        const addressInfo = data.documents[0];
        let roadAddress = "";
        let jibunAddress = "";
        const latitude = location.lat;
        const longitude = location.lng;

        // 현재 위치로 설정 -> road_address null임
        if (addressInfo.road_address) {
          roadAddress = addressInfo.road_address.address_name;
        }
        if (addressInfo.address) {
          jibunAddress = addressInfo.address.address_name;
        }

        setFormData({
          ...formData,
          detailed: roadAddress || jibunAddress,
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {address ? "배송지 수정" : "새 배송지 등록"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alias">배송지 구분</Label>
            <Select
              value={isOtherSelected ? "기타" : formData.alias}
              onValueChange={(value) => {
                if (value === "기타") {
                  setIsOtherSelected(true);
                } else {
                  setIsOtherSelected(false);
                  setFormData({ ...formData, alias: value });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {isOtherSelected
                    ? customAlias || "기타"
                    : formData.alias || "배송지 구분을 선택하세요"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="집">집</SelectItem>
                <SelectItem value="회사">회사</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
            {isOtherSelected && (
              <Input
                value={customAlias}
                onChange={(e) => {
                  setCustomAlias(e.target.value);
                  setFormData({
                    ...formData,
                    alias: e.target.value,
                  });
                }}
                placeholder="배송지 이름을 입력하세요"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailed">상세 주소</Label>
            <div className="flex mb-2 justify-between">
              <AddressSearch
                onSelectAddress={(selectedAddress) => {
                  setFormData({
                    ...formData,
                    road: selectedAddress.roadAddress,
                    jibun: selectedAddress.jibunAddress,
                    latitude: selectedAddress.latitude || 0,
                    longitude: selectedAddress.longitude || 0,
                  });
                }}
                buttonLabel="주소 검색"
                className="flex w-[30%] border border-black-300 rounded-md"
              />
              <Button
                type="button"
                variant="outline"
                className="flex w-[30%]"
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
                        console.error("위치 정보 가져오기 실패:", error);
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
            </div>

            <Input
              value={formData.road || formData.jibun}
              readOnly
              placeholder="주소가 여기에 표시됩니다"
            />
            <Input
              value={formData.detailed}
              placeholder="상세 주소를 입력해주세요"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  detailed: e.target.value,
                });
              }}
            />

            {addressError && (
              <p className="text-sm text-red-500">{addressError}</p>
            )}
            {isLoadingAddress && (
              <p className="text-sm text-gray-500">주소를 가져오는 중...</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="entrancePassword">공동현관 비밀번호</Label>
            <Input
              id="entrancePassword"
              type="text"
              value={formData.entrancePassword || ""}
              onChange={(e) =>
                setFormData({ ...formData, entrancePassword: e.target.value })
              }
              placeholder="공동현관 비밀번호를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryGuideMessage">사장님께 요청하기</Label>
            <Input
              id="deliveryGuideMessage"
              type="text"
              value={formData.deliveryGuideMessage || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryGuideMessage: e.target.value,
                })
              }
              placeholder="배송 안내 메시지를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label>배송기사님께 요청하기</Label>
            <Select
              value={
                isCustomMessageSelected
                  ? "직접 입력"
                  : formData.riderMessage || ""
              }
              onValueChange={(value) => {
                if (value === "직접 입력") {
                  setIsCustomMessageSelected(true);
                } else {
                  setIsCustomMessageSelected(false);
                  setFormData({ ...formData, riderMessage: value });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {isCustomMessageSelected
                    ? customMessage || "직접 입력"
                    : formData.riderMessage ||
                      "배송 기사님께 전달할 메시지를 선택하세요"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                {DELIVERY_MESSAGES.map((message) => (
                  <SelectItem
                    key={message}
                    value={message}
                    className="bg-transparent hover:bg-transparent"
                  >
                    {message}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isCustomMessageSelected && (
              <Input
                value={customMessage}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomMessage(newValue);
                  setFormData({
                    ...formData,
                    riderMessage: newValue,
                  });
                }}
                placeholder="배송 기사님께 전달할 메시지를 직접 입력해주세요"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : address ? "수정" : "저장"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
