import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "./types";

interface PriceFieldsProps {
    product: ProductFormData;
    onChange: (updates: Partial<ProductFormData>) => void;
}

export const PriceFields = ({ product, onChange }: PriceFieldsProps) => {
    return (
        <>
            <div>
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => onChange({ price: parseFloat(e.target.value) })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="selling_price">Selling Price</Label>
                <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    value={product.selling_price}
                    onChange={(e) => onChange({ selling_price: parseFloat(e.target.value) })}
                    required
                />
            </div>
        </>
    );
};