"use client"; // ถ้าใช้ Next.js 13+ และอยู่ใน app directory

import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Import useRouter
import React from "react";
import {
  User,
  Home,
  Package,
  ShoppingCart,
} from "lucide-react";

const SellerSidebar = () => {
  const router = useRouter(); // ✅ เรียกใช้ useRouter

  const logout = async () => {
    await fetch("http://localhost:3100/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    localStorage.removeItem("accessToken");
    router.push("/login"); // ✅ ทำงานได้ถูกต้อง
  };

  return (
    <div className="fixed h-full w-64 bg-gray-900 text-white">
      {/* Logo or Brand Area */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-center">
        <h1 className="text-2xl font-bold">ระบบจัดการ</h1>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {/* Dashboard */}
          <li>
            <Link
              href="/seller/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Home className="mr-3" />
              <span>หน้าหลัก</span>
            </Link>
          </li>

          {/* Products */}
          <li>
            <Link
              href="/seller/productmanage"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Package className="mr-3" />
              <span>จัดการสินค้า</span>
            </Link>
          </li>

          {/* Orders */}
          <li>
            <Link
              href="/seller/order"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <ShoppingCart className="mr-3" />
              <span>รายการสั่งซื้อ</span>
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={logout}
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 w-full text-left"
            >
              <User className="mr-3" />
              <span>ออกจากระบบ</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 text-center text-sm">
        © 2024 ระบบจัดการร้านค้า
      </div>
    </div>
  );
};

export default SellerSidebar;
