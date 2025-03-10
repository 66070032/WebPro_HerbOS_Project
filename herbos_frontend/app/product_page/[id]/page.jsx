"use client";
import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddToCart from "../../../components/AddToCart";
import { Plus, Minus } from "lucide-react";

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

  // เพิ่มจำนวนสินค้า
  const increaseQuantity = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  // ลดจำนวนสินค้า
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // จัดการการเปลี่ยนแปลงของช่อง input
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > (product.stock || 10)) {
      setQuantity(product.stock || 10);
    } else {
      setQuantity(value);
    }
  };

  // จัดการเมื่อกด Enter หรือ input ออกจาก focus
  const handleInputBlur = () => {
    if (!quantity || quantity < 1) {
      setQuantity(1);
    } else if (quantity > (product.stock || 10)) {
      setQuantity(product.stock || 10);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      
      {/* Container หลัก - ทำให้เนื้อหาอยู่ตรงกลางหน้าจอ */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* เนื้อหาสินค้า */}
          <div className="flex flex-col md:flex-row">
            {/* รูปภาพสินค้า */}
            <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
              <div className="w-full h-80 flex items-center justify-center">
                <img
                  src={product.images}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            
            {/* ข้อมูลสินค้า */}
            <div className="w-full md:w-1/2 p-8 flex flex-col gap-4">
              <h2 className="text-4xl font-bold">{product.name}</h2>
              {isCustom && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block w-max">
                  สินค้า Custom
                </span>
              )}
              <p className="text-gray-600 text-xl">{product.description}</p>
              <span className="text-3xl font-bold text-black-600">
                {product.price} บาท
              </span>
              
              {/* ส่วนเลือกจำนวน */}
              <div className="flex items-center mt-4">
                <label className="text-xl font-semibold mr-4">จำนวน : </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decreaseQuantity}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  {/* ช่อง input จำนวน */}
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 10}
                    value={quantity}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 text-lg"
                  />
                  
                  <button
                    onClick={increaseQuantity}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                    disabled={quantity >= (product.stock || 10)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="ml-4 text-sm text-gray-500">
                  มีสินค้าทั้งหมด {product.stock || 10} ชิ้น
                </span>
              </div>
              
              {/* ปุ่มเพิ่มลงตะกร้า */}
              <div className="mt-6">
                <AddToCart productId={product.id} quantity={quantity} isCustom={isCustom} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default product_page;