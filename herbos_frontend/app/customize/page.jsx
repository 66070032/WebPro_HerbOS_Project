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
  // State management
  const [productType, setProductType] = useState(1); // 1 = shampoo, 2 = soap
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [concentration, setConcentration] = useState(50);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [baseProducts, setBaseProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ingredientsResponse = await fetch(
          "http://localhost:3100/ingredients?custom_id=1,2,3"
        );
        if (!ingredientsResponse.ok) {
          throw new Error("Failed to fetch ingredients");
        }
        const ingredientsData = await ingredientsResponse.json();
        setIngredients(ingredientsData);

        const productsResponse = await fetch("http://localhost:3100/products");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch base products");
        }
        const productsData = await productsResponse.json();
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

  // Get base product data
  const getBaseProduct = () => {
    const baseProductId = productType === 1 ? 11 : 12;
    return baseProducts.find((product) => product.id === baseProductId);
  };

  const getBasePrice = () => {
    const baseProduct = getBaseProduct();
    return baseProduct ? baseProduct.price : 200;
  };

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
    setSelectedIngredients([]);
  };

  // Quantity management
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Get ingredient card background color
  const getIngredientColor = (name) => {
    if (["ขมิ้นชัน", "ขิง", "ไพล", "มะขาม"].includes(name)) {
      return "bg-amber-50 border-amber-200";
    } else if (["แตงกวา", "ว่านหางจระเข้", "มะกรูด"].includes(name)) {
      return "bg-green-50 border-green-200";
    } else if (["อัญชัน", "มังคุด"].includes(name)) {
      return "bg-purple-50 border-purple-200";
    } else {
      return "bg-white border-gray-200";
    }
  };

  const addToCart = async () => {
    if (selectedIngredients.length === 0) {
      alert("กรุณาเลือกส่วนผสมอย่างน้อย 1 ชนิด");
      return;
    }
  
    try {
      const baseProductName = productType === 1 ? "แชมพูสมุนไพร" : "สบู่สมุนไพร";
      const selectedIngNames = getSelectedIngredientsDetails()
        .map((ing) => ing.name)
        .join(", ");
      const productName = `${baseProductName} (${selectedIngNames})`;
  
      const cartData = {
        product_id: getBaseProduct()?.id || (productType === 1 ? 11 : 12),
        quantity: quantity,
        custom_name: productName,
        custom_ingredients: JSON.stringify(selectedIngredients),
        concentration: concentration,
        custom_price: calculateTotalPrice() / quantity,
      };
  
      const addCartPromises = Array(quantity).fill().map(() => 
        fetchWithAuth("http://localhost:3100/addcart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(cartData),
        })
      );
  
      await Promise.all(addCartPromises);
      alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว");
  
      setSelectedIngredients([]);
      setConcentration(50);
      setQuantity(1);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <h1 className="text-2xl font-medium mb-2 text-purple-800">
          {productType === 1 ? "แชมพูสมุนไพร" : "สบู่สมุนไพร"}
          <span className="text-lg text-gray-500 ml-2 font-normal">
            {productType === 1 ? "Herbal Shampoo" : "Herbal Soap"}
          </span>
        </h1>

        <p className="mb-8 text-gray-600 text-sm">
          {productType === 1
            ? "แชมพูสมุนไพรที่คุณสามารถเลือกส่วนผสมได้เอง เหมาะสำหรับทุกประเภทผมและหนังศีรษะ"
            : "สบู่สมุนไพรที่คุณสามารถเลือกส่วนผสมได้เอง อ่อนโยนต่อผิว"}
        </p>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left column - product image and type selection */}
          <div className="md:w-2/5">
            <div className="mb-6">
              <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg p-4 mb-6">
                {loading ? (
                  <div className="animate-pulse flex items-center justify-center h-full w-full">
                    <div className="text-purple-600">กำลังโหลดรูปภาพ...</div>
                  </div>
                ) : (
                  <img
                    src={getBaseImage()}
                    alt={productType === 1 ? "แชมพูสมุนไพร" : "สบู่สมุนไพร"}
                    className="max-h-[90%] max-w-[90%] object-contain"
                  />
                )}
              </div>
            </div>

            {/* Product type selection */}
            <div className="flex space-x-4 mb-8">
              <button
                className={`py-2 px-4 rounded-full text-center transition-all text-sm ${
                  productType === 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => toggleProductType(1)}
              >
                แชมพูสมุนไพร
              </button>
              <button
                className={`py-2 px-4 rounded-full text-center transition-all text-sm ${
                  productType === 2
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => toggleProductType(2)}
              >
                สบู่สมุนไพร
              </button>
            </div>
            
            {/* Price and cart section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex border rounded-md bg-white overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 hover:bg-gray-100 transition"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="px-3 py-1 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 hover:bg-gray-100 transition"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500 block">ราคารวม</span>
                  <span className="text-xl font-medium text-purple-800">
                    ฿{calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={addToCart}
                className={`w-full py-2 rounded-md flex items-center justify-center transition ${
                  selectedIngredients.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                disabled={selectedIngredients.length === 0}
              >
                <ShoppingCart className="mr-2" size={18} />
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>

          {/* Right column - customization options */}
          <div className="md:w-3/5">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-700">
                เลือกส่วนผสมสมุนไพร
              </h3>
              <span className="text-sm text-gray-500">
                ส่วนผสมที่เลือก: {selectedIngredients.length} ชนิด
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-purple-600">
                  กำลังโหลดส่วนผสม...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {filteredIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className={`p-3 rounded-md border transition-all ${
                      selectedIngredients.includes(ingredient.id)
                        ? "ring-1 ring-purple-500"
                        : ""
                    } ${getIngredientColor(ingredient.name)}`}
                    onClick={() => toggleIngredient(ingredient.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <img
                          src={
                            ingredient.images ||
                            "https://via.placeholder.com/40"
                          }
                          alt={ingredient.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">{ingredient.name}</p>
                          <p className="text-gray-500 text-xs">
                            {ingredient.name_en}
                          </p>
                          <p className="text-purple-700 text-sm mt-1">
                            +฿{ingredient.price}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(ingredient.id)}
                        onChange={() => toggleIngredient(ingredient.id)}
                        className="h-4 w-4 accent-purple-600 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Concentration slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">ความเข้มข้น</span>
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
                    className="w-12 text-center border rounded mr-1 py-1 text-sm"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div className="relative mt-4 mb-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={concentration}
                  onChange={(e) => setConcentration(parseInt(e.target.value))}
                  className="w-full h-1 accent-purple-600 appearance-none bg-gray-200 rounded-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>อ่อน</span>
                  <span>ปานกลาง</span>
                  <span>เข้มข้น</span>
                </div>
                <div className="absolute -top-4 transform -translate-x-1/2 left-1/2">
                  {concentration < 33 && (
                    <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full absolute -translate-x-8">
                      อ่อน
                    </span>
                  )}
                  {concentration >= 33 && concentration < 66 && (
                    <span className="bg-purple-500 text-white px-2 py-1 text-xs rounded-full absolute -translate-x-4">
                      ปานกลาง
                    </span>
                  )}
                  {concentration >= 66 && (
                    <span className="bg-purple-800 text-white px-2 py-1 text-xs rounded-full absolute">
                      เข้มข้น
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits section */}
            <button
              className="w-full text-left flex justify-between items-center py-3 border-t border-b mb-4 text-sm font-medium text-gray-700"
              onClick={() => setShowDescriptions(!showDescriptions)}
            >
              <span>สรรพคุณของส่วนผสมที่เลือก</span>
              {showDescriptions ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showDescriptions && (
              <div className="mb-4 p-4 rounded-md bg-gray-50 text-sm">
                {selectedIngredients.length > 0 ? (
                  getSelectedIngredientsDetails().map((ing) => (
                    <div
                      key={ing.id}
                      className="mb-3 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                    >
                      <h4 className="font-medium text-purple-700">{ing.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{ing.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    โปรดเลือกส่วนผสมอย่างน้อย 1 ชนิด
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Customize;