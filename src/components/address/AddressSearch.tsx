"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface AddressData {
  roadAddress: string;
  jibunAddress: string;
  zonecode: string;
  buildingName?: string;
  latitude?: number;
  longitude?: number;
}

interface AddressSearchProps {
  onSelectAddress: (address: AddressData) => void;
  buttonLabel?: string;
  className?: string;
}

export function AddressSearch({
  onSelectAddress,
  buttonLabel = "주소 검색",
  className = "",
}: AddressSearchProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    if (window.daum && window.daum.Postcode) {
      setIsScriptLoaded(true);
      return;
    }

    // 다음 우편번호 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거는 하지 않음 (다른 컴포넌트에서 재사용 가능)
    };
  }, []);

  const openAddressSearch = () => {
    if (!isScriptLoaded) {
      console.error("다음 우편번호 스크립트가 로드되지 않았습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        console.log("선택한 주소 데이터:", data);

        // 좌표 정보 가져오기 (카카오 맵 API 필요)
        if (window.kakao && window.kakao.maps) {
          const geocoder = new window.kakao.maps.services.Geocoder();

          // 도로명 주소 또는 지번 주소로 좌표 검색
          const addressToSearch = data.roadAddress || data.jibunAddress;

          geocoder.addressSearch(
            addressToSearch,
            (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = result[0];

                const addressData: AddressData = {
                  roadAddress: data.roadAddress || "",
                  jibunAddress: data.jibunAddress || "",
                  zonecode: data.zonecode || "",
                  buildingName: data.buildingName || "",
                  latitude: parseFloat(coords.y),
                  longitude: parseFloat(coords.x),
                };

                onSelectAddress(addressData);
              } else {
                // 좌표 변환 실패 시 좌표 없이 주소 정보만 전달
                const addressData: AddressData = {
                  roadAddress: data.roadAddress || "",
                  jibunAddress: data.jibunAddress || "",
                  zonecode: data.zonecode || "",
                  buildingName: data.buildingName || "",
                };

                onSelectAddress(addressData);
                console.error("주소-좌표 변환 실패:", status);
              }
            }
          );
        } else {
          // 카카오 맵 API가 없는 경우 좌표 없이 주소 정보만 전달
          const addressData: AddressData = {
            roadAddress: data.roadAddress || "",
            jibunAddress: data.jibunAddress || "",
            zonecode: data.zonecode || "",
            buildingName: data.buildingName || "",
          };

          onSelectAddress(addressData);
          console.warn(
            "카카오 맵 API가 로드되지 않아 좌표 정보를 가져올 수 없습니다."
          );
        }
      },
      width: "100%",
      height: "500px",
    }).open();
  };

  return (
    <Button
      onClick={openAddressSearch}
      className={className}
      disabled={!isScriptLoaded}
    >
      {buttonLabel}
    </Button>
  );
}

// 타입 정의
declare global {
  interface Window {
    daum: any;
    kakao: any;
  }
}
