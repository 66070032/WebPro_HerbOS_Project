"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "./utils/auth";
import Link from "next/link";
import Image from "next/image";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuth("http://localhost:3100/profile");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
          <div className="flex flex-col md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-green-600">
              เฮิร์บโอเอส
            </h1>
            <p className="text-lg font-normal text-gray-700 leading-relaxed">
              แพลตฟอร์มสำหรับการซื้อ-ขายสมุนไพรและผลิตภัณฑ์สมุนไพรประยุกต์
              ที่คัดสรรสินค้าคุณภาพจากแหล่งที่เชื่อถือได้
              เพื่อมอบสิ่งที่ดีที่สุดให้กับทุกคน 
              โดยที่คุณสามารถ custom สินค้าสมุนไพรของคุณเองได้
            </p>
            <div className="pt-4">
              <Link
                href="/viewproduct"
                className="inline-block px-8 py-4 text-lg font-medium text-purple-800 bg-white border-2 border-purple-300 rounded-xl shadow-md hover:bg-purple-50 hover:border-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                สินค้าทั้งหมด
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 mt-8">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/images/test.png"
                alt="สมุนไพรคุณภาพ"
                width={500}
                height={300}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Custom Product Section */}
        <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-3xl shadow-xl p-8 mb-16 border border-green-200">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="relative overflow-hidden rounded-xl border-4 border-purple-200">
                <Image
                  src="/images/custom.png"
                  alt="ปรับแต่งสมุนไพรตามต้องการ"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-purple-900">
                ปรับแต่งสมุนไพรตามความต้องการ
              </h2>
              <p className="text-lg text-gray-700">
                คุณสามารถออกแบบผลิตภัณฑ์สมุนไพรได้ตามต้องการ 
                เลือกส่วนผสม ปริมาณ และรูปแบบที่เหมาะกับคุณ
              </p>
              <div className="pt-4">
                <Link
                  href="/customize"
                  className="inline-block px-6 py-3 text-white font-medium bg-lime-300 rounded-3xl"
                >
                  เริ่มปรับแต่งเลย
                </Link>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-purple-800">
              สวัสดี, {user.name}
            </h3>
            <p className="text-purple-700">
              ยินดีต้อนรับกลับมา! ตรวจสอบข้อเสนอพิเศษสำหรับคุณได้ที่นี่
            </p>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-4">
            <p className="text-purple-600">กำลังโหลด...</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
