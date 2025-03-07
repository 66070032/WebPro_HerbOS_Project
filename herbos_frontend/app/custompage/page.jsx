// สมมติว่านี่เป็นไฟล์ ProductCustomizer.jsx
"use client"
import React, { useState, useEffect } from 'react';

const ProductCustomizer = () => {
  // State สำหรับเก็บข้อมูล
  const [herbs, setHerbs] = useState([]);
  const [packaging, setPackaging] = useState([]);
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const herbsResponse = await axios.get('/api/herbs');
        const packagingResponse = await axios.get('/api/packaging');
        
        setHerbs(herbsResponse.data);
        setPackaging(packagingResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // คำนวณราคาเมื่อมีการเปลี่ยนแปลงเกิดขึ้น
  useEffect(() => {
    if (selectedHerb && selectedPackage) {
      const herbPrice = selectedHerb.price;
      const packagePrice = selectedPackage.price;
      setTotalPrice((herbPrice + packagePrice) * quantity);
    }
  }, [selectedHerb, selectedPackage, quantity]);

  // ฟังก์ชันจัดการการเลือกสมุนไพร
  const handleHerbSelect = (herb) => {
    setSelectedHerb(herb);
  };

  // ฟังก์ชันจัดการการเลือกบรรจุภัณฑ์
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  // ฟังก์ชันจัดการการสั่งซื้อ
  const handleSubmit = async () => {
    if (!selectedHerb || !selectedPackage) {
      alert('กรุณาเลือกสมุนไพรและบรรจุภัณฑ์');
      return;
    }

    try {
      const orderData = {
        herbId: selectedHerb.id,
        packageId: selectedPackage.id,
        quantity: quantity,
        totalPrice: totalPrice
      };

      await axios.post('/api/orders', orderData);
      alert('สั่งซื้อสำเร็จ!');
      
      // รีเซ็ตค่าหลังจากสั่งซื้อสำเร็จ
      setSelectedHerb(null);
      setSelectedPackage(null);
      setQuantity(1);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="product-customizer">
      <h1>สร้างสินค้าสมุนไพรตามต้องการ</h1>
      
      <div className="customizer-container">
        {/* ส่วนเลือกสมุนไพร */}
        <div className="section herbs-section">
          <h2>เลือกสมุนไพร</h2>
          <div className="items-grid">
            {herbs.map(herb => (
              <div 
                key={herb.id} 
                className={`item-card ${selectedHerb?.id === herb.id ? 'selected' : ''}`}
                onClick={() => handleHerbSelect(herb)}
              >
                <img src={herb.imageUrl} alt={herb.name} />
                <h3>{herb.name}</h3>
                <p>{herb.description}</p>
                <p className="price">{herb.price.toFixed(2)} บาท</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* ส่วนเลือกบรรจุภัณฑ์ */}
        <div className="section packaging-section">
          <h2>เลือกบรรจุภัณฑ์</h2>
          <div className="items-grid">
            {packaging.map(pkg => (
              <div 
                key={pkg.id} 
                className={`item-card ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                onClick={() => handlePackageSelect(pkg)}
              >
                <img src={pkg.imageUrl} alt={pkg.name} />
                <h3>{pkg.name}</h3>
                <p>{pkg.description}</p>
                <p className="price">{pkg.price.toFixed(2)} บาท</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* ส่วนสรุปการเลือก */}
      <div className="summary-section">
        <h2>สรุปสินค้าที่คุณเลือก</h2>
        {selectedHerb && (
          <div className="selected-item">
            <h3>สมุนไพร: {selectedHerb.name}</h3>
            <p>ราคา: {selectedHerb.price.toFixed(2)} บาท</p>
          </div>
        )}
        
        {selectedPackage && (
          <div className="selected-item">
            <h3>บรรจุภัณฑ์: {selectedPackage.name}</h3>
            <p>ราคา: {selectedPackage.price.toFixed(2)} บาท</p>
          </div>
        )}
        
        <div className="quantity-control">
          <label htmlFor="quantity">จำนวน:</label>
          <input 
            type="number" 
            id="quantity" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
          />
        </div>
        
        <div className="total-price">
          <h3>ราคารวม: {totalPrice.toFixed(2)} บาท</h3>
        </div>
        
        <button 
          className="order-button"
          onClick={handleSubmit}
          disabled={!selectedHerb || !selectedPackage}
        >
          สั่งซื้อสินค้า
        </button>
      </div>
    </div>
  );
};

export default ProductCustomizer;