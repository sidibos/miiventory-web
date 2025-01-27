import { Package2 } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Inventory Manager</h1>
        </div>
      </div>
    </header>
  );
};