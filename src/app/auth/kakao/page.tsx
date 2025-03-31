import { Suspense } from "react";
import KakaoCallback from "@/components/auth/KakaoCallback";

export default function KakaoAuthPage() {
  return <Suspense fallback={<KakaoCallback />}></Suspense>;
}
