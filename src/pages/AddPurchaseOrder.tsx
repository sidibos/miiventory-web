
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import config from '@/config';
import { useQuery } from '@tanstack/react-query';
import { Product, SelectedProduct } from '@/types/product';
import { Supplier } from '@/types/supplier';
import { PurchaseOrderDatePicker } from '@/components/purchase-orders/PurchaseOrderDatePicker';
import { ProductSelectionForm } from '@/components/purchase-orders/ProductSelectionForm';
import { SelectedProductsList } from '@/components/purchase-orders/SelectedProductsList';

const AddPurchaseOrder = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const navigate = useNavigate();
    const { toast } = useToast();

    const { data: suppliers = [] } = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            const response = await axios.get<Supplier[]>(`${config.apiURL}/suppliers${config.slash}`);
            return response.data;
        },
    });

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await axios.get<{ data: Product[], total: number }>(
                `${config.apiURL}/products${config.slash}`
            );
            return response.data.data;
        },
    });

    const handleAddProduct = () => {
        if (!selectedProductId || !selectedSupplierId || quantity <= 0) {
            toast({
                title: "Error",
                description: "Please select a product, supplier and valid quantity",
                variant: "destructive",
            });
            return;
        }

        const product = products.find(p => p.id === selectedProductId);
        if (product) {
            const existingProductIndex = selectedProducts.findIndex(
                p => p.id === selectedProductId && p.supplier_id === selectedSupplierId
            );

            if (existingProductIndex >= 0) {
                const updatedProducts = [...selectedProducts];
                updatedProducts[existingProductIndex].quantity += quantity;
                setSelectedProducts(updatedProducts);
            } else {
                setSelectedProducts([
                    ...selectedProducts,
                    {
                        ...product,
                        quantity,
                        supplier_id: selectedSupplierId
                    }
                ]);
            }
            
            setSelectedProductId('');
            setSelectedSupplierId('');
            setQuantity(1);
        }
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
                        <PurchaseOrderDatePicker 
                            date={date}
                            onDateChange={setDate}
                        />
                    </div>

                    <ProductSelectionForm 
                        products={products}
                        suppliers={suppliers}
                        selectedProductId={selectedProductId}
                        selectedSupplierId={selectedSupplierId}
                        quantity={quantity}
                        onProductChange={setSelectedProductId}
                        onSupplierChange={setSelectedSupplierId}
                        onQuantityChange={setQuantity}
                        onAddProduct={handleAddProduct}
                    />

                    <SelectedProductsList 
                        selectedProducts={selectedProducts}
                        suppliers={suppliers}
                        onRemoveProduct={(index) => {
                            setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
                        }}
                        onSubmit={handleSubmit}
                    />
                </div>
            </main>
        </div>
    );
};

export default AddPurchaseOrder;
