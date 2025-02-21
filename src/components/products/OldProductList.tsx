import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/config';
import { Eye, Edit, Plus, Trash } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Supplier } from '@/types/supplier';
import { Category } from '@/types/category';

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
    status: 'pending'
};

const ITEMS_PER_PAGE = 10;

export const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState<Product>(defaultProduct);
    const [newProduct, setNewProduct] = useState<Product>(defaultProduct);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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

    useEffect(() => {
        fetchSuppliers();
        fetchCategories();
        fetchProducts(currentPage);
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

    const handleSelectChange = (value: string, form: 'edit' | 'new') => {
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, supplier: value }));
        } else {
            setNewProduct(prev => ({ ...prev, supplier: value }));
        }
    };

    const handleCategorySelectChange = (value: string, form: 'edit' | 'new') => {
        if (form === 'edit') {
            setEditForm(prev => ({ ...prev, category: value }));
        } else {
            setNewProduct(prev => ({ ...prev, category: value }));
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

    const handleCreateProduct = async () => {
        try {
            await axios.post(`${config.apiURL}/products/`, newProduct);
            await fetchProducts(currentPage);
            setIsCreateOpen(false);
            setNewProduct(defaultProduct);
            toast({
                title: "Success",
                description: "Product created successfully",
            });
        } catch (error) {
            console.error('Error creating product:', error);
            toast({
                title: "Error",
                description: "Failed to create product",
                variant: "destructive",
            });
        }
    };

    const handleDeleteProduct = async () => {
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

    const getSupplierName = (supplierId: string) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.name : 'Unknown Supplier';
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Unknown Categrory';
    };

    return (
        <div className="rounded-lg border bg-card">
            <div className="p-4">
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Selling Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Min Stock</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="font-medium">{product.slug}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.selling_price.toFixed(2)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.min_stock}</TableCell>
                            <TableCell>{getCategoryName(product.category)}</TableCell>
                            <TableCell>{getSupplierName(product.supplier)}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    product.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {product.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewClick(product)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(product)}
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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

            {/* View Product Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">{selectedProduct?.name}</h3>
                            <p className="text-sm text-gray-500">{selectedProduct?.slug}</p>
                            <p className="text-sm text-gray-500">{selectedProduct?.description}</p>
                        </div>
                        <div className="grid gap-4">
                            <div>
                                <Label>SKU</Label>
                                <p className="text-gray-600">{selectedProduct?.sku}</p>
                            </div>
                            <div>
                                <Label>Price</Label>
                                <p className="text-gray-600">${selectedProduct?.price.toFixed(2)}</p>
                            </div>
                            <div>
                                <Label>Price</Label>
                                <p className="text-gray-600">${selectedProduct?.selling_price.toFixed(2)}</p>
                            </div>
                            <div>
                                <Label>Stock</Label>
                                <p className="text-gray-600">{selectedProduct?.stock} units</p>
                            </div>
                            <div>
                                <Label>Stock</Label>
                                <p className="text-gray-600">{selectedProduct?.min_stock} units</p>
                            </div>
                            <div>
                                <Label>Category</Label>
                                <p className="text-gray-600">
                                    {selectedProduct ? getSupplierName(selectedProduct.category) : ''}
                                </p>
                            </div>
                            <div>
                                <Label>Supplier</Label>
                                <p className="text-gray-600">
                                    {selectedProduct ? getSupplierName(selectedProduct.supplier) : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

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

            {/* Create Product Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="new-name">Name</Label>
                            <Input
                                id="new-name"
                                name="name"
                                value={newProduct.name}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-name">Slug</Label>
                            <Input
                                id="new-slug"
                                name="slug"
                                value={newProduct.slug}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-description">Description</Label>
                            <Input
                                id="new-description"
                                name="description"
                                value={newProduct.description}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-price">Price</Label>
                            <Input
                                id="new-price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={newProduct.price}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-sku">SKU</Label>
                            <Input
                                id="new-sku"
                                name="sku"
                                value={newProduct.sku}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-stock">Stock</Label>
                            <Input
                                id="new-stock"
                                name="stock"
                                type="number"
                                value={newProduct.stock}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="new-stock">Min Stock</Label>
                            <Input
                                id="new-min_stock"
                                name="min_stock"
                                type="number"
                                value={newProduct.min_stock}
                                onChange={(e) => handleInputChange(e, 'new')}
                            />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <Select
                                value={newProduct.category}
                                onValueChange={(value) => handleCategorySelectChange(value, 'new')}
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
                                value={newProduct.supplier}
                                onValueChange={(value) => handleSelectChange(value, 'new')}
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
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    setNewProduct(defaultProduct);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateProduct}>
                                Create Product
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};