"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "../utils/auth";

export default function Purchase() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
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
      fetch("http://localhost:3100/ingredients?custom_id=1,2,3").then((res) =>
        res.json()
      ),
    ])
      .then(([cartResult, productsData, ingredientsData]) => {
        setProducts(productsData);
        setIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);

        // จัดกลุ่มสินค้าในตะกร้าตาม product_id และ custom_data
        const groupedItems = cartResult.reduce((acc, cartItem) => {
          // สร้าง unique key สำหรับสินค้าที่มีการปรับแต่ง
          const groupKey = cartItem.custom_name
            ? `${cartItem.product_id}-${cartItem.custom_name}-${
                cartItem.custom_ingredients || ""
              }-${cartItem.concentration || ""}`
            : `${cartItem.product_id}`;

          // ค้นหาว่ามีสินค้านี้อยู่ในกลุ่มแล้วหรือไม่
          const existingItemIndex = acc.findIndex((item) => {
            if (cartItem.custom_name && item.custom_name) {
              return (
                item.product_id === cartItem.product_id &&
                item.custom_name === cartItem.custom_name &&
                item.custom_ingredients === cartItem.custom_ingredients &&
                item.concentration === cartItem.concentration
              );
            } else {
              return (
                item.product_id === cartItem.product_id &&
                !item.custom_name &&
                !cartItem.custom_name
              );
            }
          });

          if (existingItemIndex !== -1) {
            // เพิ่มจำนวนหากสินค้ามีอยู่แล้ว
            acc[existingItemIndex].quantity =
              (acc[existingItemIndex].quantity || 1) + 1;
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

          let displayName =
            cartItem.custom_name ||
            (matchedProduct
              ? matchedProduct.name
              : `สินค้า #${cartItem.product_id}`);
          let displayInfo = "";

          // แสดงข้อมูลส่วนผสมถ้ามี
          if (cartItem.custom_ingredients && Array.isArray(ingredientsData)) {
            try {
              const ingredientIds = JSON.parse(cartItem.custom_ingredients);
              if (ingredientIds.length > 0) {
                const ingredientNames = ingredientIds
                  .map((id) => {
                    const ing = ingredientsData.find((p) => p.id === id);
                    return ing ? ing.name : `ส่วนผสม #${id}`;
                  })
                  .filter(Boolean)
                  .join(", ");

                if (ingredientNames) {
                  displayInfo += `ส่วนผสม: ${ingredientNames}`;
                }
              }
            } catch (e) {
              console.error("Error parsing custom_ingredients:", e);
            }
          }

          // เพิ่มข้อมูลความเข้มข้น (ถ้ามี)
          if (cartItem.concentration) {
            displayInfo += displayInfo
              ? `, ความเข้มข้น: ${cartItem.concentration}%`
              : `ความเข้มข้น: ${cartItem.concentration}%`;
          }

          return {
            ...cartItem,
            name: displayName,
            info: displayInfo,
            price:
              Number(cartItem.custom_price) ||
              (matchedProduct ? Number(matchedProduct.price) : 0),
            image: matchedProduct ? matchedProduct.images : null,
          };
        });

        setCartItems(processedCartItems);

        // จำนวนสินค้า
        const totalQty = processedCartItems.reduce((sum, item) => {
          return sum + (item.quantity || 1);
        }, 0);

        setTotalQuantity(totalQty);

        // ราคาสินค้าทั้งหมด
        const total = processedCartItems.reduce((sum, item) => {
          const price = Number(item.price || 0);
          const quantity = Number(item.quantity || 1);
          return sum + price * quantity;
        }, 0);

        setSubTotal(total);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleCheckout = async () => {
    router.push('/purchase/payment?amount='+calculateTotal());
  }

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
              <p className="font-semibold">{item.name}</p>
              {item.info && (
                <p className="text-sm text-gray-500">{item.info}</p>
              )}
              <div className="flex items-center mt-1">
                <span className="text-gray-600 mr-2">
                  ฿{Number(item.price || 0).toFixed(2)}
                </span>
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
            <span>฿{Number(subTotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2 text-lg">
            <span>ค่าจัดส่ง</span>
            <span>฿{shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-2 font-bold text-lg">
            <span>ยอดชำระทั้งหมด</span>
            <span>฿{Number(calculateTotal()).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-4 flex justify-center items-center rounded">
          <button className="w-1/2 bg-blue-500 text-white py-2 rounded-lg text-base font-semibold hover:bg-blue-600" onClick={handleCheckout}>
            สั่งสินค้า
          </button>
        </div>
      </div>
    </div>
  );
}
