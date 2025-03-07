"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { fetchWithAuth } from "../app/utils/auth";

export default function AddProductPopup({ onClose, onAddProduct }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    totalSales: 0,
    image:
      "https://greatoutdoorprovision.com/wp-content/uploads/2020/03/500x500.png", // เก็บไฟล์ภาพ
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
    try {
      const response = await fetchWithAuth("http://localhost:3100/addproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData, // ใช้ FormData แทน JSON
        credentials: "include",
      });

      console.log(jsonData);
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="images"
            placeholder="ลิ้งค์รูปภาพ"
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
            defaultValue={
              "https://greatoutdoorprovision.com/wp-content/uploads/2020/03/500x500.png"
            }
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
            name="description"
            placeholder="รายละเอียด"
            value={newProduct.description}
            onChange={handleInputChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="category_id"
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
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}