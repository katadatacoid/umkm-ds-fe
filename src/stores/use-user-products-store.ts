import { create } from "zustand";
import { productAPI } from "@/lib/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  linkTokopedia?: string;
  linkShopee?: string;
  linkLazada?: string;
  linkBukalapak?: string;
  linkLainnya?: string;
  description: string;
  image: string;
  status: "aktif" | "non-aktif";
  date?: string;
}

export interface StatItem {
  title: string;
  value: number | string;
  description?: string;
}

// ✅ Interface untuk filter options
interface FetchProductsOptions {
  search?: string;
  status?: string;
}

interface UserProductsState {
  products: Product[];
  statsData: StatItem[];
  loading: boolean;
  error: string | null;

  // Actions - ✅ Updated signature
  fetchProductsData: (options?: FetchProductsOptions) => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const useUserProductsStore = create<UserProductsState>((set, get) => ({
  products: [],
  statsData: [
    { title: "Total Produk", value: 0, description: "Jumlah seluruh produk." },
    { title: "Aktif", value: 0, description: "Produk yang aktif saat ini." },
    { title: "Non-Aktif", value: 0, description: "Produk yang non-aktif." },
  ],
  loading: false,
  error: null,

  // ✅ Fetch data dengan search DAN status parameter
  // ✅ Fetch data dengan search DAN status parameter
fetchProductsData: async (options?: FetchProductsOptions) => {
  set({ loading: true, error: null });

  try {
    const search = options?.search;
    const status = options?.status;

    console.log("=== STORE fetchProductsData ===");
    console.log("Options:", { search, status });

    // Call API dengan search dan status parameter
    const response = await productAPI.getAll(search, status);

    console.log("=== API RESPONSE ===");
    console.log("Count:", response.count);
    console.log("Data length:", response.data.length);
    console.log("Stats:", response.stats);

    // Map API response to Product type
    const mappedProducts: Product[] = response.data.map((p) => ({
      id: parseInt(p.id),
      name: p.name,
      price: p.current_price,
      linkTokopedia: p.ecommerce_links?.tokopedia,
      linkShopee: p.ecommerce_links?.shopee,
      linkLazada: p.ecommerce_links?.lazada,
      linkBukalapak: p.ecommerce_links?.bukalapak,
      linkLainnya: p.ecommerce_links?.lainnya,
      description: p.description || "",
      image:
        p.catalog_photos && p.catalog_photos.length > 0
          ? p.catalog_photos[0].path
          : "/images/no-image.png",
      status: p.status === "published" ? "aktif" : "non-aktif",
      date: formatDate(p.created_at),
    }));

    console.log("Mapped products count:", mappedProducts.length);

    // Update stats dari response
    const updatedStats: StatItem[] = [
      {
        title: "Total Produk",
        value: response.stats?.total || response.count,
        description: "Jumlah seluruh produk.",
      },
      {
        title: "Aktif",
        value: response.stats?.active || 0,
        description: "Produk yang aktif saat ini.",
      },
      {
        title: "Non-Aktif",
        value: response.stats?.nonActive || 0,
        description: "Produk yang non-aktif.",
      },
    ];

    set({
      products: mappedProducts,
      statsData: updatedStats,
      loading: false,
    });

    console.log("✅ Store updated successfully");
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    set({
      error:
        error instanceof Error
          ? error.message
          : "Gagal memuat data produk",
      loading: false,
    });
  }
},

  // Add a new product
  addProduct: async (productData) => {
    set({ loading: true, error: null });

    try {
      const status = productData.status === "aktif" ? "aktif" : "nonaktif";

      const createData: {
        name: string;
        description?: string;
        price: number;
        status: string;
        linkTokopedia?: string;
        linkShopee?: string;
        linkLazada?: string;
        linkBukalapak?: string;
        linkLainnya?: string;
        image?: File;
      } = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        status: status,
      };

      if (productData.linkTokopedia)
        createData.linkTokopedia = productData.linkTokopedia;
      if (productData.linkShopee)
        createData.linkShopee = productData.linkShopee;
      if (productData.linkLazada)
        createData.linkLazada = productData.linkLazada;
      if (productData.linkBukalapak)
        createData.linkBukalapak = productData.linkBukalapak;
      if (productData.linkLainnya)
        createData.linkLainnya = productData.linkLainnya;

      await productAPI.create(createData);

      // Refresh products list
      await get().fetchProductsData();

      console.log("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan produk",
        loading: false,
      });
      throw error;
    }
  },

  // Update product by ID
  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });

    try {
      let status: string | undefined;
      if (updates.status) {
        status = updates.status === "aktif" ? "aktif" : "nonaktif";
      }

      const updateData: {
        name?: string;
        description?: string;
        price?: number;
        status?: string;
        linkTokopedia?: string;
        linkShopee?: string;
        linkLazada?: string;
        linkBukalapak?: string;
        linkLainnya?: string;
        image?: File;
      } = {};

      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.price) updateData.price = updates.price;
      if (status) updateData.status = status;
      if (updates.linkTokopedia !== undefined)
        updateData.linkTokopedia = updates.linkTokopedia;
      if (updates.linkShopee !== undefined)
        updateData.linkShopee = updates.linkShopee;
      if (updates.linkLazada !== undefined)
        updateData.linkLazada = updates.linkLazada;
      if (updates.linkBukalapak !== undefined)
        updateData.linkBukalapak = updates.linkBukalapak;
      if (updates.linkLainnya !== undefined)
        updateData.linkLainnya = updates.linkLainnya;

      await productAPI.update(id, updateData);

      // Refresh products list
      await get().fetchProductsData();

      console.log("Product updated successfully:", id);
    } catch (error) {
      console.error("Error updating product:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui produk",
        loading: false,
      });
      throw error;
    }
  },

  // Delete product by ID
  deleteProduct: async (id) => {
    set({ loading: true, error: null });

    try {
      await productAPI.delete(id);

      // Refresh products list
      await get().fetchProductsData();

      console.log("Product deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting product:", error);
      set({
        error:
          error instanceof Error ? error.message : "Gagal menghapus produk",
        loading: false,
      });
      throw error;
    }
  },
}));