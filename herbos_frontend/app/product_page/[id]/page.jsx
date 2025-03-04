"use client";
import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import { useParams} from "next/navigation";
import AddToCart from "../../../components/AddToCart";


const product_page = () => {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);  


    useEffect(() => {
      fetch(`http://localhost:3100/products/${id}`)
        .then((res) => res.json())
        .then((data) => {setProduct(data)
                        setQuantity(1);})
        .catch((err) => console.error('Error:', err));
    }, []);

    return (
      <div className="w-full">
        <Navbar/>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-24 max-w-7xl mx-auto bg-white p-6 shadow-lg rounded-2xl">
        <div className="w-full md:w-1/2">
          <img
            src={product.images}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h2 className="text-4xl font-bold">{product.name}</h2>
          <p className="text-gray-600 text-xl">{product.description}</p>
          <span className="text-3xl font-bold text-black-600">{product.price} บาท
          <label className="text-3xl font-semibold"> จำนวน : </label>
                        <select
                            className="border rounded-lg p-2 text-lg"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {Array.from({ length: product.stock }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
            </span>
          <AddToCart productId={product.id} quantity={quantity}/>
        </div>
    </div>
    </div>
    );
  };
  export default product_page;