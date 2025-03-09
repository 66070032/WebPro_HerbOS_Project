"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Productcard from "../../components/Productcard";
import Footer from "../../components/Footer";
import { Search } from "lucide-react";

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    inStock: false,
    isPromotion: false,
    isBestSeller: false,
  });

  // ดึงข้อมูลหมวดหมู่
  useEffect(() => {
    fetch("http://localhost:3100/category")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  // ดึงข้อมูลสินค้า
  useEffect(() => {
    fetch("http://localhost:3100/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // ฟังก์ชั่นสำหรับเลือกรูปภาพของหมวดหมู่
  const getCategoryImage = (id) => {
    if (id === 1) return "/images/herbcate.png";
    if (id === 2) return "/images/shampoocate.png";
    if (id === 3) return "/images/soapcate.png";
    if (id === 4) return "/images/lotion-category.png";
    return "/images/default-category.png";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#DFC8E7] to-[#E8D8F0]">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-3">
            สินค้าของเรา
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ค้นพบผลิตภัณฑ์คุณภาพเพื่อสุขภาพและความงามที่ผลิตจากธรรมชาติ
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-4 pl-12 rounded-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search size={20} />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-purple-800 mb-6 text-center">
            หมวดหมู่สินค้า
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {/* All Products Category */}
            <div
              className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-white shadow-lg scale-105 border-2 border-purple-400"
                  : "hover:bg-white hover:bg-opacity-60 hover:shadow"
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-300 rounded-full shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <span className="mt-3 font-medium text-purple-900">ทั้งหมด</span>
            </div>

            {/* Categories from API */}
            {!loading &&
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedCategory === category.id.toString()
                      ? "bg-white shadow-lg scale-105 border-2 border-purple-400"
                      : "hover:bg-white hover:bg-opacity-60 hover:shadow"
                  }`}
                  onClick={() => setSelectedCategory(category.id.toString())}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                    <img
                      src={getCategoryImage(category.id)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-3 font-medium text-purple-900">
                    {category.name}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Product Display */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          {/* Pass all filter params to ProductCard component */}
          <Productcard
            categoryId={selectedCategory}
            priceRange={priceRange}
            sortBy={sortBy}
            searchTerm={searchTerm}
            filters={filters}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
