import { Header } from "@/components/layout/Header";
import { CustomerList } from "@/components/customers/CustomerList";

const Customers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Customers</h2>
        <CustomerList />
      </main>
    </div>
  );
};

export default Customers;