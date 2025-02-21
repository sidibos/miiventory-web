
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductDragList } from "@/components/purchase-orders/ProductDragList";
import { OrderHeader } from "@/components/purchase-orders/OrderHeader";
import { OrderSummary } from "@/components/purchase-orders/OrderSummary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import config from '@/config';
import { Supplier } from '@/types/supplier';

interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    stock: number;
    thumbnail?: string;
    image?: File;
}

interface SelectedProduct extends Product {
    quantity: number;
}

const ITEMS_PER_PAGE = 10;

const AddPurchaseOrder = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [orderStatus, setOrderStatus] = useState<string>('pending');
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

    const fetchProducts = async () => {
        try {
            const response = await axios.get<{ data: Product[], total: number }>(
                `${config.apiURL}/products${config.slash}`
            );
            setProducts(response.data.data);
            setAvailableProducts(response.data.data);
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
        fetchProducts();
    }, []);

    const handleImageUpload = async (productId: string, file: File) => {
        const updatedProducts = selectedProducts.map(product => {
            if (product.id === productId) {
                return { ...product, image: file };
            }
            return product;
        });
        setSelectedProducts(updatedProducts);
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === 'available-products' && destination.droppableId === 'selected-products') {
            const product = availableProducts[source.index];
            const selectedProduct: SelectedProduct = {
                ...product,
                quantity: 1
            };

            setSelectedProducts([...selectedProducts, selectedProduct]);
            setAvailableProducts(availableProducts.filter(p => p.id !== product.id));
        } else if (source.droppableId === 'selected-products' && destination.droppableId === 'available-products') {
            const product = selectedProducts[source.index];
            setAvailableProducts([...availableProducts, products.find(p => p.id === product.id)!]);
            setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
        }
    };

    const handleSave = async () => {
        if (!selectedSupplierId) {
            toast({
                title: "Error",
                description: "Please select a supplier",
                variant: "destructive",
            });
            return;
        }

        if (selectedProducts.length === 0) {
            toast({
                title: "Error",
                description: "Please select at least one product",
                variant: "destructive",
            });
            return;
        }

        const formData = new FormData();
        formData.append('supplier_id', selectedSupplierId);
        formData.append('order_date', new Date().toISOString());
        formData.append('status', orderStatus);
        formData.append('total_amount', calculateSubtotal().toString());
        formData.append('total_items', calculateTotalItems().toString());

        // Append products data and their images
        selectedProducts.forEach((product, index) => {
            formData.append(`products[${index}][product_id]`, product.id);
            formData.append(`products[${index}][quantity]`, product.quantity.toString());
            formData.append(`products[${index}][price]`, product.price.toString());
            if (product.image) {
                formData.append(`products[${index}][image]`, product.image);
            }
        });

        try {
            await axios.post(`${config.apiURL}/purchase-orders${config.slash}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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

    const calculateSubtotal = () => {
        return selectedProducts.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0
        );
    };

    const calculateTotalItems = () => {
        return selectedProducts.reduce((sum, product) => 
            sum + product.quantity, 0
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Add New Purchase Order</h2>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={() => navigate('/purchase-orders')}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Save Order
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
                    <div className="space-y-6">
                        <OrderHeader
                            suppliers={suppliers}
                            selectedSupplierId={selectedSupplierId}
                            orderStatus={orderStatus}
                            onSupplierChange={setSelectedSupplierId}
                            onStatusChange={setOrderStatus}
                        />

                        {selectedProducts.map((product) => (
                            <div key={product.id} className="flex items-center gap-4 p-4 border rounded">
                                <div className="flex-1">
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`image-${product.id}`}>Product Image</Label>
                                    <Input
                                        id={`image-${product.id}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleImageUpload(product.id, file);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        <ProductDragList
                            availableProducts={availableProducts}
                            selectedProducts={selectedProducts}
                            onDragEnd={handleDragEnd}
                            onRemoveProduct={(id) => {
                                const product = selectedProducts.find(p => p.id === id);
                                if (product) {
                                    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
                                    setAvailableProducts([...availableProducts, products.find(p => p.id === id)!]);
                                }
                            }}
                        />

                        <OrderSummary
                            totalItems={calculateTotalItems()}
                            subtotal={calculateSubtotal()}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddPurchaseOrder;
