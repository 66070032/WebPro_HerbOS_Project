"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AddProductPopup({ onClose, onAddProduct }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    totalSales: 0,
    image: null, // เก็บไฟล์ภาพ
  });

  // ฟังก์ชันอัพเดตค่าฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันอัพเดตไฟล์ภาพ
  const handleFileChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // ฟังก์ชันส่งข้อมูลไปยัง API
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("brand", newProduct.brand);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    formData.append("image", newProduct.image); // ส่งไฟล์ภาพ

    try {
      const response = await fetch("http://localhost:3100/addproduct", {
        method: "POST",
        body: formData, // ใช้ FormData แทน JSON
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to add product");

      alert("✅ เพิ่มสินค้าลงระบบเรียบร้อย!");
      onAddProduct(newProduct); // อัปเดต state ข้อมูลสินค้า (ถ้าจำเป็น)
      onClose(); // ปิด popup
    } catch (error) {
      console.error("Error:", error);
      alert("❌ มีบางอย่างผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">เพิ่มสินค้า</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="name"
          placeholder="ชื่อสินค้า"
          value={newProduct.name}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="หมวดหมู่"
          value={newProduct.category}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          name="brand"
          placeholder="แบรนด์"
          value={newProduct.brand}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="ราคา"
          value={newProduct.price}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="สต็อกสินค้า"
          value={newProduct.stock}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}
