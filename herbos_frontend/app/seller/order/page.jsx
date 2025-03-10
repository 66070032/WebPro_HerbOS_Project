// pages/admin/orders.js
"use client";
import { useState, useEffect } from "react";
import SellerTab from "../../../components/SellerTab";
import { fetchWithAuth } from "../../utils/auth";

export default function OrdersAdmin() {
  // const userData = localStorage.getItem("accessToken");
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ลบคำสั่งซื้อ
  const deleteOrder = async (orderId) => {
    if (window.confirm("คุณต้องการลบคำสั่งซื้อนี้ใช่หรือไม่?")) {
      try {
        const response = await fetch(
          `http://localhost:3100/orders/${orderId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setOrders(orders.filter((order) => order.order_id !== orderId));
          if (selectedOrder && selectedOrder.order_id === orderId) {
            setSelectedOrder(null);
          }
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  // ดึงข้อมูลคำสั่งซื้อจากฐานข้อมูล
  useEffect(() => {
    fetchWithAuth('http://localhost:3100/isAdmin').then((res) => {
          if(!res) {
            window.location.href = '/';
          }
        }).catch((err) => console.error('Error:', err));
    const fetchOrders = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:3100/orders");
        // const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // อัพเดทสถานะคำสั่งซื้อ
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3100/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.order_id === orderId
              ? { ...order, order_status: newStatus }
              : order
          )
        );
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder({ ...selectedOrder, order_status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // กรองคำสั่งซื้อตามการค้นหาและสถานะ
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.order_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.username).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // สีของสถานะ
  const getStatusColor = (status) => {
    switch (status) {
      case "กำลังดำเนินการ":
        return "bg-blue-100 text-blue-800";
      case "ส่งมอบแล้ว":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 flex-shrink-0">
          <SellerTab />
        </div>

        <div className="flex-1 p-6">
          <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 flex-shrink-0">
        <SellerTab />
      </div>

      <div className="flex-1 p-6">
        {/* Filters */}
        <div className="bg-white shadow-sm mb-6 rounded p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="ค้นหาตาม ID..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="รอการชำระเงิน">รอการชำระเงิน</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                <option value="ส่งมอบแล้ว">ส่งมอบแล้ว</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="overflow-hidden">
          <div className="bg-white shadow rounded">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    รหัสคำสั่งซื้อ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    วันที่
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ลูกค้า
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ยอดรวม
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    สถานะ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.order_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ฿{Number(order.total_amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => deleteOrder(order.order_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Sidebar */}
      {selectedOrder && (
        <div className="w-96 bg-white border-l border-gray-200 min-h-screen p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              รายละเอียดคำสั่งซื้อ
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedOrder(null)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">รหัสคำสั่งซื้อ</div>
            <div className="font-medium">{selectedOrder.order_id}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">ลูกค้า</div>
            <div className="font-medium">{selectedOrder.username}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">วันสั่งซื้อ</div>
            <div className="font-medium">
              {formatDate(selectedOrder.order_date)}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">สถานะ</div>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedOrder.order_status}
              onChange={(e) =>
                updateOrderStatus(selectedOrder.order_id, e.target.value)
              }
            >
              <option value="รอการชำระเงิน">รอการชำระเงิน</option>
              <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
              <option value="ส่งมอบแล้ว">ส่งมอบแล้ว</option>
              <option value="ยกเลิก">ยกเลิก</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">รายการสินค้า</div>
            {selectedOrder.items &&
              selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start mb-3"
                >
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-gray-500">
                      จำนวน: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ฿{Number(item.price).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      รวม: ฿
                      {Number(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">ยอดรวม</div>
              <div className="font-medium text-lg">
                ฿{Number(selectedOrder.total_amount).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}