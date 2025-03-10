import Image from "next/image";

const LoopBar = () => {
    return (
      <div className="w-full bg-violet-200 overflow-hidden">
        <div className="p-8">          
        </div>
        <div className="flex space-x-4 animate-scroll">
          {Array.from({ length: 360 }).map((_, index) => (
            <div key={`clone-${index}`} className="p-2 flex items-center whitespace-nowrap">
              <span className="text-lg font-bold mr-10">สมุนไพรไทยแท้ เพื่อสุขภาพที่ดีกว่า</span>
              <Image src="/images/blink.svg" width={20} height={10} alt="blink" />
            </div>
          ))}
        </div>
      </div>
    );
};

export default LoopBar;
