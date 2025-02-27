import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import config from '@/config';
import { Supplier } from '@/types/supplier';

interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    stock: number;
    supplier_id?: string;
}

interface SelectedProduct extends Product {
    quantity: number;
    supplier_id: string;
}

const AddPurchaseOrder = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [open, setOpen] = useState(false); // State to control date picker popup
    const navigate = useNavigate();
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

    const fetchProductsBySupplier = async (supplierId: string) => {
        if (!supplierId) return;
        
        setIsLoadingProducts(true);
        try {
            const response = await axios.get<{ data: Product[], total: number }>(
                `${config.apiURL}/products/supplier/${supplierId}${config.slash}`
            );
            setProducts(response.data.data);
            setSelectedProductId(''); // Reset selected product when supplier changes
        } catch (error) {
            console.error('Error fetching products for supplier:', error);
            toast({
                title: "Error",
                description: "Failed to fetch products for this supplier",
                variant: "destructive",
            });
            setProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        if (selectedSupplierId) {
            fetchProductsBySupplier(selectedSupplierId);
        } else {
            setProducts([]);
        }
    }, [selectedSupplierId]);

    const handleSupplierChange = (supplierId: string) => {
        setSelectedSupplierId(supplierId);
        setSelectedProductId('');
    };

    const handleAddProduct = () => {
        if (!selectedProductId || !selectedSupplierId || quantity <= 0) {
            toast({
                title: "Error",
                description: "Please select a product and valid quantity",
                variant: "destructive",
            });
            return;
        }

        const product = products.find(p => p.id === selectedProductId);
        if (product) {
            setSelectedProducts([
                ...selectedProducts,
                {
                    ...product,
                    quantity,
                    supplier_id: selectedSupplierId
                }
            ]);
            setSelectedProductId('');
            setQuantity(1);
        }
    };

    const handleRemoveProduct = (index: number) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (selectedProducts.length === 0) {
            toast({
                title: "Error",
                description: "Please add at least one product",
                variant: "destructive",
            });
            return;
        }

        const orderData = {
            order_date: date.toISOString(),
            products: selectedProducts.map(product => ({
                product_id: product.id,
                supplier_id: product.supplier_id,
                quantity: product.quantity,
                price: product.price
            })),
            total_amount: selectedProducts.reduce((sum, product) => 
                sum + (product.price * product.quantity), 0
            ),
        };

        try {
            await axios.post(`${config.apiURL}/purchase-orders${config.slash}`, orderData);
            toast({
                title: "Success",
                description: "Purchase order created successfully",
            });
            navigate('/purchase-orders');
        } catch (error) {
            console.error('Error creating purchase order:', error);
            toast({
                title: "Error",
                description: "Failed to create purchase order",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Add New Purchase Order</h2>
                    <Button variant="outline" onClick={() => navigate('/purchase-orders')}>
                        Cancel
                    </Button>
                </div>
                
                <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Order Date</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(newDate) => {
                                            if (newDate) {
                                                setDate(newDate);
                                                setOpen(false); // Close the popover when date is selected
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Supplier</Label>
                            <Select value={selectedSupplierId} onValueChange={handleSupplierChange}>
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
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Add Products</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Product</Label>
                                <Select 
                                    value={selectedProductId} 
                                    onValueChange={setSelectedProductId} 
                                    disabled={!selectedSupplierId || isLoadingProducts}
                                >
                                    <SelectTrigger>
                                        <SelectValue 
                                            placeholder={
                                                isLoadingProducts 
                                                    ? "Loading products..." 
                                                    : !selectedSupplierId 
                                                        ? "Select a supplier first" 
                                                        : products.length === 0 
                                                            ? "No products available" 
                                                            : "Select product"
                                            } 
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Quantity</Label>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        type="number" 
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        disabled={!selectedProductId}
                                    />
                                    <Button 
                                        onClick={handleAddProduct} 
                                        disabled={!selectedProductId}
                                        className="whitespace-nowrap"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedProducts.length > 0 && (
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
                                                        Price: ${product.price * product.quantity}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveProduct(index)}
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
                                    Total: ${selectedProducts.reduce((sum, product) => 
                                        sum + (product.price * product.quantity), 0
                                    ).toFixed(2)}
                                </div>
                                <Button onClick={handleSubmit}>
                                    Create Purchase Order
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AddPurchaseOrder;