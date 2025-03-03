"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "./utils/auth";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchWithAuth("http://localhost:3100/profile");
      setUser(data);
    };

    getUserData();
  }, []);

  return (
    <div className="relative max-w-screen min-h-screen bg-amber-100">
      <Navbar />
      <div className="flex flex-col mt-14 md:flex-row items-center justify-center text-center">
        <div className="flex flex-col md:w-1/2">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">เฮิร์บโอเอส</h1>
          <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-30 dark:text-gray-400 text-left break-words">
            แพลตฟอร์มสำหรับการซื้อ-ขายสมุนไพรและผลิตภัณฑ์สมุนไพรประยุกต์ ที่คัดสรรสินค้าคุณภาพจากแหล่งที่เชื่อถือได้ เพื่อมอบสิ่งที่ดีที่สุดให้กับทุกคน โดยที่คุณสามารถ custom สินค้าสมุนไพรของคุณเองได้
          </p>
          <div className="flex justify-center mt-6">
            <Link 
              className="px-8 py-4 text-xl font-semibold text-gray-800 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-500"
              href="/viewproduct"
            >
              สินค้าทั้งหมด
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:w-1/2">
          <Image src="/images/test.png" alt="Test Image" width={500} height={300} className="rounded-lg shadow-lg" />
        </div>
      </div>

    </div>
  );
}
