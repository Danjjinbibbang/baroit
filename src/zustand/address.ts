// src/zustand/address.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getAddresses,
  setDefaultAddress as apiSetDefaultAddress,
} from "@/utils/address";
import { Address } from "@/types/address";

// interface Address {
//   addressId: number;
//   alias: string;
//   road: string;
//   detailed: string;
//   isDefault: boolean;
//   deliveryGuideMessage?: string;
// }

interface AddressState {
  addresses: Address[];
  defaultAddress: string;
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  setDefaultAddress: (addressId: number) => Promise<void>;
  updateAddressList: (addressList: Address[]) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      defaultAddress: "배송지를 선택하세요",
      isLoading: false,

      fetchAddresses: async () => {
        set({ isLoading: true });
        try {
          const response = await getAddresses();

          let addressList: Address[] = [];

          if (
            response &&
            response.data &&
            Array.isArray(response.data.addresses)
          ) {
            addressList = response.data.addresses;
          } else if (response && Array.isArray(response)) {
            addressList = response;
          }

          // 기본 주소 찾기
          const defaultAddr = addressList.find((addr) => addr.isDefault);

          set({
            addresses: addressList,
            defaultAddress: defaultAddr
              ? defaultAddr.road
              : "배송지를 선택하세요",
            isLoading: false,
          });
        } catch (error) {
          console.error("주소 목록 조회 실패:", error);
          set({ isLoading: false });
        }
      },

      setDefaultAddress: async (addressId: number) => {
        try {
          await apiSetDefaultAddress(addressId);
          await get().fetchAddresses();
          return Promise.resolve();
        } catch (error) {
          console.error("기본 배송지 설정 실패:", error);
          return Promise.reject(error);
        }
      },

      updateAddressList: (addressList: Address[]) => {
        const defaultAddr = addressList.find((addr) => addr.isDefault);
        set({
          addresses: addressList,
          defaultAddress: defaultAddr ? defaultAddr.road : get().defaultAddress,
        });
      },
    }),
    {
      name: "address-storage",
      // 로컬 스토리지에 저장할 데이터 선택
      partialize: (state) => ({ defaultAddress: state.defaultAddress }),
    }
  )
);
