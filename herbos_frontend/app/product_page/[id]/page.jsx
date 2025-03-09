"use client";
import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddToCart from "../../../components/AddToCart";

const product_page = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3100/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setProduct(data);
          setQuantity(1);
        } else {
          // ถ้าไม่พบข้อมูลในสินค้าปกติ ให้ลองเช็คว่าเป็นสินค้า custom
          fetch(`http://localhost:3100/products/custom/${id}/`)
            .then((res) => res.json())
            .then((customData) => {
              if (customData && Object.keys(customData).length > 0) {
                setProduct(customData);
                setIsCustom(true);
                setQuantity(1);
              }
            })
            .catch((err) => console.error("Error fetching custom product:", err));
        }
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="flex flex-col mt-10 md:flex-row items-center md:items-start gap-24 max-w-7xl mx-auto bg-white p-6">
        <div className="w-full h-80 flex items-center justify-center ">
          <img
            src={product.images}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h2 className="text-4xl font-bold">{product.name}</h2>
          {isCustom && (
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              สินค้า Custom
            </span>
          )}
          <p className="text-gray-600 text-xl">{product.description}</p>
          <span className="text-3xl font-bold text-black-600">
            {product.price} บาท
            <label className="text-3xl font-semibold"> จำนวน : </label>
            <select
              className="border rounded-lg p-2 text-lg"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {Array.from({ length: product.stock || 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </span>
          <AddToCart productId={product.id} quantity={quantity} isCustom={isCustom} />
        </div>
      </div>
    </div>
  );
};
export default product_page;