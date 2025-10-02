// store/productStore.ts
import {create} from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  ecommerceLinks: string | null;
  catalogPhotos: {
    path: string;
    file_name: string;
  }[];
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    setProducts: (products: Product[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
        incrementPage: () => void;
    setTotalPages: (totalPages: number) => void;
}

export const useProductHomeStore = create<ProductState>()(devtools(
    (set) => ({
        products: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        setProducts: (products) => set({ products }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        incrementPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
        setTotalPages: (totalPages) => set({ totalPages }),
    }),{name: "ProductQuery"})
);
