import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

interface ProductDragListProps {
    availableProducts: Product[];
    selectedProducts: SelectedProduct[];
    onDragEnd: (result: any) => void;
    onRemoveProduct: (productId: string) => void;
}

export const ProductDragList = ({
    availableProducts,
    selectedProducts,
    onDragEnd,
    onRemoveProduct
}: ProductDragListProps) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid md:grid-cols-2 gap-6">
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
                                                    {product.thumbnail && (
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    )}
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
                                                    {product.thumbnail && (
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    )}
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
                                                            onClick={() => onRemoveProduct(product.id)}
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
            </div>
        </DragDropContext>
    );
};