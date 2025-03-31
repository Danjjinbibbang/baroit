import { Suspense } from "react";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            width: "600px",
            margin: "0 auto",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h2>결제 정보 확인 중...</h2>
          <div style={{ marginTop: "20px" }}>
            <div
              className="spinner"
              style={{
                width: "50px",
                height: "50px",
                margin: "0 auto",
                border: "5px solid #f3f3f3",
                borderTop: "5px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
