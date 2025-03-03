"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function Cart() {
    const [quantity, setQuantity] = useState(1);
    const productPrice = 99;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        {quantity}
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>ตะกร้าสินค้า</SheetTitle>
                    <SheetDescription>รายการสินค้าที่คุณเลือก</SheetDescription>
                </SheetHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4 py-4 border-b">
                        <div className="flex-1">
                            <p className="font-semibold">ชื่อสินค้า</p>
                            <p className="text-gray-500">฿{productPrice}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-6 text-center">{quantity}</span>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8" 
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4 mt-4">
                    <div className="flex justify-between">
                        <span>ยอดรวม</span>
                        <span>฿{productPrice * quantity}</span>
                    </div>
                </div>

                <SheetFooter className="mt-6">
                    <SheetClose asChild>
                        <Button className="w-full">ชำระเงิน</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
