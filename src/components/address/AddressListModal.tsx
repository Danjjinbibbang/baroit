"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address";
import { Home, Building2, Trash2, Edit2, Plus, Star } from "lucide-react";
import AddressFormModal from "./AddressFormModal";
import { deleteAddress } from "@/utils/address";
import { useAddressStore } from "@/zustand/address";

interface AddressListModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
}

export default function AddressListModal({
  isOpen,
  onClose,
  customerId,
}: AddressListModalProps) {
  const {
    addresses,
    isLoading,
    fetchAddresses,
    setDefaultAddress,
    updateAddressList,
  } = useAddressStore();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen, fetchAddresses]);

  const handleDelete = async (addressId: number) => {
    if (!confirm("이 주소를 삭제하시겠습니까?")) return;

    try {
      await deleteAddress(addressId);
      const updatedAddresses = addresses.filter(
        (addr) => addr.addressId !== addressId
      );
      updateAddressList(updatedAddresses);
      alert("주소 삭제 완료");
    } catch (error) {
      console.error("주소 삭제 실패:", error);
      alert("주소 삭제 실패");
    }
  };

  const handleSetDefault = async (addressId: number) => {
    if (isSettingDefault) return;

    try {
      setIsSettingDefault(true);
      await setDefaultAddress(addressId);
      alert("기본 배송지 설정 완료");
    } catch (error) {
      console.error("기본 배송지 설정 실패:", error);
      alert("기본 배송지 설정 실패");
    } finally {
      setIsSettingDefault(false);
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsFormModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[80%] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>배송지 관리</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex flex-col p-4 overflow-hidden h-full">
            <Button
              onClick={handleAddNew}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />새 배송지 추가
            </Button>

            {isLoading ? (
              <div className="text-center py-4">로딩 중...</div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                등록된 배송지가 없습니다.
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[80%]">
                {addresses.map((address) => (
                  <div
                    key={address.addressId}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {address.alias === "집" ? (
                          <Home className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Building2 className="w-5 h-5 text-green-500" />
                        )}
                        <span className="font-medium">{address.alias}</span>
                        {address.isDefault && (
                          <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                            기본 배송지
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(address)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(address.addressId)}
                          disabled={address.isDefault}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{address.road}</div>
                      <div>{address.detailed}</div>
                      <div className="mt-1 text-gray-500 overflow-hidden flex justify-between">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs w-[70%]">
                          {address.deliveryGuideMessage || "배송 요청사항 없음"}
                        </span>
                        {!address.isDefault && (
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() =>
                                handleSetDefault(address.addressId)
                              }
                              disabled={isSettingDefault}
                            >
                              <Star className="w-3 h-3 mr-1 text-yellow-500" />
                              기본 배송지로 설정
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddressFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedAddress(null);
        }}
        onSuccess={() => {
          fetchAddresses();
          setIsFormModalOpen(false);
          setSelectedAddress(null);
        }}
        address={selectedAddress}
        customerId={customerId}
      />
    </>
  );
}
