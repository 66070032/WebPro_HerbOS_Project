"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../app/utils/auth";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import Navbar from "./Navbar";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = async () => {
    await fetch("http://localhost:3100/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:3100/profile");
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  return (
      <div className="w-64 h-screen bg-gray-900 text-white p-5">
        {/* Profile Section */}
        <div className="mt-6 flex items-center flex-col text-center mb-6">
          <CircleUser size={32} />
          <div>
            <h1>Dashboard</h1>
            {!user ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p>Username: {user.username}</p>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav>
          <ul className="flex flex-col justify-center items-center">
            <li className="hover:bg-gray-700 p-2 rounded">
              <Link href="/profile/editprofile">บัญชีของฉัน</Link>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded">
              <Link href="/profile/editpassword">Security</Link>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded text-red-400">
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>
  );
}
