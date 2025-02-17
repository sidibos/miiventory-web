import { Header } from "@/components/layout/Header";
import { PurchaseOrderList } from "@/components/purchase-orders/PurchaseOrderList";

const PurchaseOrders = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">Purchase Orders</h2>
                <PurchaseOrderList />
            </main>
        </div>
    );
};

export default PurchaseOrders;