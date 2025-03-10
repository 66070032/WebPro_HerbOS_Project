"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/auth";
import Navbar from "../../components/Navbar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:3100/orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        // เรียงลำดับตาม order_id จากน้อยไปมาก
        const sortedOrders = data.sort((a, b) => a.order_id - b.order_id);
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-lg text-gray-700">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content - ติดกับ Navbar */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">
          รายการสั่งซื้อของฉัน
        </h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-xl text-gray-600">ไม่พบรายการสั่งซื้อ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <div
                key={order.order_id || `order-${index}`}
                className="bg-white p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
              >
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  รหัสคำสั่งซื้อ: {order.order_id}
                </h2>
                <div className="text-gray-700 mb-2">
                  <strong>สถานะ:</strong> {order.order_status}
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>ยอดรวม:</strong> ฿
                  {Number(order.total_amount).toLocaleString()}
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>สถานะการชำระเงิน:</strong> {order.payment_status}
                </div>
                <div className="text-gray-700">
                  <strong>วันที่สั่งซื้อ:</strong>{" "}
                  {new Date(order.order_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
