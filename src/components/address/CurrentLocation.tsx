"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface CurrentLocationProps {
  onLocationDetected: (location: { lat: number; lng: number }) => void;
  className?: string;
}

export function CurrentLocation({
  onLocationDetected,
  className = "",
}: CurrentLocationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("브라우저에서 위치 정보를 지원하지 않습니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("감지된 위치:", { lat: latitude, lng: longitude });
        onLocationDetected({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (err) => {
        console.error("위치 감지 오류:", err);
        let errorMessage = "위치 정보를 가져오는 중 오류가 발생했습니다.";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case err.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }

        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={detectLocation}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        <MapPin className="mr-2 h-4 w-4" />
        {isLoading ? "위치 감지 중..." : "현재 위치 사용하기"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
