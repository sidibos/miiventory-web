import { useState } from "react";
import { Header } from "@/components/layout/Header";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "@/config";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    name: string;
    sku: string;
    stock: number;
    min_stock: number;
    category: string;
}

interface ProductResponse {
    data: Product[];
    total: number;
}

const StockLevels = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: productsData, isLoading } = useQuery<ProductResponse>({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await axios.get(`${config.apiURL}/products${config.slash}`);
            return response.data as ProductResponse;
        }
    });

    const filteredProducts = productsData?.data.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (stock: number, minStock: number) => {
        if (stock <= 0) {
            return { label: "Out of Stock", variant: "destructive" as const };
        }
        if (stock <= minStock) {
            return { label: "Low Stock", variant: "secondary" as const };
        }
        return { label: "In Stock", variant: "default" as const };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Stock Levels</h2>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {isLoading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Current Stock</TableHead>
                                    <TableHead>Minimum Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts?.map((product) => {
                                    const status = getStockStatus(product.stock, product.min_stock);
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.sku}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>{product.min_stock}</TableCell>
                                            <TableCell>
                                                <Badge variant={status.variant}>
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StockLevels;