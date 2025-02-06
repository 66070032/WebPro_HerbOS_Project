"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response = await fetch("https://web.jokeped.xyz:3100/");
        const result = await response.json();
        setUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <div>
        {users.length > 0 ? (
          users.map((item, index) => (
            <div key={index}> {/* Ensure a unique key */}
              <p>{item.username}</p>
              <p>{item.email}</p>
              <p>{item.password}</p>
              <p>{item.role}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}
