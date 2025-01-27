import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InventoryCardProps {
  item: {
    name: string;
    quantity: number;
    category: string;
    sku: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const InventoryCard = ({ item, onEdit, onDelete }: InventoryCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{item.name}</span>
          <Badge variant={item.quantity > 10 ? "default" : "destructive"}>
            {item.quantity} in stock
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-500">
          <p>SKU: {item.sku}</p>
          <p>Category: {item.category}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};