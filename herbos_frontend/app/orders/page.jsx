"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/auth";
import Profile from "../../components/ProfileHead";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchWithAuth("http://localhost:3100/orders");
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
            setLoading(false);
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-700">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 p-6">
            {/* Profile Header */}
            <div className="w-1/4">
                <Profile />
            </div>

            {/* Main Content */}
            <div className="w-3/4 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Orders</h1>
                {orders.length === 0 ? (
                    <p className="text-xl text-gray-600">No orders found.</p>
                ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order, index) => (
                            <div key={order.id || `order-${index}`} className="p-6 border rounded-lg shadow-lg bg-white transition duration-300 hover:shadow-xl">
                                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                                    Order ID: {order.order_id}
                                </h2>
                                <div className="text-gray-700 mb-2">
                                    <strong>Status:</strong> {order.order_status}
                                </div>
                                <div className="text-gray-700 mb-2">
                                    <strong>Total Amount:</strong> {order.total_amount} บาท
                                </div>
                                <div className="text-gray-700 mb-2">
                                    <strong>Payment Status:</strong> {order.payment_status}
                                </div>
                                <div className="text-gray-700">
                                    <strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
