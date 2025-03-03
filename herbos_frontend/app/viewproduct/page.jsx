import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";

import Productcard from "../../components/Productcard";

const product = () => {

  return (
    <div className="w-full">
        <Navbar />
        <h1 className="">หมวดหมู่สินค้า</h1>
        <Productcard />

    </div>
  )
}
export default product