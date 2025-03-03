"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../app/utils/auth";
import Link from "next/link";
import AddToCart from "../components/AddToCart";

const Productcard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3100/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  // const handleAddToCart = async (product) => {
  //   // Add the product to the cart
  //   const user = await fetchWithAuth("http://localhost:3100/profile");
  //   const result = await fetchWithAuth("http://localhost:3100/addcart", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //     body: JSON.stringify({ username: user.username, product_id: product.id })
  //   })
  //   alert('เพิ่มสินค้าลงตะกร้าเรียบร้อย')
  // };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-36 justify-items-cente">
      {products.map((product) => (
          <Link 
          href={`/product_page/${product.id}`} 
          key={product.id}
          className="block"
          onClick={(e) => {
            if (e.target.closest(".AddToCart")) {
              e.preventDefault(); // หยุดการนำทางเมื่อกด Add to Cart
            }
          }}
        >
        <div key={product.id} className="max-w-xs h-96 bg-white shadow-lg rounded-2xl overflow-hidden">
          <img src={product.images} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-500 text-sm">{product.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xl font-bold text-blue-500">{product.price} บาท</span>
              {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition" type="button" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button> */}
              <AddToCart productId={product.id} quantity={1}/>
            </div>

          </div>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default Productcard;
