
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { SelectedProduct } from "@/types/product";
import { Supplier } from "@/types/supplier";

interface SelectedProductsListProps {
    selectedProducts: SelectedProduct[];
    suppliers: Supplier[];
    onRemoveProduct: (index: number) => void;
    onSubmit: () => void;
}

export const SelectedProductsList = ({
    selectedProducts,
    suppliers,
    onRemoveProduct,
    onSubmit,
}: SelectedProductsListProps) => {
    if (selectedProducts.length === 0) return null;

    const total = selectedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Selected Products</h3>
            <div className="space-y-3">
                {selectedProducts.map((product, index) => {
                    const supplier = suppliers.find(s => s.id === product.supplier_id);
                    return (
                        <Card key={index}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Supplier: {supplier?.name} | Quantity: {product.quantity} |
                                        Price: ${(product.price * product.quantity).toFixed(2)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveProduct(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-medium">
                    Total: ${total.toFixed(2)}
                </div>
                <Button onClick={onSubmit}>
                    Create Purchase Order
                </Button>
            </div>
        </div>
    );
};
