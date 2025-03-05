"use client"

import { useEffect, useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import {fetchWithAuth} from "../app/utils/auth"
import { useRouter } from "next/navigation"

export default function Cart() {
  const [quantity, setQuantity] = useState(0);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const productPrice = 99;
  const router = useRouter();

  useEffect(() => {
    incrementQuantity();
  }, []);

  const incrementQuantity = async() => {
    const result = await fetchWithAuth("http://localhost:3100/allCart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setQuantity(result.length);
  };

  // ฟังก์ชันเปิด/ปิดการแสดงตะกร้า
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  //ไปหน้าชำระเงิน
  const handlePayment = () => {
    router.push('/purchase', { 
      state: { 
        quantity: quantity,
        totalPrice: productPrice * quantity 
      } 
    });
  };

  return (
    <div>
      {/* ปุ่มแสดงตะกร้า */}
      <button onClick={toggleCartVisibility} className="relative">
        <ShoppingBag className="h-6 w-6" />
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
          {quantity}
        </span>
      </button>

      {/* การแสดงตะกร้าเมื่อ isCartVisible เป็น true */}
      {isCartVisible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white p-4 w-96 rounded-lg">
            <h2 className="text-xl font-semibold">ตะกร้าสินค้า</h2>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold">ชื่อสินค้า</p>
                <p className="text-gray-500">฿{productPrice}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ยอดรวม */}
            <div className="mt-4 flex justify-between">
              <span>ยอดรวม</span>
              <span>฿{productPrice * quantity}</span>
            </div>

            {/* ปุ่มชำระเงิน */}
            <div className="mt-6">
              <button onClick={handlePayment} className="w-full bg-blue-500 rounded-lg hover:bg-blue-600 text-white">ชำระเงิน</button>
            </div>

            {/* ปุ่มปิดตะกร้า */}
            <div className="mt-4 text-center">
              <button onClick={() => setIsCartVisible(false)} variant="outline">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
