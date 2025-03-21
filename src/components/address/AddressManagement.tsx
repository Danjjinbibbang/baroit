import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressForm } from "./AddressForm";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { Address, AddressRequest } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

export function AddressManagement() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // 로그인 상태 확인 및 주소 목록 로드
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/addresses");
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, router]);

  // 주소 목록 가져오기
  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.get<Address[]>(API_ENDPOINTS.USER.ADDRESSES);
      setAddresses(data);
    } catch (error) {
      toast({
        title: "주소 목록을 불러오는데 실패했습니다.",
        description: error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 주소 추가
  const handleAddAddress = async (data: AddressRequest) => {
    try {
      await apiClient.post(API_ENDPOINTS.USER.ADDRESSES, data);
      setIsAddDialogOpen(false);
      fetchAddresses();
      toast({
        title: "배송지가 추가되었습니다.",
      });
    } catch (error) {
      toast({
        title: "배송지 추가 실패",
        description: "배송지를 추가하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 주소 수정
  const handleEditAddress = async (data: AddressRequest) => {
    if (!selectedAddress) return;

    try {
      await apiClient.put(
        `${API_ENDPOINTS.USER.ADDRESSES}/${selectedAddress.id}`,
        data
      );
      setIsEditDialogOpen(false);
      fetchAddresses();
      toast({
        title: "배송지가 수정되었습니다.",
      });
    } catch (error) {
      toast({
        title: "배송지 수정 실패",
        description: "배송지를 수정하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 주소 삭제
  const handleDeleteAddress = async () => {
    if (!selectedAddress) return;

    try {
      await apiClient.delete(
        `${API_ENDPOINTS.USER.ADDRESSES}/${selectedAddress.id}`
      );
      setIsDeleteDialogOpen(false);
      fetchAddresses();
      toast({
        title: "배송지가 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "배송지 삭제 실패",
        description: "배송지를 삭제하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 기본 배송지로 설정
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await apiClient.put(
        `${API_ENDPOINTS.USER.ADDRESSES}/${addressId}/default`
      );
      fetchAddresses();
      toast({
        title: "기본 배송지가 변경되었습니다.",
      });
    } catch (error) {
      toast({
        title: "기본 배송지 변경 실패",
        description:
          "기본 배송지를 변경하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {addresses.length > 0
            ? `총 ${addresses.length}개의 배송지가 있습니다.`
            : "등록된 배송지가 없습니다."}
        </p>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />새 배송지 추가
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <p>배송지 정보를 불러오는 중...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">
            등록된 배송지가 없습니다. 새 배송지를 추가해주세요.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />새 배송지 추가
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      {address.name}
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          기본 배송지
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {address.recipient}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAddress(address);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAddress(address);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    ({address.postalCode}) {address.address1} {address.address2}
                  </p>
                  <p>{address.phoneNumber}</p>
                </div>

                {!address.isDefault && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      기본 배송지로 설정
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 새 배송지 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 배송지 추가</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* 배송지 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>배송지 수정</DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <AddressForm
              initialData={{
                name: selectedAddress.name,
                recipient: selectedAddress.recipient,
                postalCode: selectedAddress.postalCode,
                address1: selectedAddress.address1,
                address2: selectedAddress.address2,
                phoneNumber: selectedAddress.phoneNumber,
                isDefault: selectedAddress.isDefault,
              }}
              onSubmit={handleEditAddress}
              onCancel={() => setIsEditDialogOpen(false)}
              submitLabel="수정하기"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 배송지 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>배송지 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              '{selectedAddress?.name}' 배송지를 삭제하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteAddress}>
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
