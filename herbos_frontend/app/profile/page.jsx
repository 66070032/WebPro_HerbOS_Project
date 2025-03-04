"use client"
import { useState, useEffect } from "react";
import Profile from "../../components/ProfileHead";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching user data from an API or context
  useEffect(() => {
    // Replace with actual API call logic
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user"); // Example API endpoint
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null); // In case of error, set user to null
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle logout
  const logout = () => {
    // Clear any authentication tokens or session data here
    setUser(null);
    // Redirect or perform additional logout actions
  };

  return (
    <div className="relative h-screen">
      <Navbar />
      <div className="flex">
        <Profile />
        <div className="w-full text-center flex justify-center flex-col items-center p-10">
          <h1 className="text-2xl font-semibold text-center text-blue-600 mb-6">
            โปรไฟล์
          </h1>
          {loading ? (
            <p>Loading...</p>
          ) : user ? (
            <div>
              <p>Username: {user.username}</p>
              <button
                onClick={logout}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <p>กำลังสร้าง</p>
          )}
        </div>
      </div>
    </div>
  );
}
