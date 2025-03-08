"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { fetchWithAuth } from "../app/utils/auth";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    updateCart();
  }, []);

  const updateCart = async () => {
    try {
      const [cartResult, productsData, ingredientsData] = await Promise.all([
        fetchWithAuth("http://localhost:3100/allCart", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch("http://localhost:3100/products").then((res) => res.json()),
        fetch("http://localhost:3100/ingredients?custom_id=1,2,3").then((res) =>
          res.json()
        ),
      ]);

      // เก็บข้อมูลส่วนผสมเพื่อใช้อ้างอิงภายหลัง
      setIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);

      // จัดกลุ่มสินค้าในตะกร้าตาม product_id และ custom_data
      const groupedItems = cartResult.reduce((acc, cartItem) => {
        // สร้าง unique key สำหรับสินค้าที่มีการปรับแต่ง
        // ใช้ทั้ง product_id, custom_name, custom_ingredients, concentration เป็นตัวจัดกลุ่ม
        const groupKey = cartItem.custom_name
          ? `${cartItem.product_id}-${cartItem.custom_name}-${
              cartItem.custom_ingredients || ""
            }-${cartItem.concentration || ""}`
          : `${cartItem.product_id}`;

        // ค้นหาว่ามีสินค้านี้อยู่ในกลุ่มแล้วหรือไม่
        const existingItemIndex = acc.findIndex((item) => {
          // ตรวจสอบว่าเป็นสินค้าที่มีการปรับแต่งหรือไม่
          if (cartItem.custom_name && item.custom_name) {
            // สำหรับสินค้าที่มีการปรับแต่ง ตรวจสอบทั้ง product_id, custom_name, custom_ingredients, concentration
            return (
              item.product_id === cartItem.product_id &&
              item.custom_name === cartItem.custom_name &&
              item.custom_ingredients === cartItem.custom_ingredients &&
              item.concentration === cartItem.concentration
            );
          } else {
            // สำหรับสินค้าปกติ ตรวจสอบเฉพาะ product_id
            return (
              item.product_id === cartItem.product_id &&
              !item.custom_name &&
              !cartItem.custom_name
            );
          }
        });

        if (existingItemIndex !== -1) {
          // เพิ่มจำนวนหากสินค้ามีอยู่แล้ว
          acc[existingItemIndex].quantity += 1;
          acc[existingItemIndex].cart_ids.push(cartItem.id);

          // ตรวจสอบการตั้งค่าราคา
          if (cartItem.custom_price) {
            // ตรวจสอบว่าราคาเท่ากันหรือไม่
            if (acc[existingItemIndex].custom_price !== cartItem.custom_price) {
              // อาจจะต้องมีการจัดการราคาที่แตกต่างกัน
              console.log(
                "Warning: Different prices for the same custom product"
              );
            }
          }
        } else {
          // สร้างรายการใหม่
          acc.push({
            ...cartItem,
            quantity: 1,
            cart_ids: [cartItem.id],
          });
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

        // แสดงข้อมูลเพิ่มเติมสำหรับสินค้าที่มีการปรับแต่ง
        let displayInfo = "";

        // แสดงข้อมูลส่วนผสมถ้ามี
        if (cartItem.custom_ingredients && Array.isArray(ingredientsData)) {
          try {
            // แปลง JSON string กลับเป็น array
            const ingredientIds = JSON.parse(cartItem.custom_ingredients);

            // ดึงข้อมูลส่วนผสมและแสดงชื่อ
            if (ingredientIds.length > 0) {
              const ingredientNames = ingredientIds
                .map((id) => {
                  const ing = ingredientsData.find((p) => p.id === id);
                  return ing ? ing.name : `ส่วนผสม #${id}`;
                })
                .filter(Boolean) // กรองค่า null/undefined ออก
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
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // เพิ่มจำนวนสินค้า
  const increaseQuantity = async (item) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      // สร้างข้อมูลสำหรับส่งไป API
      const cartData = {
        product_id: item.product_id,
        custom_name: item.custom_name || null,
        custom_ingredients: item.custom_ingredients || null,
        custom_price: item.custom_price || null,
        concentration: item.concentration || null,
      };

      // เพิ่มสินค้าในตะกร้า
      await fetchWithAuth("http://localhost:3100/addcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cartData),
      });

      // อัพเดทข้อมูลตะกร้า
      await updateCart();
    } catch (err) {
      console.error("Error increasing quantity:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // ลดจำนวนสินค้า
  const decreaseQuantity = async (item) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      if (item.quantity <= 1) {
        // ถ้าเหลือชิ้นเดียวให้ลบออกจากตะกร้า
        await removeItem(item);
      } else {
        // ลบสินค้าออก 1 ชิ้น (ลบรายการแรกในตะกร้า)
        const cartIdToRemove = item.cart_ids[item.cart_ids.length - 1];

        await fetchWithAuth(`http://localhost:3100/cart/${cartIdToRemove}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        // อัพเดทข้อมูลตะกร้า
        await updateCart();
      }
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // ลบสินค้าออกจากตะกร้าทั้งหมด
  const removeItem = async (item) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      // ลบสินค้าทั้งหมดที่มี product_id เดียวกัน
      const deletePromises = item.cart_ids.map((cartId) =>
        fetchWithAuth(`http://localhost:3100/cart/${cartId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
      );

      await Promise.all(deletePromises);

      // อัพเดทข้อมูลตะกร้า
      await updateCart();
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // ฟังก์ชันเปิด/ปิดการแสดงตะกร้า
  const toggleCartVisibility = () => {
    updateCart(); // อัพเดทข้อมูลตะกร้าก่อนแสดง
    setIsCartVisible(!isCartVisible);
  };

  //ไปหน้าชำระเงิน
  const handlePayment = () => {
    router.push("/purchase");
  };

  return (
    <div>
      {/* ปุ่มแสดงตะกร้า */}
      <button onClick={toggleCartVisibility} className="relative">
        <ShoppingBag className="h-6 w-6 text-white hover:text-blue-500" />
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
          {totalQuantity}
        </span>
      </button>

      {/* การแสดงตะกร้าเมื่อ isCartVisible เป็น true */}
      {isCartVisible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white p-4 w-96 rounded-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">ตะกร้าสินค้า</h2>

            {/* รายการสินค้า */}
            {cartItems.length > 0 ? (
              <div className="mt-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 border-b flex justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      {item.info && (
                        <p className="text-sm text-gray-500">{item.info}</p>
                      )}
                      <p className="text-gray-600">
                        ฿{Number(item.price || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* ปุ่มเพิ่ม/ลดจำนวน */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeItem(item)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => decreaseQuantity(item)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full h-6 w-6 flex items-center justify-center"
                        disabled={isUpdating}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full h-6 w-6 flex items-center justify-center"
                        disabled={isUpdating}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-center py-4">
                <p>ไม่มีสินค้าในตะกร้า</p>
              </div>
            )}

            {/* สรุปราคา */}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-lg">
                <span>จำนวนสินค้า</span>
                <span>{totalQuantity} ชิ้น</span>
              </div>
              <div className="flex justify-between mt-2 font-bold text-lg">
                <span>ยอดรวม</span>
                <span>฿{Number(subTotal || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* ปุ่มชำระเงิน */}
            <div className="mt-6">
              <button
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white py-2 rounded-lg text-base font-semibold hover:bg-blue-600"
                disabled={cartItems.length === 0}
              >
                ชำระเงิน
              </button>
            </div>

            {/* ปุ่มปิดตะกร้า */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsCartVisible(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
