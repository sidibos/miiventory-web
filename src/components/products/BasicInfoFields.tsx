import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "./types";

interface BasicInfoFieldsProps {
    product: ProductFormData;
    onChange: (updates: Partial<ProductFormData>) => void;
}

export const BasicInfoFields = ({ product, onChange }: BasicInfoFieldsProps) => {
    return (
        <>
            <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    value={product.slug}
                    onChange={(e) => onChange({ slug: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={product.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    required
                />
            </div>
        </>
    );
};