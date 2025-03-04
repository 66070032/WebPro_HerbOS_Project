"use client";
import { useState } from "react";
import Profile from "../../../components/ProfileHead";

export default function EditSecurity() {
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setErrorMessage("New passwords do not match");
            return;
        }

        const response = await fetch("http://localhost:3100/profile/security/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(passwords),
        });

        if (response.ok) {
            setSuccessMessage("Password updated successfully");
            setErrorMessage("");
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || "Error updating password");
            setSuccessMessage("");
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar (ProfileNavbar) */}
            <div className="w-1/4 min-h-screen bg-gray-100">
                <Profile />
            </div>

            {/* Main Content */}
            <div className="w-3/4 flex justify-center items-center p-10">
                <div className="max-w-md w-full p-6 border rounded-lg shadow-lg bg-white">
                    <h1 className="text-2xl font-semibold text-center text-blue-600 mb-6">
                        Change Password
                    </h1>
                    {successMessage && (
                        <div className="mb-4 text-green-600 text-center">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-4 text-red-600 text-center">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
