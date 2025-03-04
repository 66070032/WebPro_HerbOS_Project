"use client";
import { fetchWithAuth } from "../app/utils/auth";

const AddToCart = ({ productId, quantity}) => {

  const handleAddToCart = async () => {
    // Add the product to the cart
    const user = await fetchWithAuth("http://localhost:3100/profile");
    for (let i = 0; i < quantity; i++) {
    const result = await fetchWithAuth("http://localhost:3100/addcart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: user.username, product_id: productId, quantity})
    });
    }
    alert('เพิ่มสินค้าลงตะกร้าเรียบร้อย')
  };

  return ( <button className="AddToCart bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition" type="button" onClick={handleAddToCart}>
        Add to Cart
    </button> )}

export default AddToCart;