import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryList } from "@/components/inventory/InventoryList";
import { Package2, PackageOpen, Archive, BarChart2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Items"
            value="1,234"
            icon={Package2}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Low Stock Items"
            value="8"
            icon={PackageOpen}
            trend={{ value: 2, isPositive: false }}
          />
          <StatsCard
            title="Categories"
            value="12"
            icon={Archive}
          />
          <StatsCard
            title="Total Value"
            value="$45,678"
            icon={BarChart2}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
        
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Inventory Items</h2>
          <InventoryList />
        </div>
      </main>
    </div>
  );
};

export default Index;