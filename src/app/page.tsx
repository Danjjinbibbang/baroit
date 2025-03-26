"use client";

import React from "react";
import Header from "@/components/layout/Header";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import StoreSection from "@/components/home/StoreSection";
import ConvenienceSection from "@/components/home/ConvenienceSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm border-b">
        <Header />
      </header>

      <div className="flex-grow flex justify-center">
        <main className="w-full max-w-5xl bg-white">
          <div className="px-4 py-6">
            <CategorySection />
            <StoreSection />
            <ConvenienceSection />
            <ProductSection />
          </div>
        </main>
      </div>

      <footer className="w-full bg-gray-50 border-t">
        <Footer />
      </footer>
    </div>
  );
}
