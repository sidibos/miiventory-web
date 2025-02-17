interface OrderSummaryProps {
    totalItems: number;
    subtotal: number;
}

export const OrderSummary = ({ totalItems, subtotal }: OrderSummaryProps) => {
    return (
        <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center text-lg">
                <div className="space-y-2">
                    <p className="text-gray-600">Total Items: <span className="font-medium">{totalItems}</span></p>
                    <p className="text-gray-600">Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span></p>
                </div>
            </div>
        </div>
    );
};