"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "../utils/auth";

export default function Purchase() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const router = useRouter();
  const shippingCost = 30;

  useEffect(() => {
    Promise.all([
      fetchWithAuth("http://localhost:3100/allCart", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      fetch("http://localhost:3100/products").then((res) => res.json()),
    ])
      .then(([cartResult, productsData]) => {
        setProducts(productsData);

        // จัดกลุ่มสินค้าในตะกร้าตาม product_id
        const groupedItems = cartResult.reduce((acc, cartItem) => {
          const existingItem = acc.find(
            (item) => item.product_id === cartItem.product_id
          );

          if (existingItem) {
            // เพิ่มจำนวนหากสินค้ามีอยู่แล้ว
            existingItem.quantity = (existingItem.quantity || 1) + 1;
          } else {
            // ถ้าไม่มีให้เพิ่มอันใหม่ค่าเริ่มที่ 1
            acc.push({ ...cartItem, quantity: 1 });
          }

          return acc;
        }, []);

        // ประมวลผลสินค้าในตะกร้าที่จัดกลุ่มแล้วและจับคู่กับข้อมูลสินค้า
        const processedCartItems = groupedItems.map((cartItem) => {
          const matchedProduct = productsData.find(
            (p) => p.id === cartItem.product_id
          );

          if (matchedProduct) {
            return {
              ...cartItem,
              name: matchedProduct.name,
              price: matchedProduct.price,
              image: matchedProduct.images,
            };
          }
          return cartItem;
        });

        setCartItems(processedCartItems);

        // จำนวนสินค้า
        const totalQty = processedCartItems.reduce((sum, item) => {
          return sum + (item.quantity || 1);
        }, 0);

        setTotalQuantity(totalQty);

        // ราคาสินค้าทั้งหมด
        const total = processedCartItems.reduce((sum, item) => {
          return sum + (item.price || 0) * (item.quantity || 1);
        }, 0);

        setSubTotal(total);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const back = () => {
    router.push("/viewproduct");
  };

  const calculateTotal = () => {
    return subTotal + shippingCost;
  };

  return (
    <div className="containerw-full">
      <nav className="border-gray-200 bg-black mb-4 w-full">
        <div className=" flex flex-wrap items-center justify-between p-4 w-full">
          <div className="flex items-center w-full">
            <button onClick={back} className="text-3xl text-white mr-3">
              ⬅️
            </button>
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              ข้อมูลการสั่งซื้อ
            </span>
          </div>
        </div>
      </nav>
      <div className="container mx-auto">
      {/* รายการสินค้า */}
      {cartItems.map((item, index) => (
        <div key={index} className="p-4 border-b flex items-center">
          <img
            src={item.image || "/api/placeholder/80/80"}
            alt={item.name || "Product"}
            className="w-20 h-20 object-cover mr-4 rounded"
          />
          <div>
            <p className="font-semibold">
              {item.name || `สินค้า #${item.product_id}`}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-gray-600 mr-2">฿{item.price || 0}</span>
              <span className="text-gray-500">x {item.quantity || 1}</span>
            </div>
          </div>
        </div>
      ))}

      {/* สรุปราคา */}
      <div className="p-4 border-b">
        <div className="flex justify-between text-lg">
          <span>จำนวนสินค้า</span>
          <span>{totalQuantity} ชิ้น</span>
        </div>
        <div className="flex justify-between mt-2 text-lg">
          <span>ยอดรวม</span>
          <span>฿{subTotal}</span>
        </div>
        <div className="flex justify-between mt-2 text-lg">
          <span>ค่าจัดส่ง</span>
          <span>฿{shippingCost}</span>
        </div>
        <div className="flex justify-between mt-2 font-bold text-lg">
          <span>ยอดชำระทั้งหมด</span>
          <span>฿{calculateTotal()}</span>
        </div>
      </div>

      <div className="bg-white p-4 flex justify-center items-center rounded">
        <button className="w-1/2 bg-blue-500 text-white py-2 rounded-lg text-base font-semibold hover:bg-blue-600">
          สั่งสินค้า
        </button>
      </div>
      </div>
    </div>
  );
}
