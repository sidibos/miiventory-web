import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import config from "@/config";
import { useNavigate } from "react-router-dom";
import { Category } from "@/types/category";
import { Supplier } from "@/types/supplier";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BasicInfoFields } from "./BasicInfoFields";
import { PriceFields } from "./PriceFields";
import { CategorySupplierFields } from "./CategorySupplierFields";
import { InventoryFields } from "./InventoryFields";
import { ProductFormData, defaultProduct } from "./types";

export const ProductForm = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductFormData>(defaultProduct);
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
      setProduct(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${config.apiURL}/products/`, product);
      setProduct(defaultProduct);
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

  const handleChange = (updates: Partial<ProductFormData>) => {
    setProduct(prev => ({ ...prev, ...updates }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicInfoFields product={product} onChange={handleChange} />
          <PriceFields product={product} onChange={handleChange} />
          <CategorySupplierFields 
            product={product}
            categories={categories}
            suppliers={suppliers}
            onChange={handleChange}
          />
          <InventoryFields product={product} onChange={handleChange} />

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
              {product.image && (
                <div className="text-sm text-gray-500">
                  Selected: {product.image.name}
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