"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const response = await fetch("http://localhost:3100/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
        credentials: "include",
      });

      const result = await response.json();

      if (response.status != 200) {
        return alert(result.message);
      }

      localStorage.setItem("accessToken", result.accessToken);
      router.push("/");
    } catch (error) {
      console.error("❌ Login Failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 px-6 bg-gray-100">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/images/herb.png"
          alt="Test Image"
          width={500}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/3  p-8 ">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
          เข้าสู่ระบบ
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">
              ชื่อผู้ใช้งาน
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อผู้ใช้งาน"
              name="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
               placeholder="กรอกรหัสผ่าน"
              name="password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#C5FF89] p-3 rounded-lg hover:bg-lime-300 transition"
          >
            Submit
          </button>
          <div className="text-center md:text-left mt-4 text-sm">
            <span>หากยังไม่มีบัญชี? </span>
            <Link href="/register" className="text-violet-700 hover:text-purple-900 hover:underline">
              สมัครสมาชิก
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
