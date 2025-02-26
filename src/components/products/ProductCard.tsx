import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash, Edit } from 'lucide-react';
import { ProductFormData } from "./types";
import { Category } from "@/types/category";

interface ProductCardProps {
    product: ProductFormData;
    categories: Category[];
    onView: (product: ProductFormData) => void;
    onDelete: (product: ProductFormData) => void;
    onEdit: (product: ProductFormData) => void;
}

export const ProductCard = ({ 
    product, 
    categories,
    onView, 
    onDelete,
    onEdit
}: ProductCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                <p className="text-sm text-gray-500">
                    Category: {categories.find(c => c.id === product.category)?.name}
                </p>
                <p className="text-lg font-semibold">${product.price}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(product)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product)}
                    >
                        <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};