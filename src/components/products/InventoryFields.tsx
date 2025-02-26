import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "./types";

interface InventoryFieldsProps {
    product: ProductFormData;
    onChange: (updates: Partial<ProductFormData>) => void;
}

export const InventoryFields = ({ product, onChange }: InventoryFieldsProps) => {
    return (
        <>
            <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                    id="sku"
                    value={product.sku}
                    onChange={(e) => onChange({ sku: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                    id="stock"
                    type="number"
                    value={product.stock}
                    onChange={(e) => onChange({ stock: parseInt(e.target.value) })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="min_stock">Minimum Stock</Label>
                <Input
                    id="min_stock"
                    type="number"
                    value={product.min_stock}
                    onChange={(e) => onChange({ min_stock: parseInt(e.target.value) })}
                    required
                />
            </div>
        </>
    );
};