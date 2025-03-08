"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "../../utils/auth";
import axios from "axios";

export default function Payment() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [paymentId, setPaymentId] = useState("");

    let amount = searchParams.get("amount");

    const handleFileChange = async (e) => {
        console.log(e.target.files[0]);
        const formData = new FormData()
        formData.append('file', e.target.files[0])

        const { data } = await axios.post('https://developer.easyslip.com/api/v1/verify', formData, {
            headers: {
                Authorization: 'Bearer 6424ba55-b9ca-48e8-9bb2-1a60bca9e47f',
            },
        })

        let payAmount = data.data.amount.amount

        console.log(payAmount)

        if (payAmount == amount) {
            alert('ชําระเงินเรียบร้อย')
        } else {
            alert('ชําระเงินไม่ถูกต้อง')
        }
    };

    return (
        <div>
            <input type="file" name="slip" id="slip" onChange={handleFileChange} />

        </div>
    );
}