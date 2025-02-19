import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import config from '@/config';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sku: string;
    stock: number;
    min_stock: number;
    selling_price: number;
    supplier: string;
    category: string;
    status: 'active' | 'inactive' | 'pending';
    image:  File | null;
}

const ITEMS_PER_PAGE = 10;

export const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchProducts = async (page: number) => {
    try {
        const response = await axios.get<{ data: Product[], total: number }>(
            `${config.apiURL}/products${config.slash}?page=${page}&limit=${ITEMS_PER_PAGE}`
        );
        
        setProducts(response.data.data);
        let totalPages = Math.ceil(response.data.total / ITEMS_PER_PAGE);
        if (totalPages === 0 || Number.isNaN(totalPages)) totalPages = 1;
        setTotalPages(totalPages);
    } catch (error) {
        console.error('Error fetching products:', error);
        toast({
            title: "Error",
            description: "Failed to fetch products",
            variant: "destructive",
        });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => navigate("/products/add")}>
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <p className="text-lg font-semibold">${product.price}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    </div>
  );
};