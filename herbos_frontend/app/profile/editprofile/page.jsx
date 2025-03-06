"use client"
import { useState, useEffect } from "react";
import Profile from "../../../components/ProfileHead";

export default function EditProfile() {
    // สร้าง state สำหรับเก็บข้อมูลผู้ใช้
    const [user, setUser] = useState({ username: "", email: "", phone: "" });
    const [loading, setLoading] = useState(true); // เพื่อบอกว่าเรากำลังโหลดข้อมูลจาก API

    // ดึงข้อมูลผู้ใช้จาก API
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("http://localhost:3100/profile", { credentials: "include" });
                const data = await res.json();

                if (data && data.username && data.email) {
                    setUser(data);  // ถ้ามีข้อมูลก็อัปเดต state
                } else {
                    setUser({ username: "", email: "", phone: "" });  // กรณีข้อมูลไม่สมบูรณ์
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser({ username: "", email: "", phone: "" }); // กรณีเกิดข้อผิดพลาด
            }
            setLoading(false); // เมื่อข้อมูลโหลดเสร็จแล้ว
        }

        fetchUser();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });  // อัปเดตค่าเมื่อมีการเปลี่ยนแปลง
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:3100/profile/update", {
            method: "PUT", // Change to PUT method
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(user),
        });
        alert("Profile Updated!");
    };

    if (loading) {
        return <div>Loading...</div>; // รอข้อมูลจาก API
    }

    return (
      <div className="flex min-h-screen">
        {/* Sidebar (ProfileNavbar) */}
        <div className="min-h-screen">
          <Profile />
        </div>
  
        {/* Main Content */}
        <div className="w-3/4 flex justify-center items-center p-10">
          <div className="max-w-md w-full p-6 border rounded-lg shadow-lg bg-white">
            <h1 className="text-2xl font-semibold text-center text-blue-600 mb-6">
              Edit Profile
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}
