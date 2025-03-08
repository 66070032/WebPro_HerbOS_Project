"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchWithAuth } from "../../app/utils/auth";
import {
  ChevronDown,
  ChevronUp,
  MinusIcon,
  PlusIcon,
  ShoppingCart,
} from "lucide-react";

const Customize = () => {
  // State for product type, ingredients, and quantities
  const [productType, setProductType] = useState(1); // 1 = shampoo, 2 = soap
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [concentration, setConcentration] = useState(50);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [baseProducts, setBaseProducts] = useState([]);

  // Fetch ingredients and base products from different APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // เรียกข้อมูลส่วนผสมจากฐานข้อมูลแรก
        const ingredientsResponse = await fetch(
          "http://localhost:3100/ingredients?custom_id=1,2,3"
        );
        if (!ingredientsResponse.ok) {
          throw new Error("Failed to fetch ingredients");
        }
        const ingredientsData = await ingredientsResponse.json();
        setIngredients(ingredientsData);

        // เรียกข้อมูลผลิตภัณฑ์พื้นฐานจากอีกฐานข้อมูลหนึ่ง
        const productsResponse = await fetch("http://localhost:3100/products"); // เปลี่ยน URL ตามที่อยู่จริงของ API
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch base products");
        }
        const productsData = await productsResponse.json();
        // กรองเฉพาะข้อมูล ID 11 และ 12
        const filteredProducts = productsData.filter(
          (product) => product.id === 11 || product.id === 12
        );
        setBaseProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter ingredients based on product type
  const filteredIngredients = ingredients.filter(
    (ing) => ing.custom_id === productType || ing.custom_id === 3
  );

  // ดึงข้อมูลผลิตภัณฑ์พื้นฐานตามประเภท
  const getBaseProduct = () => {
    // ID 11 = แชมพู, ID 12 = สบู่
    const baseProductId = productType === 1 ? 11 : 12;
    return baseProducts.find((product) => product.id === baseProductId);
  };

  // ดึงราคาพื้นฐานจากฐานข้อมูล
  const getBasePrice = () => {
    const baseProduct = getBaseProduct();
    return baseProduct ? baseProduct.price : 200; // ใช้ค่า default ถ้ายังไม่ได้โหลดข้อมูล
  };

  // ดึงรูปภาพของผลิตภัณฑ์พื้นฐาน
  const getBaseImage = () => {
    const baseProduct = getBaseProduct();
    return baseProduct
      ? baseProduct.images
      : productType === 1
      ? "https://thai-pump-bottle.com/photo/p13582418-16_7..."
      : "https://mockups-design.com/wp-content/uploads/2022...";
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = getBasePrice();
    const ingredientsCost = selectedIngredients.reduce((total, id) => {
      const ingredient = ingredients.find((ing) => ing.id === id);
      return total + (ingredient ? ingredient.price : 0);
    }, 0);

    return (basePrice + ingredientsCost) * quantity;
  };

  // Toggle ingredient selection
  const toggleIngredient = (id) => {
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item !== id));
    } else {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  // Get selected ingredients details
  const getSelectedIngredientsDetails = () => {
    return ingredients.filter((ing) => selectedIngredients.includes(ing.id));
  };

  // Toggle product type
  const toggleProductType = (type) => {
    setProductType(type);
    // Clear selected ingredients when changing product type
    setSelectedIngredients([]);
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Get background color based on ingredient
  const getIngredientColor = (name) => {
    if (["ขมิ้นชัน", "ขิง", "ไพล", "มะขาม"].includes(name)) {
      return "bg-yellow-50";
    } else if (["แตงกวา", "ว่านหางจระเข้", "มะกรูด"].includes(name)) {
      return "bg-green-50";
    } else if (["อัญชัน", "มังคุด"].includes(name)) {
      return "bg-purple-100";
    } else {
      return "bg-gray-50";
    }
  };

  const addToCart = async () => {
    // ตรวจสอบว่ามีการเลือกส่วนผสมหรือไม่
    if (selectedIngredients.length === 0) {
      // แสดงข้อความเตือน
      alert("กรุณาเลือกส่วนผสมอย่างน้อย 1 ชนิด");
      return;
    }
  
    try {
      // สร้างชื่อสินค้าที่มีรายละเอียดส่วนผสมและความเข้มข้น
      const baseProductName = productType === 1 ? "แชมพูสมุนไพร" : "สบู่สมุนไพร";
  
      // รายชื่อส่วนผสมที่เลือก
      const selectedIngNames = getSelectedIngredientsDetails()
        .map((ing) => ing.name)
        .join(", ");
  
      // เพิ่มข้อมูลความเข้มข้นในชื่อสินค้า
      const productName = `${baseProductName} (${selectedIngNames})`;
  
      // ข้อมูลที่จะส่งไปยัง API
      const cartData = {
        product_id: getBaseProduct()?.id || (productType === 1 ? 11 : 12),
        quantity: quantity,
        custom_name: productName,
        custom_ingredients: JSON.stringify(selectedIngredients),
        concentration: concentration,
        custom_price: calculateTotalPrice() / quantity, // ราคาต่อหน่วย
      };
  
      console.log("Sending cart data:", cartData);
  
      // สร้าง Array ของคำขอเพิ่มลงตะกร้าตามจำนวนที่เลือก
      const addCartPromises = Array(quantity).fill().map(() => 
        fetchWithAuth("http://localhost:3100/addcart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(cartData),
        })
      );
  
      // รอให้ทุกคำขอเสร็จสิ้น
      await Promise.all(addCartPromises);
  
      // แสดงข้อความเมื่อเพิ่มสินค้าสำเร็จ
      alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว");
  
      // รีเซ็ตค่าการเลือกส่วนผสม
      setSelectedIngredients([]);
      setConcentration(50);
      setQuantity(1);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#DFC8E7] to-[#E8D8F0]">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-2">
          {productType === 1 ? "แชมพูสมุนไพร" : "สบู่สมุนไพร"}
        </h1>
        <h2 className="text-xl text-gray-600 mb-4">
          {productType === 1 ? "Herbal Shampoo" : "Herbal Soap"}
        </h2>

        <p className="mb-8 text-gray-700">
          {productType === 1
            ? "แชมพูสมุนไพรที่คุณสามารถเลือกส่วนผสมได้เอง เหมาะสำหรับทุกประเภทผมและหนังศีรษะ"
            : "สบู่สมุนไพรที่คุณสามารถเลือกส่วนผสมได้เอง อ่อนโยนต่อผิว"}
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - image and tabs */}
          <div className="md:w-1/2">
            <div className="mb-6">
              <div className="bg-white/60 aspect-square rounded-lg shadow-md flex items-center justify-center">
                {loading ? (
                  <div className="animate-pulse flex items-center justify-center h-full w-full">
                    <div className="text-purple-800">กำลังโหลดรูปภาพ...</div>
                  </div>
                ) : (
                  <img
                    src={getBaseImage()}
                    alt={productType === 1 ? "แชมพูสมุนไพร" : "สบู่สมุนไพร"}
                    className="max-h-[90%] max-w-[90%] object-contain rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                className={`py-3 rounded-lg text-center transition-all ${
                  productType === 1
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white/70 text-gray-700 hover:bg-white"
                }`}
                onClick={() => toggleProductType(1)}
              >
                แชมพูสมุนไพร
              </button>
              <button
                className={`py-3 rounded-lg text-center transition-all ${
                  productType === 2
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white/70 text-gray-700 hover:bg-white"
                }`}
                onClick={() => toggleProductType(2)}
              >
                สบู่สมุนไพร
              </button>
            </div>
          </div>

          {/* Right column - customization options */}
          <div className="md:w-1/2">
            <h3 className="text-lg font-medium mb-4">เลือกส่วนผสมสมุนไพร</h3>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-purple-800">
                  กำลังโหลดส่วนผสม...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {filteredIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className={`p-4 rounded-lg border ${
                      selectedIngredients.includes(ingredient.id)
                        ? "border-purple-500 shadow-md"
                        : "border-gray-200"
                    } ${getIngredientColor(ingredient.name)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              ingredient.images ||
                              "https://via.placeholder.com/40"
                            }
                            alt={ingredient.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{ingredient.name}</p>
                            <p className="text-gray-600 text-sm">
                              {ingredient.name_en}
                            </p>
                          </div>
                        </div>
                        <p className="text-purple-700 mt-2">
                          +฿{ingredient.price}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(ingredient.id)}
                        onChange={() => toggleIngredient(ingredient.id)}
                        className="h-5 w-5 accent-purple-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-medium">ความเข้มข้น</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={concentration}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 100) {
                        setConcentration(value);
                      }
                    }}
                    className="w-12 text-center border rounded mr-1 py-1"
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={concentration}
                  onChange={(e) => setConcentration(parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>อ่อน</span>
                  {concentration < 33 && (
                    <span className="bg-purple-500 text-white px-2 py-1 text-xs rounded absolute left-0">
                      อ่อน
                    </span>
                  )}
                  {concentration >= 33 && concentration < 66 && (
                    <span className="bg-purple-500 text-white px-2 py-1 text-xs rounded absolute left-[45%]">
                      ปานกลาง
                    </span>
                  )}
                  {concentration >= 66 && (
                    <span className="bg-purple-500 text-white px-2 py-1 text-xs rounded absolute right-0">
                      เข้มข้น
                    </span>
                  )}
                  <span>ปานกลาง</span>
                  <span>เข้มข้น</span>
                </div>
              </div>
            </div>

            <button
              className="w-full text-left flex justify-between items-center py-4 border-t border-b mb-6"
              onClick={() => setShowDescriptions(!showDescriptions)}
            >
              <span className="font-medium">สรรพคุณของส่วนผสมที่เลือก</span>
              {showDescriptions ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {showDescriptions && selectedIngredients.length > 0 && (
              <div className="mb-6 bg-white/60 rounded-lg p-4 shadow-inner">
                {getSelectedIngredientsDetails().map((ing) => (
                  <div
                    key={ing.id}
                    className="mb-3 pb-3 border-b border-purple-100 last:border-0 last:mb-0 last:pb-0"
                  >
                    <h4 className="font-medium">{ing.name}</h4>
                    <p className="text-sm text-gray-700">{ing.description}</p>
                  </div>
                ))}
              </div>
            )}

            {showDescriptions && selectedIngredients.length === 0 && (
              <div className="mb-6 bg-white/60 rounded-lg p-4 shadow-inner text-center text-gray-500">
                โปรดเลือกส่วนผสมอย่างน้อย 1 ชนิด
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div className="flex border rounded-lg bg-white overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon size={18} />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                  aria-label="Increase quantity"
                >
                  <PlusIcon size={18} />
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600 block">ราคารวม</span>
                <span className="text-2xl font-bold text-purple-800">
                  ฿{calculateTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-600">
              ส่วนผสมที่เลือก: {selectedIngredients.length} ชนิด
            </p>

            <button
              onClick={addToCart}
              className={`w-full py-3 rounded-lg flex items-center justify-center transition shadow-md ${
                selectedIngredients.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
              disabled={selectedIngredients.length === 0}
            >
              <ShoppingCart className="mr-2" size={20} />
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Customize;
