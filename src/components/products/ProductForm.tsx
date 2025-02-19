
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "@/config";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Supplier {
  id: string;
  name: string;
  company_name: string;
}

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

const defaultProduct: Product = {
    id: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    sku: '',
    stock: 0,
    min_stock: 0,
    selling_price: 0,
    supplier: '',
    category: '',
    status: 'pending',
    image: null
};

const ITEMS_PER_PAGE = 10;

export const ProductForm = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState<Product>(defaultProduct);
  const [totalPages, setTotalPages] = useState(1);
  //const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  //const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get<Category[]>(`${config.apiURL}/categories/`);
      return response.data;
    }
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get<Supplier[]>(`${config.apiURL}/suppliers/`);
      return response.data;
    }
  });


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
    }
  };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("New product with image:", newProduct);
//     toast({
//       title: "Success",
//       description: "Product added successfully",
//     });
    
//     navigate("/products");
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post(`${config.apiURL}/products/`, newProduct);
        setNewProduct(defaultProduct);
        toast({
            title: "Success",
            description: "Product created successfully",
        });
        navigate("/products");
    } catch (error) {
        console.error('Error creating product:', error);
        toast({
            title: "Error",
            description: "Failed to create product",
            variant: "destructive",
        });
    }
 };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>

           <div>
                <Label htmlFor="edit-name">Slug</Label>
                <Input
                id="add-slug"
                name="slug"
                value={newProduct.slug}
                onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                />
            </div>
          
            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
                />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={newProduct.category}
              onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Select 
              value={newProduct.supplier}
              onValueChange={(value) => setNewProduct({ ...newProduct, supplier: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              {newProduct.image && (
                <div className="text-sm text-gray-500">
                  Selected: {newProduct.image.name}
                </div>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
