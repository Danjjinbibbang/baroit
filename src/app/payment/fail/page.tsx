import { Suspense } from "react";
import PaymentFail from "@/components/payment/PaymentFail";

export default function FailPage() {
  return <Suspense fallback={<PaymentFail />}></Suspense>;
}
