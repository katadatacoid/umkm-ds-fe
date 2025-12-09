import { create } from "zustand";

// ----------------------
// Types
// ----------------------
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

interface UserProductsState {
  products: Product[];
  statsData: StatItem[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchProductsData: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

// ----------------------
// Zustand Store
// ----------------------
export const useUserProductsStore = create<UserProductsState>((set, get) => ({
  products: [],
  statsData: [
    { title: "Total Produk", value: 50, description: "Jumlah seluruh produk." },
    { title: "Aktif", value: 40, description: "Produk yang aktif saat ini." },
    { title: "Non-Aktif", value: 10, description: "Produk yang non-aktif." },
  ],
  loading: false,
  error: null,

  // Fetch dummy data
  fetchProductsData: async () => {
    set({ loading: true, error: null });

    function generateRandomDate(): string {
      const start = new Date(2025, 6, 1); // July 1, 2025
      const end = new Date(2025, 9, 1); // October 1, 2025
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`; // "03/08/2025"
    }

    try {
      // Simulate network delay (for UI preview)
      await new Promise((r) => setTimeout(r, 400));

      // Dummy static data for now
      const dummyProducts: Product[] = [
        {
          id: 1,
          name: "Kopi Arabica Aceh Gayo 250g",
          price: 89000,
          linkTokopedia: "https://tokopedia.com/kopi-arabica-aceh-gayo-250g",
          linkShopee: "https://shopee.com/kopi-arabica-aceh-gayo-250g",
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Kopi arabica premium dengan aroma khas dan cita rasa kuat.",
          image: "/images/user/product-1.jpg",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 2,
          name: "Beras Organik Pandan Wangi 5kg",
          price: 135000,
          linkTokopedia: "https://tokopedia.com/beras-organik-pandan-wangi-5kg",
          linkShopee: undefined,
          linkLazada: "https://lazada.com/beras-organik-pandan-wangi-5kg",
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Beras organik pilihan dengan wangi pandan yang alami.",
          image: "/images/products/sample2.png",
          status: "non-aktif",
          date: generateRandomDate(),
        },
        {
          id: 3,
          name: "Madu Hutan Murni 250ml",
          price: 75000,
          linkTokopedia: undefined,
          linkShopee: "https://shopee.com/madu-hutan-murni-250ml",
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Madu alami langsung dari hutan tanpa campuran bahan lain.",
          image: "/images/products/sample3.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 4,
          name: "Keripik Pisang Cokelat 200g",
          price: 32000,
          linkTokopedia: "https://tokopedia.com/keripik-pisang-cokelat-200g",
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Cemilan manis gurih dengan rasa cokelat yang nikmat.",
          image: "/images/products/sample4.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 5,
          name: "Teh Hijau Premium 100g",
          price: 46000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Daun teh hijau pilihan dengan aroma segar dan menenangkan.",
          image: "/images/products/sample5.png",
          status: "non-aktif",
          date: generateRandomDate(),
        },
        {
          id: 6,
          name: "Sambal Cumi Pedas 150g",
          price: 55000,
          linkTokopedia: "https://tokopedia.com/sambal-cumi-pedas-150g",
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: "https://bukalapak.com/sambal-cumi-pedas-150g",
          linkLainnya: undefined,
          description: "Sambal cumi pedas khas Indonesia yang menggugah selera.",
          image: "/images/products/sample6.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 7,
          name: "Kerupuk Ikan Tenggiri 500g",
          price: 39000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Kerupuk ikan gurih dan renyah dari ikan tenggiri segar.",
          image: "/images/products/sample7.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 8,
          name: "Minyak Kelapa Murni 1L",
          price: 78000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: "https://bukalapak.com/minyak-kelapa-murni-1l",
          linkLainnya: undefined,
          description: "Minyak kelapa alami untuk masakan dan perawatan tubuh.",
          image: "/images/products/sample8.png",
          status: "non-aktif",
          date: generateRandomDate(),
        },
        {
          id: 9,
          name: "Tempe Organik 1 Papan",
          price: 15000,
          linkTokopedia: "https://tokopedia.com/tempe-organik-1-papan",
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Tempe sehat dari kedelai non-GMO berkualitas tinggi.",
          image: "/images/products/sample9.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 10,
          name: "Cokelat Batang Artisan 100g",
          price: 45000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Cokelat premium handmade dengan rasa lembut dan legit.",
          image: "/images/products/sample10.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 11,
          name: "Kopi Robusta Lampung 250g",
          price: 78000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Kopi robusta khas Lampung dengan aroma kuat dan pahit seimbang.",
          image: "/images/products/sample11.png",
          status: "non-aktif",
          date: generateRandomDate(),
        },
        {
          id: 12,
          name: "Jahe Merah Bubuk 100g",
          price: 25000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: "https://lazada.com/jahe-merah-bubuk-100g",
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Jahe merah murni bubuk untuk minuman hangat sehat alami.",
          image: "/images/products/sample12.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 13,
          name: "Kerupuk Udang 500g",
          price: 42000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Kerupuk udang renyah dengan rasa gurih alami.",
          image: "/images/products/sample13.png",
          status: "aktif",
          date: generateRandomDate(),
        },
        {
          id: 14,
          name: "Nasi Instan Rendang 300g",
          price: 65000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Makanan siap saji rendang padang dengan cita rasa otentik.",
          image: "/images/products/sample14.png",
          status: "non-aktif",
          date: generateRandomDate(),
        },
        {
          id: 15,
          name: "Kacang Mede Panggang 250g",
          price: 67000,
          linkTokopedia: undefined,
          linkShopee: undefined,
          linkLazada: undefined,
          linkBukalapak: undefined,
          linkLainnya: undefined,
          description: "Kacang mede panggang dengan rasa gurih dan tekstur renyah.",
          image: "/images/products/sample15.png",
          status: "aktif",
          date: generateRandomDate(),
        },
      ];

      // Compute derived stats
      const total = dummyProducts.length;
      const aktif = dummyProducts.filter((p) => p.status === "aktif").length;
      const nonAktif = dummyProducts.filter((p) => p.status === "non-aktif").length;

      const updatedStats: StatItem[] = [
        { title: "Total Produk", value: total, description: "Jumlah seluruh produk." },
        { title: "Aktif", value: aktif, description: "Produk yang aktif saat ini." },
        { title: "Non-Aktif", value: nonAktif, description: "Produk yang non-aktif." },
      ];

      set({
        products: dummyProducts,
        statsData: updatedStats,
        loading: false,
      });
    } catch (error) {
      set({ error: "Gagal memuat data produk", loading: false });
    }
  },

  // Add a new product
  addProduct: async (product) => {
    set({ loading: true });

    try {
      const newProducts = [...get().products, product];

      // Recalculate stats
      const total = newProducts.length;
      const aktif = newProducts.filter((p) => p.status === "aktif").length;
      const nonAktif = newProducts.filter((p) => p.status === "non-aktif").length;

      const updatedStats: StatItem[] = [
        { title: "Total Produk", value: total },
        { title: "Aktif", value: aktif },
        { title: "Non-Aktif", value: nonAktif },
      ];

      set({ products: newProducts, statsData: updatedStats, loading: false });
      console.log("Product added to store:", product);
    } catch {
      set({ error: "Gagal menambahkan produk", loading: false });
    }
  },

  // Update product by ID
  updateProduct: async (id, updates) => {
    set({ loading: true });
    try {
      const newProducts = get().products.map((p) => (p.id === id ? { ...p, ...updates } : p));

      // Recalculate stats
      const total = newProducts.length;
      const aktif = newProducts.filter((p) => p.status === "aktif").length;
      const nonAktif = newProducts.filter((p) => p.status === "non-aktif").length;

      const updatedStats: StatItem[] = [
        { title: "Total Produk", value: total },
        { title: "Aktif", value: aktif },
        { title: "Non-Aktif", value: nonAktif },
      ];

      set({ products: newProducts, statsData: updatedStats, loading: false });
      console.log("Product updated:", id);
    } catch {
      set({ error: "Gagal memperbarui produk", loading: false });
    }
  },

  // Delete product by ID
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const newProducts = get().products.filter((p) => p.id !== id);

      // Recalculate stats
      const total = newProducts.length;
      const aktif = newProducts.filter((p) => p.status === "aktif").length;
      const nonAktif = newProducts.filter((p) => p.status === "non-aktif").length;

      const updatedStats: StatItem[] = [
        { title: "Total Produk", value: total },
        { title: "Aktif", value: aktif },
        { title: "Non-Aktif", value: nonAktif },
      ];

      set({ products: newProducts, statsData: updatedStats, loading: false });
      console.log("Product deleted:", id);
    } catch {
      set({ error: "Gagal menghapus produk", loading: false });
    }
  },
}));
