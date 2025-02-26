import { Header } from "@/components/layout/Header";
import { PurchaseOrderList } from "@/components/purchase-orders/PurchaseOrderList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PurchaseOrders = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Purchase Orders</h2>
                    <Button onClick={() => navigate('/purchase-orders/add')}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Purchase
                    </Button>
                </div>
                <PurchaseOrderList />
            </main>
        </div>
    );
};

export default PurchaseOrders;