"use client";
import { useState, useEffect } from "react";
import { Plus, ChevronDown, CheckSquare, Square, Edit, Trash2, } from "lucide-react";
import SellerTab from "../../../components/SellerTab";
import Addproduct from "../../../components/Addproduct";
import Image from "next/image";

export default function Products() {
  const [products, setProducts] = useState([]);
  const userData = localStorage.getItem("accessToken");
  
  useEffect(() => {
    if (userData.role !== 'admin') {
      window.location.href = '/';
    }
      fetch('http://localhost:3100/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error:', err));
  }, []);
  
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(selectedProducts.length === products.length ? [] : products.map((p) => p.id));
  };

  return (
    <div>
      <SellerTab />
      <div className="min-h-screen bg-gray-50 ml-64 p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">สินค้าทั้งหมด ({products.length})</h1>
          
          {/* ปุ่มเปิด */}
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center"
            onClick={() => setIsAddProductOpen(true)}
          >
            <Plus className="mr-2" size={18} /> เพิ่มสินค้า
          </button>
        </div>

        {isAddProductOpen && <Addproduct isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />}

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-center">
              <tr>
                <th>ภาพสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th>ร้านค้า</th>
                <th>ราคา</th>
                <th>สต๊อก</th>
                <th>ยอดขายรวม</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 border-t text-center">
                  <td><img src={product.images} alt={product.name} className="w-10 h-10" /></td>
                  <td>{product.name}</td>
                  <td>{product.category_name}</td>
                  <td>{product.brand}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.totalSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
