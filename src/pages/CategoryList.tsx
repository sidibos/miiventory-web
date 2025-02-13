import { Header } from "@/components/layout/Header";
import { CategoryList } from "@/components/categories/CategoryList";

const Categories = () => {
    return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Categories</h2>
            <CategoryList />
          </main>
        </div>
      );
};

export default Categories;