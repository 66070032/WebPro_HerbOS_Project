"use client";
import { useState, useEffect } from "react";
import { Plus, ChevronDown, Filter } from "lucide-react";
import SellerTab from "../../../components/SellerTab";
import Addproduct from "../../../components/Addproduct";
import { fetchWithAuth } from "../../utils/auth";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const userData = localStorage.getItem("accessToken");
  
  useEffect(() => {
    fetchWithAuth('http://localhost:3100/isAdmin').then((res) => {
      if(!res) {
        window.location.href = '/';
      }
    }).catch((err) => console.error('Error:', err));
    
    // Fetch categories
    fetch('http://localhost:3100/category')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
    
    // Fetch all products initially
    fetchProducts();
  }, []);
  
  // Function to fetch products, with optional category filter
  const fetchProducts = (categoryId = null) => {
    const url = categoryId 
      ? `http://localhost:3100/products/category/${categoryId}` 
      : 'http://localhost:3100/products';
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
    setIsCategoryDropdownOpen(false);
  };
  
  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    fetchProducts();
  };

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

  // Find the current category name if one is selected
  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name 
    : "ทั้งหมด";

  return (
    <div>
      <SellerTab />
      <div className="min-h-screen bg-gray-50 ml-64 p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">สินค้าทั้งหมด ({products.length})</h1>
          
          <div className="flex items-center gap-4">
            {/* Category dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                <Filter size={16} />
                <span>หมวดหมู่: {selectedCategoryName}</span>
                <ChevronDown size={16} />
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-56 bg-white border rounded-lg shadow-lg">
                  <ul className="py-1">
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={clearCategoryFilter}
                    >
                      ทั้งหมด
                    </li>
                    {categories.map(category => (
                      <li 
                        key={category.id} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Add product button */}
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center"
              onClick={() => setIsAddProductOpen(true)}
            >
              <Plus className="mr-2" size={18} /> เพิ่มสินค้า
            </button>
          </div>
        </div>

        {isAddProductOpen && <Addproduct isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />}

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-center">
              <tr>
                <th>ภาพสินค้า</th>
                <th>ชื่อสินค้า</th>
                <th>ร้านค้า</th>
                <th>ราคา</th>
                <th>สต๊อก</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 border-t text-center">
                    <td><img src={product.images} alt={product.name} className="w-10 h-10" /></td>
                    <td>{product.name}</td>
                    <td>{product.shop}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">ไม่พบสินค้าในหมวดหมู่นี้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}