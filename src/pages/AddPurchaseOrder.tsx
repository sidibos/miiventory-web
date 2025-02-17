import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductDragList } from "@/components/purchase-orders/ProductDragList";
import { OrderHeader } from "@/components/purchase-orders/OrderHeader";
import { OrderSummary } from "@/components/purchase-orders/OrderSummary";
import config from '@/config';
import { Supplier } from '@/types/supplier';

interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    stock: number;
    thumbnail?: string;
}

interface SelectedProduct extends Product {
    quantity: number;
}

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

    const handleCancel = () => {
        navigate('/purchase-orders');
    };

    const removeSelectedProduct = (productId: string) => {
        const product = selectedProducts.find(p => p.id === productId);
        if (product) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
            setAvailableProducts([...availableProducts, products.find(p => p.id === productId)!]);
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

        const orderData = {
            supplier_id: selectedSupplierId,
            order_date: new Date().toISOString(),
            order_status: orderStatus,
            products: selectedProducts.map(product => ({
                product_id: product.id,
                quantity: product.quantity,
                price: product.price
            })),
            total_amount: calculateSubtotal(),
            total_items: calculateTotalItems(),
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
                    <div className="space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
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

                        <ProductDragList
                            availableProducts={availableProducts}
                            selectedProducts={selectedProducts}
                            onDragEnd={handleDragEnd}
                            onRemoveProduct={removeSelectedProduct}
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