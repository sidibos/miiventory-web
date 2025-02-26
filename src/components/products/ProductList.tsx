import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import config from '@/config';
import axios from 'axios';
import { Eye, Edit, Plus, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Supplier } from '@/types/supplier';
import { Category } from '@/types/category';
import { ProductFormData } from "./types";
import { ProductCard  } from "./ProductCard";
import { ViewProductDialog } from "./ViewProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";



interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sku: string;
    stock: number;
    min_stock: number;
    selling_price: number;
    supplier: string;
    category: string;
    status: 'active' | 'inactive' | 'pending';
    image:  File | null;
}

const defaultProduct: Product = {
    id: '',
    name: '',
    slug: '',
    description: '',
    price: 0,
    sku: '',
    stock: 0,
    min_stock: 0,
    selling_price: 0,
    supplier: '',
    category: '',
    status: 'pending',
    image: null
};

const ITEMS_PER_PAGE = 10;

export const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<Product>(defaultProduct);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<Product>(defaultProduct);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get<Supplier[]>(`${config.apiURL}/suppliers${config.slash}`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast({
                title: "Error",
                description: "Failed to fetch suppliers",
                variant: "destructive",
            });
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get<Category[]>(`${config.apiURL}/categories${config.slash}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast({
                title: "Error",
                description: "Failed to fetch categories",
                variant: "destructive",
            });
        }
    };

    const fetchProducts = async (page: number) => {
        try {
            const response = await axios.get<{ data: Product[], total: number }>(
                `${config.apiURL}/products${config.slash}?page=${page}&limit=${ITEMS_PER_PAGE}`
            );
            
            setProducts(response.data.data);
            let totalPages = Math.ceil(response.data.total / ITEMS_PER_PAGE);
            if (totalPages === 0 || Number.isNaN(totalPages)) totalPages = 1;
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: "Error",
                description: "Failed to fetch products",
                variant: "destructive",
            });
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchProducts(currentPage);
        fetchSuppliers();
        fetchCategories();
    }, [currentPage]);

    const handleEditClick = (product: Product) => {
        setEditForm(product);
        setIsEditOpen(true);
    };

    const handleViewClick = (product: Product) => {
        setSelectedProduct(product);
        setIsViewOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

   const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: 'edit' | 'new'
   ) => {
        const { name, value } = e.target;
        const processedValue = name === 'price' || name === 'stock' 
            ? parseFloat(value) 
            : value;
            
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, [name]: processedValue }));
        } else {
            setNewProduct(prev => ({ ...prev, [name]: processedValue }));
        }
  };

   const handleCategorySelectChange = (value: string, form: 'edit' | 'new') => {
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, category: value }));
        } else {
            setNewProduct(prev => ({ ...prev, category: value }));
        }
   };

    const handleSelectChange = (value: string, form: 'edit' | 'new') => {
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, supplier: value }));
        } else {
            setNewProduct(prev => ({ ...prev, supplier: value }));  
        }
    };

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`${config.apiURL}/products/${editForm.id}${config.slash}`, editForm);
            await fetchProducts(currentPage);
            setIsEditOpen(false);
            toast({
                title: "Success",
                description: "Product updated successfully",
            });
        } catch (error) {
            console.error('Error updating product:', error);
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            });
        }
    };


    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;

        try {
            await axios.delete(`${config.apiURL}/products/${selectedProduct.id}${config.slash}`);
            await fetchProducts(currentPage);
            setIsDeleteDialogOpen(false);
            toast({
                title: "Success",
                description: "Product deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            toast({
                title: "Error",
                description: "Failed to delete product",
                variant: "destructive",
            });
        }
    };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => navigate("/products/add")}>
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products
                .filter((product) =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        categories={categories}
                        onView={handleViewClick}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
            ))}
        </div>

        <ViewProductDialog
                isOpen={isViewOpen}
                onOpenChange={setIsViewOpen}
                product={selectedProduct}
                categories={categories}
                suppliers={suppliers}
        />

        <DeleteProductDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
        />
      
        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                            id="edit-name"
                            name="name"
                            value={editForm.name}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-name">Slug</Label>
                        <Input
                            id="edit-slug"
                            name="slug"
                            value={editForm.slug}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Input
                            id="edit-description"
                            name="description"
                            value={editForm.description}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-price">Price</Label>
                        <Input
                            id="edit-price"
                            name="price"
                            type="number"
                            step="0.01"
                            value={editForm.price}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-price">Selling Price</Label>
                        <Input
                            id="edit-selling_price"
                            name="selling_price"
                            type="number"
                            step="0.01"
                            value={editForm.selling_price}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-sku">SKU</Label>
                        <Input
                            id="edit-sku"
                            name="sku"
                            value={editForm.sku}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-stock">Stock</Label>
                        <Input
                            id="edit-stock"
                            name="stock"
                            type="number"
                            value={editForm.stock}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-stock">Min Stock</Label>
                        <Input
                            id="edit-min_stock"
                            name="min_stock"
                            type="number"
                            value={editForm.min_stock}
                            onChange={(e) => handleInputChange(e, 'edit')}
                        />
                    </div>
                    <div>
                        <Label>Category</Label>
                        <Select
                            value={editForm.category}
                            onValueChange={(value) => handleCategorySelectChange(value, 'edit')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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
                        <Label>Supplier</Label>
                        <Select
                            value={editForm.supplier}
                            onValueChange={(value) => handleSelectChange(value, 'edit')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateProduct}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
};