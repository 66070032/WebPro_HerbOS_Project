import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";

import Productcard from "../../components/Productcard";

const product = () => {

  return (
    <div className="w-full">
        <Navbar />
        <h1 className="text-3xl text-center">หมวดหมู่สินค้า</h1>
        <div className="flex justify-center items-center min-h-screen w-full">
          <Productcard />
        </div>


    </div>
  )
}
export default product