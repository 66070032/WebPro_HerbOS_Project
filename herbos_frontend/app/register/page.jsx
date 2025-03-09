"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/auth";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            router.push("/")
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);
        const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

        try {
            const response = await fetch("http://localhost:3100/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonData,
                credentials: "include"
            });

            const result = await response.json();

            if (response.status !== 200) {
                setError(result.message);
                setIsLoading(false);
                return;
            }

            router.push('/login');

        } catch (error) {
            console.error("Registration Failed:", error);
            setError("การลงทะเบียนล้มเหลว โปรดลองอีกครั้ง");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 px-6 bg-gray-100">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex justify-center">
                <Image
                    src="/images/herb.png"
                    alt="Herb Image"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg"
                />
            </div>

            {/* Form Section */}
            <div className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
                    สร้างบัญชีผู้ใช้ใหม่
                </h1>


                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-900">
                                ชื่อจริง
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="กรอกชื่อจริง"
                                name="firstname"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-900">
                                นามสกุล
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="กรอกนามสกุล"
                                name="lastname"
                                required
                            />
                        </div>
                    </div>
                    
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกอีเมล"
                            name="email"
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
                        disabled={isLoading}
                        className="w-full bg-[#C5FF89] p-3 rounded-lg hover:bg-lime-300 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังดำเนินการ...
                            </span>
                        ) : "ลงทะเบียน"}
                    </button>
                    
                    <div className="text-center md:text-left mt-4 text-sm">
                        <span>มีบัญชีอยู่แล้ว? </span>
                        <Link href="/login" className="text-violet-700 hover:text-purple-900 hover:underline">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}