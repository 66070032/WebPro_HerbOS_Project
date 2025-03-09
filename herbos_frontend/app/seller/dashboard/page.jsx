"use client"
import React, { useState, useEffect } from "react";
import SellerTab from "../../../components/SellerTab";
import StatCard from "../../../components/StatCard";
import { Package, ShoppingCart, BarChart} from "lucide-react";
import { fetchWithAuth } from "../../utils/auth";

const Seller = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchWithAuth('http://localhost:3100/isAdmin').then((res) => {
      if(!res) {
        window.location.href = '/';
      }
    }).catch((err) => console.error('Error:', err));
    fetch('http://localhost:3100/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error:', err));
  }, []);


  // คำนวณค่าต่างๆ
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  return (
    <div className="min-h-screen w-full">
      <SellerTab /> {/* เรียกใช้คอมโพเนนต์ SellerTab */}
      <div className="ml-64 p-12">
        <h1 className="text-2xl font-bold mb-6">ภาพรวมร้านค้า</h1>
        <div className="grid grid-cols-3 gap-6">
          <StatCard icon={<Package />} title="จำนวนสินค้า" value={totalProducts} />
          <StatCard icon={<ShoppingCart />} title="จำนวนสต็อก" value={totalStock} />
          <StatCard icon={<BarChart />} title="ยอดรวมมูลค่า" value={totalValue} />
      </div>
      </div>

    </div>
  );
};

export default Seller;
