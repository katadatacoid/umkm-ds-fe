import DashboarUserLayout from "@/app/ui/layout/ds-user-layout";
import ProductForm from "@/app/ui/forms/product-form";

export default function AddProductPage() {
  return (
    <DashboarUserLayout path="user">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Tambah Produk Baru</h2>
        <ProductForm mode="add" />
      </div>
    </DashboarUserLayout>
  );
}
