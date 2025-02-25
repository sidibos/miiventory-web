
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Product } from "@/types/product";
import { Supplier } from "@/types/supplier";

interface ProductSelectionFormProps {
    products: Product[];
    suppliers: Supplier[];
    selectedProductId: string;
    selectedSupplierId: string;
    quantity: number;
    onProductChange: (value: string) => void;
    onSupplierChange: (value: string) => void;
    onQuantityChange: (value: number) => void;
    onAddProduct: () => void;
}

export const ProductSelectionForm = ({
    products,
    suppliers,
    selectedProductId,
    selectedSupplierId,
    quantity,
    onProductChange,
    onSupplierChange,
    onQuantityChange,
    onAddProduct,
}: ProductSelectionFormProps) => {
    return (
        <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Add Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <Label>Product</Label>
                    <Select
                        value={selectedProductId}
                        onValueChange={onProductChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                    {product.name} (${product.price})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Supplier</Label>
                    <Select
                        value={selectedSupplierId}
                        onValueChange={onSupplierChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
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
                    <Label>Quantity</Label>
                    <Input 
                        type="number" 
                        min="1"
                        value={quantity}
                        onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                    />
                </div>
                <div className="flex items-end">
                    <Button onClick={onAddProduct} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </div>
            </div>
        </div>
    );
};
