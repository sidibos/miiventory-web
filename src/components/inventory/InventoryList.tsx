import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InventoryCard } from "./InventoryCard";
import { Search } from "lucide-react";

// Mock data for initial version
const mockItems = [
  { id: 1, name: "Laptop", quantity: 5, category: "Electronics", sku: "LAP001" },
  { id: 2, name: "Desk Chair", quantity: 12, category: "Furniture", sku: "CHR001" },
  { id: 3, name: "Notebook", quantity: 150, category: "Stationery", sku: "NB001" },
];

export const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = mockItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onEdit={() => console.log("Edit", item.id)}
            onDelete={() => console.log("Delete", item.id)}
          />
        ))}
      </div>
    </div>
  );
};