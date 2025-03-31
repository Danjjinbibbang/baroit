import { Suspense } from "react";
import NaverCallback from "@/components/auth/NaverCallback";

export default function NaverAuthPage() {
  return <Suspense fallback={<NaverCallback />}></Suspense>;
}
