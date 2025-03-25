"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, X, Upload } from "lucide-react";

// 임시 카테고리 데이터
const productCategories = [
  "과일/채소",
  "정육/계란",
  "수산/해산물",
  "간편식/반찬",
  "음료/커피/차",
  "과자/빵/디저트",
  "건강식품",
  "생활용품",
];

const storeCategories = [
  "신상품",
  "베스트",
  "특가/할인",
  "제철식품",
  "선물세트",
  "지역특산물",
  "친환경/유기농",
];

// 임시 상품 데이터
const initialProducts = [
  {
    id: "10025723",
    name: "대추 방울 토마토 5kg",
    status: "판매중",
    stock: "재고있음",
    stockManagement: "재고 관리",
    price: 11900,
    salePrice: 11900,
    unit: "단위",
    deliveryType: "배달",
    updatedAt: "2023.12.31",
    createdAt: "2023.12.30",
    category: "과일/채소",
    storeCategory: "제철식품",
    saleStartDate: "2023.12.30",
    saleEndDate: "2024.12.30",
    options: [{ name: "크기", values: ["소", "중", "대"] }],
    image: "",
    description: "신선한 대추 방울 토마토입니다.",
    minorPurchase: true,
  },
  {
    id: "10025724",
    name: "제주 천혜향 1박스 3kg",
    status: "판매중",
    stock: "재고있음",
    stockManagement: "재고 관리",
    price: 12900,
    salePrice: 12900,
    unit: "1",
    deliveryType: "픽업",
    updatedAt: "2023.12.31",
    createdAt: "2023.12.30",
    category: "과일/채소",
    storeCategory: "지역특산물",
    saleStartDate: "2023.12.30",
    saleEndDate: "2024.12.30",
    options: [{ name: "포장", values: ["선물용", "일반"] }],
    image: "",
    description: "제주도에서 직송한 천혜향입니다.",
    minorPurchase: true,
  },
  {
    id: "10025725",
    name: "제주 천혜향 1박스 3kg",
    status: "판매중",
    stock: "재고있음",
    stockManagement: "재고 관리",
    price: 12900,
    salePrice: 12900,
    unit: "345",
    deliveryType: "배달/픽업",
    updatedAt: "2023.12.31",
    createdAt: "2023.12.30",
    category: "과일/채소",
    storeCategory: "지역특산물",
    saleStartDate: "2023.12.30",
    saleEndDate: "2024.12.30",
    options: [{ name: "포장", values: ["선물용", "일반"] }],
    image: "",
    description: "제주도에서 직송한 천혜향입니다.",
    minorPurchase: true,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStoreCategory, setSelectedStoreCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // 검색 및 필터링 적용
  useEffect(() => {
    // 디바운스를 위한 타이머 ID
    const debounceTimer = setTimeout(() => {
      let result = [...products];

      // 판매상태 필터링
      if (selectedStatus !== "전체") {
        result = result.filter((product) => product.status === selectedStatus);
      }

      // 검색어 필터링
      if (searchTerm) {
        result = result.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // 카테고리 필터링
      if (selectedCategory) {
        result = result.filter(
          (product) => product.category === selectedCategory
        );
      }

      // 가게홈 카테고리 필터링
      if (selectedStoreCategory) {
        result = result.filter(
          (product) => product.storeCategory === selectedStoreCategory
        );
      }

      setFilteredProducts(result);
    }, 300); // 300ms 디바운스 적용

    // 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
    return () => clearTimeout(debounceTimer);
  }, [
    products,
    selectedStatus,
    searchTerm,
    selectedCategory,
    selectedStoreCategory,
  ]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    // 검색 기능은 useEffect에서 처리
  };

  const resetSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStoreCategory("");
    setSelectedStatus("전체");
  };

  const handleEditProduct = () => {
    if (selectedProducts.length === 1) {
      const productToEdit = products.find((p) => p.id === selectedProducts[0]);
      setCurrentProduct({ ...productToEdit });
      setIsNewProduct(false);
      setShowEditModal(true);
    }
  };

  const handleAddProduct = () => {
    const newProductId = (
      parseInt(products[products.length - 1].id) + 1
    ).toString();
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, ".");

    // 저장한 값을 가져와야 함
    setCurrentProduct({
      id: newProductId,
      name: "",
      status: "판매중",
      stock: "재고있음",
      stockManagement: "재고 관리",
      price: 0,
      salePrice: 0,
      unit: "",
      deliveryType: "배달",
      updatedAt: dateStr,
      createdAt: dateStr,
      category: "",
      storeCategory: "",
      saleStartDate: dateStr,
      saleEndDate: dateStr.replace(
        dateStr.substring(0, 4),
        (parseInt(dateStr.substring(0, 4)) + 1).toString()
      ),
      options: [{ name: "", values: [""] }],
      image: "",
      description: "",
      minorPurchase: true,
    });
    setIsNewProduct(true);
    setShowEditModal(true);
  };

  const handleDeleteProducts = () => {
    if (selectedProducts.length > 0) {
      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id))
      );
      setSelectedProducts([]);
    }
  };

  const handleSaveProduct = () => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, ".");

    if (isNewProduct) {
      // 새 상품 추가
      setProducts((prev) => [
        ...prev,
        { ...currentProduct, createdAt: dateStr, updatedAt: dateStr },
      ]);
    } else {
      // 기존 상품 수정
      setProducts((prev) =>
        prev.map((p) =>
          p.id === currentProduct.id
            ? { ...currentProduct, updatedAt: dateStr }
            : p
        )
      );
    }

    setShowEditModal(false);
    setCurrentProduct(null);
  };

  return (
    <>
      <div className="px-4 py-4 border-b space-y-4 bg-white rounded-t-lg">
        {/* 검색 및 필터 영역 */}
        <div className="px-4 py-4 border-1 rounded-lg space-y-4">
          {/* 검색창 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">검색어</span>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="상품명을 입력해주세요"
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button
              className="px-3 py-2 border rounded-md text-sm flex items-center gap-1"
              onClick={resetSearch}
            >
              초기화
            </button>
            <button
              className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
              onClick={handleSearch}
            >
              검색
            </button>
          </div>

          {/* 카테고리 및 상태 필터 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">판매상태</span>
            <button
              className={`px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 ${
                selectedStatus === "전체" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedStatus("전체")}
            >
              전체
            </button>
            <button
              className={`px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 ${
                selectedStatus === "판매중" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedStatus("판매중")}
            >
              판매중
            </button>
            <button
              className={`px-3 py-1.5 border rounded-full text-sm flex items-center gap-1 ${
                selectedStatus === "판매종료" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setSelectedStatus("판매종료")}
            >
              판매종료
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">상품 카테고리</span>
            <div className="relative">
              <select
                className="px-3 py-1.5 border rounded-full text-sm appearance-none pr-8"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">상품 카테고리 선택</option>
                {productCategories.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">가게홈 카테고리</span>
            <div className="relative">
              <select
                className="px-3 py-1.5 border rounded-full text-sm appearance-none pr-8"
                value={selectedStoreCategory}
                onChange={(e) => setSelectedStoreCategory(e.target.value)}
              >
                <option value="">가게홈 카테고리 선택</option>
                {storeCategories.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        {/* 액션 버튼 영역 */}
        <div className="px-4 py-3 border-b flex items-center justify-end gap-2">
          <button
            className="px-3 py-1.5 border rounded-md text-sm flex items-center gap-1"
            onClick={handleDeleteProducts}
            disabled={selectedProducts.length === 0}
          >
            삭제
          </button>
          <button
            className="px-3 py-1.5 border rounded-md text-sm flex items-center gap-1"
            onClick={handleEditProduct}
            disabled={selectedProducts.length !== 1}
          >
            수정
          </button>
          <button
            className="flex items-center gap-1 text-blue-500 text-sm"
            onClick={handleAddProduct}
          >
            <Plus className="w-4 h-4" />
            상품 등록
          </button>
        </div>
        {/* 상품 목록 */}
        <div className="flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="flex px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500 sticky top-0 whitespace-nowrap">
                <div className="pr-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedProducts.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                  />
                </div>
                <div className="w-20 flex-shrink-0">상품ID</div>
                <div className="w-40 flex-shrink-0">상품명</div>
                <div className="w-20 flex-shrink-0">판매상태</div>
                <div className="w-20 flex-shrink-0">재고</div>
                <div className="w-24 flex-shrink-0">재고 관리</div>
                <div className="w-20 flex-shrink-0">정상가</div>
                <div className="w-20 flex-shrink-0">판매가</div>
                <div className="w-20 flex-shrink-0">음식개수</div>
                <div className="w-24 flex-shrink-0">배송방식</div>
                <div className="w-24 flex-shrink-0">등록 이력</div>
                <div className="w-32 flex-shrink-0">최근 수정 이력</div>
              </div>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex px-4 py-3 border-b text-sm hover:bg-gray-50 whitespace-nowrap"
                >
                  <div className="pr-4 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </div>
                  <div className="w-20 flex-shrink-0">{product.id}</div>
                  <div className="w-40 flex-shrink-0 text-blue-500">
                    {product.name}
                  </div>
                  <div className="w-20 flex-shrink-0">{product.status}</div>
                  <div className="w-20 flex-shrink-0">{product.stock}</div>
                  <div className="w-24 flex-shrink-0">
                    {product.stockManagement}
                  </div>
                  <div className="w-20 flex-shrink-0">
                    {product.price.toLocaleString()}원
                  </div>
                  <div className="w-20 flex-shrink-0">
                    {product.salePrice.toLocaleString()}원
                  </div>
                  <div className="w-20 flex-shrink-0">{product.unit}</div>
                  <div className="w-24 flex-shrink-0">
                    {product.deliveryType}
                  </div>
                  <div className="w-24 flex-shrink-0">{product.createdAt}</div>
                  <div className="w-32 flex-shrink-0">{product.updatedAt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 상품 수정/등록 모달 */}
        {showEditModal && currentProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">
                  {isNewProduct ? "상품 등록" : "상품 수정"}
                </h2>
                <button onClick={() => setShowEditModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 상품 기본 정보 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        상품명
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.name}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        판매상태
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.status}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="판매중">판매중</option>
                        <option value="판매종료">판매종료</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        상품 카테고리
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.category}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="">선택하세요</option>
                        {productCategories.map((category, idx) => (
                          <option key={idx} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        가게홈 카테고리
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.storeCategory}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            storeCategory: e.target.value,
                          })
                        }
                      >
                        <option value="">선택하세요</option>
                        {storeCategories.map((category, idx) => (
                          <option key={idx} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        판매 시작일
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.saleStartDate.replace(/\./g, "-")}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            saleStartDate: e.target.value.replace(/-/g, "."),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        판매 종료일
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.saleEndDate.replace(/\./g, "-")}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            saleEndDate: e.target.value.replace(/-/g, "."),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        정상가
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.price}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        판매가
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.salePrice}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            salePrice: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        음식개수
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.unit}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            unit: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        배송방식
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={currentProduct.deliveryType}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            deliveryType: e.target.value,
                          })
                        }
                      >
                        <option value="배달">배달</option>
                        <option value="픽업">픽업</option>
                        <option value="배달/픽업">배달/픽업</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 옵션 구성 */}
                <div>
                  <h3 className="text-md font-medium mb-2">옵션 구성</h3>
                  {currentProduct.options.map((option: any, idx: number) => (
                    <div key={idx} className="border p-3 rounded-md mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="옵션명"
                          className="flex-1 p-2 border rounded-md"
                          value={option.name}
                          onChange={(e) => {
                            const newOptions = [...currentProduct.options];
                            newOptions[idx].name = e.target.value;
                            setCurrentProduct({
                              ...currentProduct,
                              options: newOptions,
                            });
                          }}
                        />
                        <button
                          className="text-red-500"
                          onClick={() => {
                            if (currentProduct.options.length > 1) {
                              const newOptions = currentProduct.options.filter(
                                (_: any, i: number) => i !== idx
                              );
                              setCurrentProduct({
                                ...currentProduct,
                                options: newOptions,
                              });
                            }
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {option.values.map(
                          (value: string, valueIdx: number) => (
                            <div
                              key={valueIdx}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                placeholder="옵션값"
                                className="flex-1 p-2 border rounded-md"
                                value={value}
                                onChange={(e) => {
                                  const newOptions = [
                                    ...currentProduct.options,
                                  ];
                                  newOptions[idx].values[valueIdx] =
                                    e.target.value;
                                  setCurrentProduct({
                                    ...currentProduct,
                                    options: newOptions,
                                  });
                                }}
                              />
                              <button
                                className="text-red-500"
                                onClick={() => {
                                  if (option.values.length > 1) {
                                    const newOptions = [
                                      ...currentProduct.options,
                                    ];
                                    newOptions[idx].values =
                                      option.values.filter(
                                        (_: any, i: number) => i !== valueIdx
                                      );
                                    setCurrentProduct({
                                      ...currentProduct,
                                      options: newOptions,
                                    });
                                  }
                                }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        )}
                        <button
                          className="text-blue-500 text-sm"
                          onClick={() => {
                            const newOptions = [...currentProduct.options];
                            newOptions[idx].values.push("");
                            setCurrentProduct({
                              ...currentProduct,
                              options: newOptions,
                            });
                          }}
                        >
                          + 옵션값 추가
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="text-blue-500 text-sm"
                    onClick={() => {
                      setCurrentProduct({
                        ...currentProduct,
                        options: [
                          ...currentProduct.options,
                          { name: "", values: [""] },
                        ],
                      });
                    }}
                  >
                    + 옵션 추가
                  </button>
                </div>

                {/* 상품 이미지 및 설명 */}
                <div>
                  <h3 className="text-md font-medium mb-2">상품 대표 이미지</h3>
                  <label className="border-dashed border-2 p-8 rounded-md flex flex-col items-center justify-center cursor-pointer">
                    {currentProduct?.image ? (
                      <img
                        src={currentProduct.image}
                        alt="상품 이미지"
                        className="max-h-40 mb-2"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-500">
                      이미지를 드래그하거나 클릭하여 업로드하세요
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCurrentProduct({
                              ...currentProduct,
                              image: event.target?.result as string,
                            });
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-md font-medium mb-2">상품 상세 설명</h3>
                  <textarea
                    className="w-full p-3 border rounded-md h-32"
                    placeholder="상품에 대한 상세 설명을 입력하세요"
                    value={currentProduct.description}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="minorPurchase"
                    className="mr-2"
                    checked={currentProduct.minorPurchase}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        minorPurchase: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="minorPurchase" className="text-sm">
                    미성년자 구매 가능
                  </label>
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-2">
                <button
                  className="px-4 py-2 border rounded-md"
                  onClick={() => setShowEditModal(false)}
                >
                  취소
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={handleSaveProduct}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
