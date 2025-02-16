
import { Header } from "@/components/layout/Header";
import { SalesOrderList } from "@/components/sales-orders/SalesOrderList";

const SalesOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Sales Orders</h2>
        <SalesOrderList />
      </main>
    </div>
  );
};

export default SalesOrders;