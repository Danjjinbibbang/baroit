import { Suspense } from "react";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

export default function SuccessPage() {
  return <Suspense fallback={<PaymentSuccess />}></Suspense>;
}
