"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../utils/auth";

export default function Dashboard() {
    const [user, setUser] = useState(null);

    const router = useRouter();

    
    const logout = async () => {
        const response = await fetch("http://localhost:3100/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        localStorage.removeItem("accessToken");
        router.push("/login");
        console.log(response);
    };
    useEffect(() => {
        const getUserData = async () => {
            const data = await fetchWithAuth("http://localhost:3100/profile");
            setUser(data);
        };

        getUserData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {user && (
                <p>Loading...</p>
            ) && (
                <div>
                    <p>Username: {user.username}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
    );
}
