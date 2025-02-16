import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import config from '@/config';

interface Customer {
    id: string;
    name: string;
    email: string;
    company_name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    stock: number;
}

interface SelectedProduct extends Product {
    quantity: number;
}

const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
];

const AddSalesOrder = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [orderStatus, setOrderStatus] = useState<string>('pending');
    const navigate = useNavigate();
    const { toast } = useToast();

    const fetchCustomers = async () => {
        try {
            const response = await axios.get<Customer[]>(`${config.apiURL}/customers${config.slash}`);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast({
                title: "Error",
                description: "Failed to fetch customers",
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
        fetchCustomers();
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
        navigate('/sales-orders');
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
        if (!selectedCustomerId) {
            toast({
                title: "Error",
                description: "Please select a customer",
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
            customer_id: selectedCustomerId,
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
            await axios.post(`${config.apiURL}/sales-orders${config.slash}`, orderData);
            toast({
                title: "Success",
                description: "Sales order created successfully",
            });
            navigate('/sales-orders');
        } catch (error) {
            console.error('Error creating sales order:', error);
            toast({
                title: "Error",
                description: "Failed to create sales order",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Add New Sales Order</h2>
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
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label>Customer</Label>
                                <Select
                                    value={selectedCustomerId}
                                    onValueChange={setSelectedCustomerId}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id}>
                                                {customer.name} - {customer.company_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Order Status</Label>
                                <Select
                                    value={orderStatus}
                                    onValueChange={setOrderStatus}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderStatusOptions.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Available Products</h3>
                                    <Droppable droppableId="available-products">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-2"
                                            >
                                                {availableProducts.map((product, index) => (
                                                    <Draggable
                                                        key={product.id}
                                                        draggableId={product.id}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="cursor-grab"
                                                            >
                                                                <CardContent className="p-4 flex items-center space-x-4">
                                                                    <div {...provided.dragHandleProps}>
                                                                        <GripVertical className="h-5 w-5 text-gray-500" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-medium">{product.name}</h4>
                                                                        <p className="text-sm text-gray-500">
                                                                            SKU: {product.sku} | Stock: {product.stock}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-medium">${product.price.toFixed(2)}</p>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Selected Products</h3>
                                    <Droppable droppableId="selected-products">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-2"
                                            >
                                                {selectedProducts.map((product, index) => (
                                                    <Draggable
                                                        key={product.id}
                                                        draggableId={`selected-${product.id}`}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="cursor-grab"
                                                            >
                                                                <CardContent className="p-4 flex items-center space-x-4">
                                                                    <div {...provided.dragHandleProps}>
                                                                        <GripVertical className="h-5 w-5 text-gray-500" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-medium">{product.name}</h4>
                                                                        <p className="text-sm text-gray-500">
                                                                            SKU: {product.sku} | Quantity: {product.quantity}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right flex items-center space-x-4">
                                                                        <p className="font-medium">${product.price.toFixed(2)}</p>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => removeSelectedProduct(product.id)}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </DragDropContext>
                        </div>

                        <div className="border-t pt-4 mt-6">
                            <div className="flex justify-between items-center text-lg">
                                <div className="space-y-2">
                                    <p className="text-gray-600">Total Items: <span className="font-medium">{calculateTotalItems()}</span></p>
                                    <p className="text-gray-600">Subtotal: <span className="font-medium">${calculateSubtotal().toFixed(2)}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddSalesOrder;
