"use client";
import { useState } from "react";

export default function LoginPage() {
  /*const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("เข้าสู่ระบบ", username, password);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      console.log("Login successful", data.user);
    }
  };*/

  return (
    <div className="container flex items-center justify-center h-screen">
      <div className="card text-center p-8 border-2 border-red-900 w-80 rounded-lg h-96 flex flex-col">
        <h1 className="text-3xl mb-4">Login</h1>
        <form className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="กรอกชื่อผู้ใช้/อีเมล"
            //value={username}
            //onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="กรอกรหัสผ่าน"
            //value={password}
            //onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </form>
        <button type="submit" className="bg-emerald-300 text-white py-2 rounded mt-36">
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}
