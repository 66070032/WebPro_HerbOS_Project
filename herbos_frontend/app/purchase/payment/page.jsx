'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { fetchWithAuth } from '../../utils/auth';

export default function PaymentPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get('amount') || '10';

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleVerifyPayment = async () => {
    if (!file) {
      alert('กรุณาเลือกไฟล์ก่อน!');
      return;
    }
    setIsVerifying(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://developer.easyslip.com/api/v1/verify', formData, {
        headers: {
          Authorization: 'Bearer 6424ba55-b9ca-48e8-9bb2-1a60bca9e47f',
        },
      });
      
      const dataPayment = response.data.data;
      const payAmount = dataPayment.amount.amount;
      if (dataPayment.receiver.bank.short === 'SCB' && dataPayment.receiver.account.name.th === 'นาย เจตนิพัทธ์ ท') {
        if (parseFloat(payAmount) === parseFloat(amount)) {
            alert('✅ ชำระเงินเรียบร้อย!');
            // router.push('/success'); // นำทางไปยังหน้าสำเร็จ
          } else {
            alert('❌ ยอดเงินไม่ตรง กรุณาตรวจสอบอีกครั้ง!');
          }
      } else {
        alert('❌ ชื่อบัญชีไม่ตรง กรุณาตรวจสอบอีกครั้ง!');
      }
    } catch (error) {
      console.error('Error verifying slip:', error);
      alert('❌ ตรวจสอบสลิปไม่สำเร็จ!');
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">💳 ชำระเงิน</h2>
        <p className="text-gray-700">ยอดเงินที่ต้องชำระ: <strong>{amount} บาท</strong></p>
        <p className="text-gray-700">Bank: <strong>SCB</strong></p>
        <p className="text-gray-700">เลขบัญชี: <strong>1642885919</strong></p>
        <p className="text-gray-700">ชื่อบัญชี: <strong>นาย เจตนิพัทธ์ ทานะมัย</strong></p>
        
        {/* อัปโหลดไฟล์สลิป */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">อัปโหลดสลิปการชำระเงิน</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            className="mt-2 w-full px-4 py-2 border rounded-lg text-sm text-gray-700 focus:ring focus:ring-blue-200"
          />
        </div>
        
        {/* แสดงภาพตัวอย่างไฟล์ที่เลือก */}
        {preview && (
          <img src={preview} alt="สลิปที่อัปโหลด" className="mt-2 w-full h-auto rounded-lg shadow-md" />
        )}
        
        {/* ปุ่มยืนยันการชำระเงิน */}
        <button 
          onClick={handleVerifyPayment} 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition"
          disabled={isVerifying}
        >
          {isVerifying ? '⏳ กำลังตรวจสอบ...' : '✅ ยืนยันการชำระเงิน'}
        </button>
      </div>
    </div>
  );
}
