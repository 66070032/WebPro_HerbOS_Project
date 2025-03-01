export const fetchWithAuth = async (url, options = {}) => {
    let accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        window.location.href = "/login"; // ❌ ถ้าไม่มี Token ให้กลับไปล็อกอิน
        return;
    }

    const headers = { ...options.headers, Authorization: `Bearer ${accessToken}` };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) { // ❌ ถ้า Token หมดอายุ
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return;
    }

    return response.json();
};
