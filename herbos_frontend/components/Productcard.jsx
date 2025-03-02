import Link from "next/link";

const Productcard = () => {
  return (
    <div className="max-w-xs bg-white shadow-lg rounded-2xl overflow-hidden">
        <img src="" className="w-full h-48 object-cover"></img>
        <div className="p-4">
        <h2 className="text-lg font-semibold">Product Name</h2>
        <p className="text-gray-500 text-sm">Product Description</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xl font-bold text-blue-500">Price</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default Productcard;
