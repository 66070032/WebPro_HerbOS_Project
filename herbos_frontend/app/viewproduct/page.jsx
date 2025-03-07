import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";

import Productcard from "../../components/Productcard";

const product = () => {
  return (
    <div className="w-full bg-[#DFC8E7]">
      <Navbar />
      <div className="container mx-auto pt-28">

        <h1 className="text-3xl text-center">หมวดหมู่สินค้า</h1>
        <div className="flex justify-center items-center gap-8">

          <Image src="/images/herbcate.png" alt="herbcate" width={50} height={50} />
          <Image src="/images/shampoocate.png" alt="herbcate" width={50} height={50} />
        </div>
        <div className="flex justify-center items-center min-h-screen w-full mt-7">
          <Productcard />
        </div>
      </div>
    </div>
  );
};
export default product;
