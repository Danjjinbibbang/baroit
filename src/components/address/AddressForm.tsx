import { useState } from "react";
import { AddressSearch, AddressData } from "./AddressSearch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AddressRequest } from "@/types/user";

interface AddressFormProps {
  initialData?: Partial<AddressRequest>;
  onSubmit: (data: AddressRequest) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "저장하기",
}: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<AddressRequest>>({
    name: initialData?.name || "",
    recipient: initialData?.recipient || "",
    postalCode: initialData?.postalCode || "",
    address1: initialData?.address1 || "",
    address2: initialData?.address2 || "",
    phoneNumber: initialData?.phoneNumber || "",
    isDefault: initialData?.isDefault || false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev: Partial<AddressRequest>) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddressSelect = (address: AddressData) => {
    setFormData((prev: Partial<AddressRequest>) => ({
      ...prev,
      postalCode: address.zonecode,
      address1: address.roadAddress || address.jibunAddress,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (
      !formData.name ||
      !formData.recipient ||
      !formData.postalCode ||
      !formData.address1 ||
      !formData.address2 ||
      !formData.phoneNumber
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 추가 데이터와 함께 제출
    onSubmit({
      ...(formData as AddressRequest),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">배송지명</Label>
          <Input
            id="name"
            name="name"
            placeholder="예: 집, 회사"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="recipient">받는 사람</Label>
          <Input
            id="recipient"
            name="recipient"
            placeholder="받는 사람 이름"
            value={formData.recipient}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <Label htmlFor="postalCode">우편번호</Label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="우편번호"
              value={formData.postalCode}
              onChange={handleInputChange}
              readOnly
              required
            />
          </div>
          <div className="col-span-2 flex items-end">
            <AddressSearch
              onSelectAddress={handleAddressSelect}
              buttonLabel="주소 검색"
              className="w-full h-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address1">주소</Label>
          <Input
            id="address1"
            name="address1"
            placeholder="기본 주소"
            value={formData.address1}
            onChange={handleInputChange}
            readOnly
            required
          />
        </div>

        <div>
          <Label htmlFor="address2">상세 주소</Label>
          <Input
            id="address2"
            name="address2"
            placeholder="상세 주소를 입력해주세요"
            value={formData.address2}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">연락처</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="연락처 (- 없이 입력)"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="isDefault" className="text-sm font-normal">
            기본 배송지로 설정
          </Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
