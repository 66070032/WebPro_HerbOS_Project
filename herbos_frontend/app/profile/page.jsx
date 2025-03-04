
import Profile from "../../components/ProfileHead";

export default function Dashboard() {
    /* Profile Section
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
    */
    return (
        <div className="flex min-h-screen">
            < Profile />
            <div className=" w-full text-center flex justify-center flex-col items-center p-10">
                <h1 className="text-2xl font-semibold text-center text-blue-600 mb-6">
                    โปรไฟล์
                </h1>
                <p>รอแปป</p>
            </div>
        </div>

    );
}
