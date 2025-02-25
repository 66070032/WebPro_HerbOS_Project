"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/auth";

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
        <div>
            <h1>Dashboard</h1>
            {user ? <p>Welcome, {user.username}!</p> : <p>Loading...</p>}
        </div>
    );
}
