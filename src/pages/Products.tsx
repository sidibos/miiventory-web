
import { Header } from "@/components/layout/Header";
import { ProductList } from "@/components/products/ProductList";

const Products = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Products</h2>
        <ProductList />
      </main>
    </div>
  );
};

export default Products;