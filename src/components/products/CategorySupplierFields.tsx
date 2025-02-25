
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
    return (
        <>
            <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                    value={product.category}
                    onValueChange={(value) => onChange({ category: value })}
                >
                    <SelectTrigger className="bg-white">
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
                    value={product.supplier}
                    onValueChange={(value) => onChange({ supplier: value })}
                >
                    <SelectTrigger className="bg-white">
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
        </>
    );
};
