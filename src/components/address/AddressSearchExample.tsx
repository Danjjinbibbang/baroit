"use client";

import React, { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { AddressSearch, AddressData } from "./AddressSearch";
import { CurrentLocation } from "./CurrentLocation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AddressSearchExample() {
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null
  );

  const handleAddressSelect = (address: AddressData) => {
    setSelectedAddress(address);
  };

  const handleLocationDetected = (location: { lat: number; lng: number }) => {
    // 역지오코딩 API 호출 (위도, 경도 -> 주소)
    fetch(
      `/api/address/reverse-geocode?lat=${location.lat}&lng=${location.lng}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("주소 변환 중 오류가 발생했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        if (!data.documents || data.documents.length === 0) {
          throw new Error("현재 위치의 주소를 찾을 수 없습니다.");
        }

        const addressInfo = data.documents[0];
        const addressData: AddressData = {
          roadAddress: addressInfo.road_address?.address_name || "",
          jibunAddress: addressInfo.address.address_name || "",
          buildingName: addressInfo.road_address?.building_name || "",
          zonecode: addressInfo.road_address?.zone_no || "",
          latitude: location.lat,
          longitude: location.lng,
        };

        setSelectedAddress(addressData);
      })
      .catch((err) => {
        console.error("역지오코딩 오류:", err);
        alert(
          err instanceof Error
            ? err.message
            : "주소 변환 중 오류가 발생했습니다."
        );
      });
  };

  const openKakaoMap = () => {
    if (selectedAddress?.latitude && selectedAddress?.longitude) {
      const url = `https://map.kakao.com/link/map/${selectedAddress.roadAddress},${selectedAddress.latitude},${selectedAddress.longitude}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>주소 검색 예제</CardTitle>
          <CardDescription>
            도로명 주소, 지번 주소 또는 건물명으로 검색하거나 현재 위치를 사용할
            수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="search">주소 검색</TabsTrigger>
              <TabsTrigger value="location">현재 위치</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <AddressSearch onSelectAddress={handleAddressSelect} />
            </TabsContent>

            <TabsContent value="location">
              <div className="text-center py-4">
                <p className="mb-4 text-gray-600">
                  브라우저의 위치 정보 접근을 허용하면 현재 위치를 기반으로
                  주소를 찾을 수 있습니다.
                </p>
                <CurrentLocation onLocationDetected={handleLocationDetected} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedAddress && (
        <Card>
          <CardHeader>
            <CardTitle>선택한 주소 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedAddress.zonecode && (
                <div>
                  <p className="text-sm font-medium text-gray-500">우편번호</p>
                  <p>{selectedAddress.zonecode}</p>
                </div>
              )}

              {selectedAddress.roadAddress && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    도로명 주소
                  </p>
                  <p className="flex items-start">
                    <MapPin className="mr-1 h-4 w-4 mt-1 flex-shrink-0" />
                    <span>
                      {selectedAddress.roadAddress}
                      {selectedAddress.buildingName &&
                        ` (${selectedAddress.buildingName})`}
                    </span>
                  </p>
                </div>
              )}

              {selectedAddress.jibunAddress && (
                <div>
                  <p className="text-sm font-medium text-gray-500">지번 주소</p>
                  <p>{selectedAddress.jibunAddress}</p>
                </div>
              )}

              {selectedAddress.latitude && selectedAddress.longitude && (
                <div>
                  <p className="text-sm font-medium text-gray-500">좌표</p>
                  <p>
                    위도: {selectedAddress.latitude.toFixed(6)}, 경도:{" "}
                    {selectedAddress.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {selectedAddress.latitude && selectedAddress.longitude && (
              <Button
                variant="outline"
                onClick={openKakaoMap}
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                지도에서 보기
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
