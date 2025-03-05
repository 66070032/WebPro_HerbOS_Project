import React, { useState, useEffect } from "react";
import SellerTab from "../../../components/SellerTab";
import { Package, ShoppingCart, BarChart } from "lucide-react";
import StatCard from "../../../components/StatCard"; // สมมติว่า StatCard คือคอมโพเนนต์ที่ใช้แสดงข้อมูล

const Seller = () => {
  const [products, setProducts] = useState([]); // ประกาศสถานะของสินค้า
  
  // ดึงข้อมูลสินค้าจาก API หรือแหล่งข้อมูล
  useEffect(() => {
    // ตัวอย่างการดึงข้อมูลสินค้า (แค่สมมติ)
    const fetchProducts = async () => {
      const res = await fetch("/api/products"); // URL ของ API ที่จะดึงข้อมูล
      const data = await res.json();
      setProducts(data); // เก็บข้อมูลสินค้าใน state
    };
    
    fetchProducts();
  }, []);

  // คำนวณค่าต่างๆ
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  return (
    <div>
      <SellerTab /> {/* เรียกใช้คอมโพเนนต์ SellerTab */}
      
      <div>
        <h1 className="text-2xl font-bold mb-6">ภาพรวมร้านค้า</h1>
        </div>
      </div>
  );
};

export default Seller;
