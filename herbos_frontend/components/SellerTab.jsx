import Link from "next/link";
import React from "react";
import {
  User,
  Lock,
  Home,
  Settings,
  Package,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

const SellerSidebar = () => {
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
              href="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Home className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Products */}
          <li>
            <Link
              href="/productmanage"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Package className="mr-3" />
              <span>จัดการสินค้า</span>
            </Link>
          </li>

          {/* Orders */}
          <li>
            <Link
              href="/orders"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <ShoppingCart className="mr-3" />
              <span>รายการสั่งซื้อ</span>
            </Link>
          </li>

          {/* Payment */}
          <li>
            <Link
              href="/payment"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <CreditCard className="mr-3" />
              <span>สถานะการชำระเงิน</span>
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <CreditCard className="mr-3" />
              <span>ออกจากระบบ</span>
            </Link>
          </li>
          <li>
            <Link
              href="/payment"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <CreditCard className="mr-3" />
              <span>สถานะการชำระเงิน</span>
            </Link>
          </li>

          {/* Footer or Additional Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 text-center text-sm">
            © 2024 ระบบจัดการร้านค้า
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default SellerSidebar;
