"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../app/utils/auth";
import { CircleUser, Menu, X } from "lucide-react";
import Link from "next/link";

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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 md:hidden z-50 bg-gray-900 p-2 rounded text-white"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-gray-900 text-white p-5 transition-transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Profile Section */}
        <div className="mt-6 flex items-center flex-col text-center mb-6">
          <CircleUser size={32} />
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            {!user ? (
              <p>Loading...</p>
            ) : (
              <div>
                <p className="text-sm">Username: {user.username}</p>
                <button
                  onClick={logout}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <nav>
          <ul className="flex flex-col justify-center items-center gap-3">
            <li className="w-full text-center hover:bg-gray-700 p-2 rounded">
              <Link href="/profile/editprofile">บัญชีของฉัน</Link>
            </li>
            <li className="w-full text-center hover:bg-gray-700 p-2 rounded">
              <Link href="/profile/editpassword">Security</Link>
            </li>
          </ul>
        </nav>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
}
