"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function Payment() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [paymentId, setPaymentId] = useState("");
    const [qrCode, setQrCode] = useState(""); // State สำหรับเก็บ QR Code
    const [amount, setAmount] = useState(searchParams.get("amount") || 10); // ตั้งค่าเริ่มต้น

    // ✅ ฟังก์ชันตรวจสอบสลิป
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("กรุณาเลือกไฟล์ก่อน!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("https://developer.easyslip.com/api/v1/verify", formData, {
                headers: {
                    Authorization: "Bearer 6424ba55-b9ca-48e8-9bb2-1a60bca9e47f",
                },
            });

            const payAmount = response.data.data.amount.amount; // จำนวนเงินจากสลิป
            console.log("ยอดเงินจากสลิป:", payAmount);

            if (parseFloat(payAmount) === parseFloat(amount)) {
                alert("✅ ชําระเงินเรียบร้อย!");
            } else {
                alert("❌ ยอดเงินไม่ตรง กรุณาตรวจสอบอีกครั้ง!");
            }
        } catch (error) {
            console.error("Error verifying slip:", error);
            alert("❌ ตรวจสอบสลิปไม่สำเร็จ!");
        }
    };

    return (
        <div>
            <h1>ชําระเงิน</h1>
            <br />
            <p>ยอดเงินที่ต้องชําระ: {amount} บาท</p>

            <h3>Bank: SCB</h3>
            <p>เลขบัญชี: 1642885919</p>
            <br />
            <h3>อัปโหลดสลิปการชำระเงิน</h3>
            <input type="file" name="slip" id="slip" onChange={handleFileChange} />
        </div>
    );
}
