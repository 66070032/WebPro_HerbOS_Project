// pages/admin/orders.js
"use client";
import { useState } from 'react';
import SellerTab from "../../../components/SellerTab";

export default function OrdersAdmin() {
  // Format date function to replace date-fns
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Sample order data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'สมชาย ใจดี',
      date: new Date('2025-03-05'),
      total: 1250,
      status: 'pending',
      items: [
        { id: 1, name: 'สินค้า A', price: 350, quantity: 2 },
        { id: 2, name: 'สินค้า B', price: 550, quantity: 1 },
      ]
    },
    {
      id: 'ORD-002',
      customer: 'สมหญิง รักสวย',
      date: new Date('2025-03-06'),
      total: 3600,
      status: 'processing',
      items: [
        { id: 3, name: 'สินค้า C', price: 1200, quantity: 3 },
      ]
    },
    {
      id: 'ORD-003',
      customer: 'มานี มานะ',
      date: new Date('2025-03-07'),
      total: 4500,
      status: 'shipped',
      items: [
        { id: 4, name: 'สินค้า D', price: 1500, quantity: 3 },
      ]
    },
    {
      id: 'ORD-004',
      customer: 'สมศรี มีทรัพย์',
      date: new Date('2025-03-08'),
      total: 2800,
      status: 'delivered',
      items: [
        { id: 5, name: 'สินค้า E', price: 800, quantity: 2 },
        { id: 6, name: 'สินค้า F', price: 1200, quantity: 1 },
      ]
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Handle status change
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SellerTab />

      <div className="flex-1 p-6">
        {/* Filters */}
        <div className="bg-white shadow-sm mb-6 rounded p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <select
                className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="processing">กำลังดำเนินการ</option>
                <option value="delivered">ส่งมอบแล้ว</option>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสคำสั่งซื้อ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ยอดรวม
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ฿{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {{
                          processing: 'กำลังดำเนินการ',
                          delivered: 'ส่งมอบแล้ว',
                        }[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">แก้ไข</button>
                      <button className="text-red-600 hover:text-red-900">ลบ</button>
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
        <div className="w-80 bg-white border-l border-gray-200 min-h-screen p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">รายละเอียดคำสั่งซื้อ</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedOrder(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">รหัสคำสั่งซื้อ</div>
            <div className="font-medium">{selectedOrder.id}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">ลูกค้า</div>
            <div className="font-medium">{selectedOrder.customer}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">วันที่สั่งซื้อ</div>
            <div className="font-medium">{formatDate(selectedOrder.date)}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">สถานะ</div>
            <select 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedOrder.status}
              onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
            >
              <option value="pending">รอการชำระเงิน</option>
              <option value="processing">กำลังดำเนินการ</option>
              <option value="shipped">จัดส่งแล้ว</option>
              <option value="delivered">ส่งมอบแล้ว</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">รายการสินค้า</div>
            {selectedOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">จำนวน: {item.quantity}</div>
                </div>
                <div className="text-right">
                  <div>฿{item.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">รวม: ฿{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-500">ยอดรวม</div>
              <div className="font-medium">฿{selectedOrder.total.toLocaleString()}</div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}