"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../app/utils/auth";
import Link from "next/link";

import Image from "next/image";

const Productcard = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลสินค้าทั้งหมด
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3100/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  // กรองสินค้าตามหมวดหมู่
  useEffect(() => {
    if (!categoryId || categoryId === "all") {
      // แสดงสินค้าทั้งหมด
      setFilteredProducts(products);
    } else {
      // กรองสินค้าตามหมวดหมู่
      const filtered = products.filter(product => 
        product.category_id === parseInt(categoryId)
      );
      setFilteredProducts(filtered);
    }
  }, [categoryId, products]);

  if (loading) {
    return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 justify-items-center pb-11">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <Link
            href={`/product_page/${product.id}`}
            key={product.id}
            className="block"
          >
            <div
              className="max-w-xs h-96 bg-white shadow-lg rounded-2xl overflow-hidden text-center"
            >
              <img
                src={product.images}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <div className="flex flex-col justify-between items-center pb-8">
                  <span className="text-xl font-bold text-blue-500">
                    {product.price} บาท
                  </span>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-base font-semibold hover:bg-blue-600 mt-6">
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-lg">ไม่พบสินค้าในหมวดหมู่นี้</p>
        </div>
      )}
    </div>
  );
};

export default Productcard;