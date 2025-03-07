"use client";
import { fetchWithAuth } from "../app/utils/auth";

const AddToCart = ({ productId, quantity}) => {

  const handleAddToCart = async () => {
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

  return ( 
    <button className="AddToCart mt-6 bg-[#C5FF89] px-4 py-2 rounded-xl hover:bg-lime-300 transition border-2 border-black" type="button" onClick={handleAddToCart}>
        Add to Cart
    </button> )}

export default AddToCart;