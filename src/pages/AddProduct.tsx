import { ProductForm } from "@/components/products/ProductForm";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AddProduct = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/products">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900">Add New Product</h2>
        </div>
        <ProductForm />
      </main>
    </div>
  );
};

export default AddProduct;
