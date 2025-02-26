import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ProductFormData } from "./types";
import { Category } from "@/types/category";
import { Supplier } from "@/types/supplier";

interface ViewProductDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    product: ProductFormData | null;
    categories: Category[];
    suppliers: Supplier[];
}

export const ViewProductDialog = ({
    isOpen,
    onOpenChange,
    product,
    categories,
    suppliers
}: ViewProductDialogProps) => {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Name</Label>
                            <p className="text-sm">{product.name}</p>
                        </div>
                        <div>
                            <Label>SKU</Label>
                            <p className="text-sm">{product.sku}</p>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <p className="text-sm">{product.description}</p>
                        </div>
                        <div>
                            <Label>Price</Label>
                            <p className="text-sm">${product.price}</p>
                        </div>
                        <div>
                            <Label>Stock</Label>
                            <p className="text-sm">{product.stock}</p>
                        </div>
                        <div>
                            <Label>Minimum Stock</Label>
                            <p className="text-sm">{product.min_stock}</p>
                        </div>
                        <div>
                            <Label>Category</Label>
                            <p className="text-sm">
                                {categories.find(c => c.id === product.category)?.name}
                            </p>
                        </div>
                        <div>
                            <Label>Supplier</Label>
                            <p className="text-sm">
                                {suppliers.find(s => s.id === product.supplier)?.name}
                            </p>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <p className="text-sm capitalize">{product.status}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};