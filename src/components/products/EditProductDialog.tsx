import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductFormData } from "./types";
import { Category } from "@/types/category";
import { Supplier } from "@/types/supplier";
import { BasicInfoFields } from "./BasicInfoFields";
import { PriceFields } from "./PriceFields";
import { CategorySupplierFields } from "./CategorySupplierFields";
import { InventoryFields } from "./InventoryFields";
import { useState } from "react";

interface EditProductDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    product: ProductFormData | null;
    categories: Category[];
    suppliers: Supplier[];
    onSave: (product: ProductFormData) => void;
}

export const EditProductDialog = ({
    isOpen,
    onOpenChange,
    product,
    categories,
    suppliers,
    onSave
}: EditProductDialogProps) => {
    const [editForm, setEditForm] = useState<ProductFormData | null>(product);

    if (!product) return null;

    const handleChange = (updates: Partial<ProductFormData>) => {
        setEditForm(prev => ({ ...prev!, ...updates }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editForm) {
            onSave(editForm);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <BasicInfoFields product={editForm!} onChange={handleChange} />
                    <PriceFields product={editForm!} onChange={handleChange} />
                    <CategorySupplierFields 
                        product={editForm!}
                        categories={categories}
                        suppliers={suppliers}
                        onChange={handleChange}
                    />
                    <InventoryFields product={editForm!} onChange={handleChange} />
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};