
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface PurchaseOrderDatePickerProps {
    date: Date;
    onDateChange: (date: Date) => void;
}

export const PurchaseOrderDatePicker = ({ date, onDateChange }: PurchaseOrderDatePickerProps) => {
    return (
        <div className="space-y-2">
            <Label>Order Date</Label>
            <Popover>
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
                        onSelect={(newDate) => newDate && onDateChange(newDate)}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
