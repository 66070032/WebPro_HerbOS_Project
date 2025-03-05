"use client";
import React, { useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";

// Mock data สำหรับสินค้า
const initialProducts = [
  { id: 1, name: "เสื้อยืดสีขาว", price: 250, stock: 50 },
  { id: 2, name: "กางเกงยีนส์", price: 750, stock: 30 },
  { id: 3, name: "รองเท้าผ้าใบ", price: 1200, stock: 20 },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [currentProduct, setCurrentProduct] = useState(null);

  // ฟังก์ชันจัดการแท็บ
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent products={products} />;
      case "products":
        return (
          <ProductManagement
            products={products}
            setProducts={setProducts}
            setCurrentProduct={setCurrentProduct}
            currentProduct={currentProduct}
          />
        );
      default:
        return <DashboardContent products={products} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-5 text-center font-bold text-xl border-b">
          ระบบจัดการร้านค้า
        </div>
        <nav className="p-4">
          <SidebarButton
            icon={<Home />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarButton
            icon={<Package />}
            label="จัดการสินค้า"
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

// คอมโพเนนต์ปุ่มเมนู
const SidebarButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 mb-2 rounded-lg ${
      active ? "bg-blue-500 text-white" : "hover:bg-blue-100 text-gray-700"
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

// หน้า Dashboard หลัก
const DashboardContent = ({ products }) => {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ภาพรวมร้านค้า</h1>
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          icon={<Package />}
          title="จำนวนสินค้า"
          value={totalProducts}
        />
        <StatCard icon={<ShoppingCart />} title="สต็อกรวม" value={totalStock} />
        <StatCard
          icon={<BarChart />}
          title="มูลค่าสินค้า"
          value={`฿${totalValue.toLocaleString()}`}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-blue-100 p-3 rounded-full mr-4">{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

// หน้าจัดการสินค้า
const ProductManagement = ({
  products,
  setProducts,
  currentProduct,
  setCurrentProduct,
}) => {
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  // เพิ่มสินค้า
  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
    };
    setProducts([...products, newProduct]);
    setProductForm({ name: "", price: "", stock: "" });
  };

  // แก้ไขสินค้า
  const editProduct = () => {
    const updatedProducts = products.map((p) =>
      p.id === currentProduct.id ? { ...currentProduct, ...productForm } : p
    );
    setProducts(updatedProducts);
    setCurrentProduct(null);
    setProductForm({ name: "", price: "", stock: "" });
  };

  // ลบสินค้า
  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">จัดการสินค้า</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={productForm.name}
          onChange={(e) =>
            setProductForm({ ...productForm, name: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
        />
        <select id="category" className="w-full p-2 border rounded mb-3">
          <option disabled>เลือกหมวดหมู่สินค้า</option>
          <option value="สมุนไพร">สมุนไพร</option>
          <option value="ผลิตภัณฑ์บำรุงผม">ผลิตภัณฑ์บำรุงผม</option>
          <option value="ยาดม">ยาดม</option>
        </select>

        <input
          type="number"
          placeholder="ราคา"
          value={productForm.price}
          onChange={(e) =>
            setProductForm({ ...productForm, price: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="number"
          placeholder="จำนวนสต็อก"
          value={productForm.stock}
          onChange={(e) =>
            setProductForm({ ...productForm, stock: e.target.value })
          }
          className="w-full p-2 border rounded mb-3"
        />
        {currentProduct ? (
          <button
            onClick={editProduct}
            className="bg-yellow-500 text-white p-2 rounded w-full flex items-center justify-center"
          >
            <Edit className="mr-2" /> แก้ไขสินค้า
          </button>
        ) : (
          <button
            onClick={addProduct}
            className="bg-green-500 text-white p-2 rounded w-full flex items-center justify-center"
          >
            <PlusCircle className="mr-2" /> เพิ่มสินค้า
          </button>
        )}
      </div>

      {/* ตารางสินค้า */}
      <div className="bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ชื่อสินค้า</th>
              <th className="p-3 text-left">ประเภท</th>
              <th className="p-3 text-left">ราคา</th>
              <th className="p-3 text-left">สต็อก</th>
              <th className="p-3 text-left">ยอดขาย</th>
              <th className="p-3 text-left">ร้านค้า</th>
              <th className="p-3 text-center">สถานะ</th>
              <th className="p-3 text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{product.name}</td>
                <td className="p-3">฿{product.price.toLocaleString()}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setProductForm({
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                      });
                    }}
                    className="text-yellow-500 hover:bg-yellow-100 p-2 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerDashboard;
