import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/category";
import { Supplier } from "@/types/supplier";
import { ProductFormData } from "./types";
import { useEffect, useState } from "react";

interface CategorySupplierFieldsProps {
    product: ProductFormData;
    categories: Category[];
    suppliers: Supplier[];
    onChange: (updates: Partial<ProductFormData>) => void;
}

export const CategorySupplierFields = ({ 
    product, 
    categories, 
    suppliers, 
    onChange 
}: CategorySupplierFieldsProps) => {
    // Convert IDs to strings for comparison
    const [selectedCategory, setSelectedCategory] = useState<Category>(null);
    const[selectedSupplier, setSelectedSupplier] = useState<Supplier>(null);


    const handleCategoryChange = (value: string) => {
        console.log('Category changed to:', value);
        onChange({ category: value });
        console.log('prd cat: ' + value);
        setSelectedCategory(categories.find(c => c.id === value));
    };

    const handleSupplierChange = (value: string) => {
        console.log('Supplier changed to:', value);

        onChange({ supplier: value });
        setSelectedSupplier(suppliers.find(s => s.id == value));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                    value={String(product.category)}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger id="category" className="w-full bg-white">
                        <SelectValue placeholder="Select a category">
                            {selectedCategory?.name || "Select a category"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem 
                                key={category.id} 
                                value={String(category.id)}
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select 
                    value={String(product.supplier)}
                    onValueChange={handleSupplierChange}
                >
                    <SelectTrigger id="supplier" className="w-full bg-white">
                        <SelectValue placeholder="Select a supplier">
                            {selectedSupplier ? 
                                `${selectedSupplier.name} - ${selectedSupplier.company_name}` : 
                                "Select a supplier"
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {suppliers.map((supplier) => (
                            <SelectItem 
                                key={supplier.id} 
                                value={String(supplier.id)}
                            >
                                {supplier.name} - {supplier.company_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};