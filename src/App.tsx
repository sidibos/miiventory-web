import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import UserProfile from "./pages/UserProfile";
import CategoryList from "./pages/CategoryList";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";
import SalesOrderList from "./pages/SalesOrdersList";
import AddSalesOrder from "./pages/AddSalesOrder";
import PurchaseOrders from "./pages/PurchaseOrders";
import AddPurchaseOrder from "./pages/AddPurchaseOrder";
import StockLevels from "./pages/StockLevels";
import AddProduct from "./pages/AddProduct";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/users" element={<Users />} />
            <Route path="users/:email" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/stock-levels" element={<StockLevels />} />
            <Route path="/orders" element={<NotFound />} />
            <Route path="/sales-orders" element={<SalesOrderList />} />
            <Route path="/sales-orders/add" element={<AddSalesOrder />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/purchase-orders/add" element={<AddPurchaseOrder />} />
            <Route path="/transfer-orders" element={<NotFound />} />
            <Route path="/reports" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;